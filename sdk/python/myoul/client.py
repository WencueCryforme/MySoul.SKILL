"""
MySoul.SKILL SDK 客户端
"""

import asyncio
from typing import Optional

from .types import (
    SoulConfig,
    DataStream,
    StreamType,
    Project,
    ValidationResult,
    BuildOptions,
    BuildResult,
    ChatResponse,
    ChatHistory,
)
from .exceptions import ValidationError, BuildError, ProjectNotFoundError
from .project import ProjectManager
from .data import DataManager
from .build import BuildManager
from .chat import ChatManager


class MySoul:
    """MySoul 客户端"""

    def __init__(self, config: SoulConfig):
        self.config = config
        self._project_manager = ProjectManager(config)
        self._data_manager = DataManager(config)
        self._build_manager = BuildManager(config)
        self._chat_manager = ChatManager(config)

    async def create_project(self, name: str) -> Project:
        """创建项目"""
        return await self._project_manager.create(name)

    async def list_projects(self) -> list[Project]:
        """列出所有项目"""
        return await self._project_manager.list()

    async def get_project(self, project_id: str) -> Project:
        """获取项目信息"""
        project = await self._project_manager.get(project_id)
        if not project:
            raise ProjectNotFoundError(project_id)
        return project

    async def delete_project(self, project_id: str) -> None:
        """删除项目"""
        await self._project_manager.delete(project_id)

    async def add_data(self, project_id: str, stream: DataStream) -> None:
        """添加数据流"""
        # 验证项目存在
        await self.get_project(project_id)

        # 验证数据流
        self._validate_stream(stream)

        # 添加数据
        await self._data_manager.add(project_id, stream)

    async def add_bulk_data(self, project_id: str, streams: list[DataStream]) -> None:
        """批量添加数据流"""
        # 验证项目存在
        await self.get_project(project_id)

        # 验证所有数据流
        for stream in streams:
            self._validate_stream(stream)

        # 添加数据
        await self._data_manager.add_bulk(project_id, streams)

    async def validate_data(self, project_id: str) -> ValidationResult:
        """验证数据质量"""
        # 验证项目存在
        await self.get_project(project_id)

        return await self._data_manager.validate(project_id)

    async def build(self, project_id: str, options: Optional[BuildOptions] = None) -> BuildResult:
        """构建克隆体"""
        # 验证项目存在
        await self.get_project(project_id)

        # 验证数据质量
        validation = await self.validate_data(project_id)
        if validation.score < 30:
            raise BuildError("数据质量不足，请添加更多数据", "validation")

        # 执行构建
        return await self._build_manager.build(project_id, options)

    async def chat(self, project_id: str, message: str, version: Optional[str] = None) -> ChatResponse:
        """发送对话消息"""
        return await self._chat_manager.send(project_id, message, version)

    async def get_chat_history(self, project_id: str) -> ChatHistory:
        """获取对话历史"""
        return await self._chat_manager.get_history(project_id)

    def _validate_stream(self, stream: DataStream) -> None:
        """验证数据流"""
        valid_types = [
            StreamType.DIARY,
            StreamType.BLOG,
            StreamType.SOCIAL,
            StreamType.INTERVIEW,
            StreamType.CONVERSATION,
            StreamType.VALUES,
            StreamType.THINKING,
            StreamType.PROFESSIONAL,
        ]

        if stream.type not in valid_types:
            raise ValidationError(
                f"无效的数据类型: {stream.type}",
                [f"有效类型: {', '.join(t.value for t in valid_types)}"],
            )

        if not stream.content or len(stream.content.strip()) == 0:
            raise ValidationError("数据内容不能为空")

        if len(stream.content) < 50:
            raise ValidationError("数据内容过短", ["建议至少 50 个字符"])
