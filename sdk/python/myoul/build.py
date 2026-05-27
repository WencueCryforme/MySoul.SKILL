"""
构建管理模块
"""

import json
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

from .types import (
    SoulConfig,
    BuildOptions,
    BuildResult,
    PersonalityModel,
    PersonalityDimension,
)
from .exceptions import BuildError
from .project import ProjectManager
from .data import DataManager


class BuildManager:
    """构建管理器"""

    def __init__(self, config: SoulConfig):
        self.config = config
        self._project_manager = ProjectManager(config)
        self._data_manager = DataManager(config)

    async def build(
        self, project_id: str, options: Optional[BuildOptions] = None
    ) -> BuildResult:
        """执行构建"""
        project = await self._project_manager.get(project_id)
        if not project:
            raise BuildError("项目不存在", "init")

        # 读取所有数据
        data = await self._load_all_data(project_id)

        # 执行构建阶段
        stages = [
            ("数据预处理", 15, lambda: self._preprocess_data(data)),
            ("特征提取", 35, lambda: self._extract_features(data)),
            ("人格建模", 20, lambda: self._build_personality(data)),
            ("SKILL 生成", 20, lambda: self._generate_skill(project_id, data)),
            ("验证输出", 10, lambda: self._validate_output(project_id)),
        ]

        total_progress = 0
        personality = None

        for stage_name, weight, handler in stages:
            if options and options.on_progress:
                options.on_progress(stage_name, total_progress)

            try:
                result = handler()
                if isinstance(result, PersonalityModel):
                    personality = result
            except Exception as e:
                raise BuildError(f"构建失败: {str(e)}", stage_name)

            total_progress += weight

        if options and options.on_progress:
            options.on_progress("完成", 100)

        # 更新版本号
        new_version = self._increment_version(project.version)
        await self._project_manager.update(project_id, version=new_version)

        # 生成输出路径
        output_path = str(
            Path(self.config.output_dir) / project_id / f"v{new_version}.md"
        )

        return BuildResult(
            version=new_version,
            score=project.quality_score,
            output_path=output_path,
            personality=personality or self._get_default_personality(),
        )

    async def _load_all_data(self, project_id: str) -> List[Dict[str, Any]]:
        """加载所有数据"""
        data_dir = Path(self.config.data_dir) / project_id / "data"
        data = []

        if not data_dir.exists():
            return data

        for file_path in data_dir.glob("*.json"):
            try:
                content = json.loads(file_path.read_text())
                data.append(content)
            except (json.JSONDecodeError, KeyError):
                continue

        return data

    def _preprocess_data(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """数据预处理"""
        return [
            {**item, "content": item.get("content", "").strip(), "processed": True}
            for item in data
        ]

    def _extract_features(self, data: List[Dict[str, Any]]) -> Dict[str, int]:
        """特征提取"""
        features: Dict[str, int] = {
            "diary": 0,
            "blog": 0,
            "social": 0,
            "interview": 0,
            "conversation": 0,
            "values": 0,
            "thinking": 0,
            "professional": 0,
        }

        for item in data:
            stream_type = item.get("type")
            if stream_type in features:
                features[stream_type] += len(item.get("content", ""))

        return features

    def _build_personality(self, data: List[Dict[str, Any]]) -> PersonalityModel:
        """人格建模"""
        dimensions = [
            PersonalityDimension(
                label="核心价值观",
                value=self._calculate_dimension_score(data, "values"),
                level="良好",
            ),
            PersonalityDimension(
                label="思维模式",
                value=self._calculate_dimension_score(data, "thinking"),
                level="良好",
            ),
            PersonalityDimension(
                label="表达风格",
                value=self._calculate_dimension_score(data, "conversation"),
                level="良好",
            ),
            PersonalityDimension(
                label="知识体系",
                value=self._calculate_dimension_score(data, "professional"),
                level="良好",
            ),
            PersonalityDimension(
                label="人际关系",
                value=self._calculate_dimension_score(data, "social"),
                level="良好",
            ),
            PersonalityDimension(
                label="情感特征",
                value=self._calculate_dimension_score(data, "diary"),
                level="良好",
            ),
            PersonalityDimension(
                label="生活态度",
                value=self._calculate_dimension_score(data, "blog"),
                level="良好",
            ),
            PersonalityDimension(label="开场白与示例", value=75, level="良好"),
        ]

        overall_score = round(sum(d.value for d in dimensions) / len(dimensions))

        return PersonalityModel(dimensions=dimensions, overall_score=overall_score)

    def _calculate_dimension_score(
        self, data: List[Dict[str, Any]], stream_type: str
    ) -> int:
        """计算维度分数"""
        type_data = [d for d in data if d.get("type") == stream_type]
        if not type_data:
            return 50

        total_length = sum(len(d.get("content", "")) for d in type_data)
        avg_quality = sum(d.get("quality_score", 50) for d in type_data) / len(type_data)

        # 基于长度和质量计算分数
        score = 50
        if total_length > 2000:
            score += 20
        elif total_length > 1000:
            score += 15
        elif total_length > 500:
            score += 10

        score += (avg_quality - 50) * 0.5

        return min(100, max(0, round(score)))

    async def _generate_skill(
        self, project_id: str, data: List[Dict[str, Any]]
    ) -> None:
        """生成 SKILL 文件"""
        project = await self._project_manager.get(project_id)
        if not project:
            return

        output_dir = Path(self.config.output_dir) / project_id
        output_dir.mkdir(parents=True, exist_ok=True)

        content = f"""# {project.name} 的数字克隆体

## 身份声明
我是 {project.name} 的数字克隆体，基于真实数据构建。

## 核心人格
基于 {project.data_streams} 个数据流构建，总字数 {project.total_words}。

## 对话指南
- 保持人格一致性
- 尊重用户边界
- 提供有价值的对话

## 版本信息
- 版本: {project.version}
- 质量评分: {project.quality_score}/100
- 构建时间: {time.strftime("%Y-%m-%dT%H:%M:%SZ")}
"""

        output_path = output_dir / f"v{project.version}.md"
        output_path.write_text(content)

    async def _validate_output(self, project_id: str) -> None:
        """验证输出"""
        project = await self._project_manager.get(project_id)
        if not project:
            return

        output_path = (
            Path(self.config.output_dir) / project_id / f"v{project.version}.md"
        )

        if not output_path.exists():
            raise BuildError("输出文件不存在", "验证输出")

    def _increment_version(self, version: str) -> str:
        """递增版本号"""
        parts = version.split(".")
        parts[2] = str(int(parts[2]) + 1)
        return ".".join(parts)

    def _get_default_personality(self) -> PersonalityModel:
        """获取默认人格模型"""
        return PersonalityModel(
            dimensions=[
                PersonalityDimension(label="核心价值观", value=50, level="基本"),
                PersonalityDimension(label="思维模式", value=50, level="基本"),
                PersonalityDimension(label="表达风格", value=50, level="基本"),
                PersonalityDimension(label="知识体系", value=50, level="基本"),
                PersonalityDimension(label="人际关系", value=50, level="基本"),
                PersonalityDimension(label="情感特征", value=50, level="基本"),
                PersonalityDimension(label="生活态度", value=50, level="基本"),
                PersonalityDimension(label="开场白与示例", value=50, level="基本"),
            ],
            overall_score=50,
        )
