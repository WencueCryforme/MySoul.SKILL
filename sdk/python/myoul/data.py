"""
数据管理模块
"""

import json
import re
import time
from pathlib import Path
from typing import Dict, List

from .types import SoulConfig, DataStream, ValidationResult
from .exceptions import ValidationError, DataStreamError
from .project import ProjectManager


class DataManager:
    """数据管理器"""

    def __init__(self, config: SoulConfig):
        self.config = config
        self._project_manager = ProjectManager(config)

    async def add(self, project_id: str, stream: DataStream) -> None:
        """添加数据流"""
        # 匿名化处理
        anonymized = self._anonymize(stream)

        # 计算质量分数
        quality = self._calculate_quality(anonymized)

        # 保存数据
        data_dir = Path(self.config.data_dir) / project_id / "data"
        data_dir.mkdir(parents=True, exist_ok=True)

        filename = f"{stream.type.value}-{int(time.time() * 1000)}.json"
        file_path = data_dir / filename

        data = {
            "type": stream.type.value,
            "content": anonymized.content,
            "metadata": stream.metadata,
            "quality_score": quality,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }

        file_path.write_text(json.dumps(data, indent=2, ensure_ascii=False))

        # 更新项目元数据
        await self._update_project_meta(project_id, stream, quality)

    async def add_bulk(self, project_id: str, streams: List[DataStream]) -> None:
        """批量添加数据流"""
        for stream in streams:
            await self.add(project_id, stream)

    async def validate(self, project_id: str) -> ValidationResult:
        """验证数据质量"""
        data_dir = Path(self.config.data_dir) / project_id / "data"
        issues: List[str] = []
        recommendations: List[str] = []
        coverage: Dict[str, int] = {
            "diary": 0,
            "blog": 0,
            "social": 0,
            "interview": 0,
            "conversation": 0,
            "values": 0,
            "thinking": 0,
            "professional": 0,
        }

        if not data_dir.exists():
            return ValidationResult(
                score=0,
                coverage=coverage,
                issues=["未找到数据文件"],
                recommendations=["请先添加数据流"],
            )

        total_words = 0
        total_score = 0
        count = 0

        for file_path in data_dir.glob("*.json"):
            try:
                data = json.loads(file_path.read_text())

                # 统计字数
                total_words += len(data.get("content", ""))

                # 统计质量分数
                total_score += data.get("quality_score", 0)
                count += 1

                # 统计覆盖度
                stream_type = data.get("type")
                if stream_type in coverage:
                    coverage[stream_type] = min(100, coverage[stream_type] + 20)

            except (json.JSONDecodeError, KeyError):
                continue

        # 检查覆盖度
        covered_types = sum(1 for v in coverage.values() if v > 0)
        if covered_types < 3:
            issues.append("数据类型覆盖不足")
            recommendations.append("建议添加更多类型的数据流")

        # 检查总字数
        if total_words < 1000:
            issues.append("总字数不足")
            recommendations.append("建议添加更多内容，至少 1000 字")

        # 计算总分
        score = round(total_score / count) if count > 0 else 0

        return ValidationResult(
            score=score,
            coverage=coverage,
            issues=issues,
            recommendations=recommendations,
        )

    def _anonymize(self, stream: DataStream) -> DataStream:
        """匿名化处理"""
        content = stream.content

        # 替换手机号
        content = re.sub(r"1[3-9]\d{9}", "[手机号]", content)

        # 替换邮箱
        content = re.sub(
            r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", "[邮箱]", content
        )

        # 替换身份证号
        content = re.sub(
            r"[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]",
            "[身份证号]",
            content,
        )

        return DataStream(type=stream.type, content=content, metadata=stream.metadata)

    def _calculate_quality(self, stream: DataStream) -> int:
        """计算质量分数"""
        score = 0

        # 长度评分（最高 40 分）
        length = len(stream.content)
        if length > 2000:
            score += 40
        elif length > 1000:
            score += 30
        elif length > 500:
            score += 20
        elif length > 100:
            score += 10

        # 类型评分（最高 30 分）
        type_scores = {
            "values": 30,
            "conversation": 28,
            "interview": 28,
            "diary": 25,
            "thinking": 25,
            "blog": 20,
            "professional": 20,
            "social": 15,
        }
        score += type_scores.get(stream.type.value, 10)

        # 内容丰富度评分（最高 30 分）
        sentences = len(re.split(r"[。！？.!?]", stream.content))
        if sentences > 30:
            score += 30
        elif sentences > 20:
            score += 25
        elif sentences > 10:
            score += 20
        elif sentences > 5:
            score += 15
        else:
            score += 10

        return min(100, score)

    async def _update_project_meta(
        self, project_id: str, stream: DataStream, quality: int
    ) -> None:
        """更新项目元数据"""
        project = await self._project_manager.get(project_id)
        if not project:
            return

        # 计算新的平均质量分数
        new_score = round(
            (project.quality_score * project.data_streams + quality)
            / (project.data_streams + 1)
        )

        await self._project_manager.update(
            project_id,
            data_streams=project.data_streams + 1,
            total_words=project.total_words + len(stream.content),
            quality_score=new_score,
        )
