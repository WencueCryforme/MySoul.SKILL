"""
项目管理模块
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from .types import SoulConfig, Project
from .exceptions import ValidationError, ProjectNotFoundError


class ProjectManager:
    """项目管理器"""

    def __init__(self, config: SoulConfig):
        self.config = config

    async def create(self, name: str) -> Project:
        """创建项目"""
        # 验证项目名称
        self._validate_project_name(name)

        # 检查项目是否已存在
        existing = await self.get(name)
        if existing:
            raise ValidationError(f"项目已存在: {name}")

        # 创建项目目录
        project_dir = Path(self.config.data_dir) / name
        project_dir.mkdir(parents=True, exist_ok=True)
        (project_dir / "data").mkdir(exist_ok=True)

        # 创建 meta.json
        now = datetime.now().isoformat()
        meta = Project(
            id=name,
            name=name,
            created_at=now,
            updated_at=now,
            version="1.0.0",
            data_streams=0,
            total_words=0,
            quality_score=0,
            status="active",
        )

        meta_path = project_dir / "meta.json"
        meta_path.write_text(json.dumps(meta.__dict__, indent=2, ensure_ascii=False))

        return meta

    async def list(self) -> list[Project]:
        """列出所有项目"""
        projects = []
        data_dir = Path(self.config.data_dir)

        if not data_dir.exists():
            return projects

        for item in data_dir.iterdir():
            if item.is_dir():
                meta_path = item / "meta.json"
                if meta_path.exists():
                    try:
                        meta_data = json.loads(meta_path.read_text())
                        projects.append(Project(**meta_data))
                    except (json.JSONDecodeError, TypeError):
                        continue

        return projects

    async def get(self, project_id: str) -> Optional[Project]:
        """获取项目信息"""
        meta_path = Path(self.config.data_dir) / project_id / "meta.json"

        if not meta_path.exists():
            return None

        try:
            meta_data = json.loads(meta_path.read_text())
            return Project(**meta_data)
        except (json.JSONDecodeError, TypeError):
            return None

    async def update(self, project_id: str, **kwargs) -> Project:
        """更新项目信息"""
        project = await self.get(project_id)
        if not project:
            raise ProjectNotFoundError(project_id)

        # 更新字段
        for key, value in kwargs.items():
            if hasattr(project, key):
                setattr(project, key, value)

        project.updated_at = datetime.now().isoformat()

        # 保存更新
        meta_path = Path(self.config.data_dir) / project_id / "meta.json"
        meta_path.write_text(json.dumps(project.__dict__, indent=2, ensure_ascii=False))

        return project

    async def delete(self, project_id: str) -> None:
        """删除项目"""
        project_dir = Path(self.config.data_dir) / project_id

        if not project_dir.exists():
            raise ProjectNotFoundError(project_id)

        import shutil

        shutil.rmtree(project_dir)

    def _validate_project_name(self, name: str) -> None:
        """验证项目名称"""
        if not name or len(name.strip()) == 0:
            raise ValidationError("项目名称不能为空")

        import re

        if not re.match(r"^[a-zA-Z0-9_-]+$", name):
            raise ValidationError("项目名称只能包含字母、数字、下划线和连字符")

        if len(name) > 64:
            raise ValidationError("项目名称不能超过 64 个字符")
