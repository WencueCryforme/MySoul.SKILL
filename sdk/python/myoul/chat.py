"""
对话管理模块
"""

import json
import time
from pathlib import Path
from typing import Optional

from .types import SoulConfig, ChatResponse, ChatHistory, ChatMessage


class ChatManager:
    """对话管理器"""

    def __init__(self, config: SoulConfig):
        self.config = config

    async def send(
        self, project_id: str, message: str, version: Optional[str] = None
    ) -> ChatResponse:
        """发送消息"""
        # 加载克隆体
        clone = await self._load_clone(project_id, version)

        # 生成响应
        response = self._generate_response(clone, message)

        # 保存对话历史
        await self._save_message(
            project_id,
            ChatMessage(
                id=self._generate_id(),
                role="user",
                content=message,
                timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            ),
        )

        await self._save_message(
            project_id,
            ChatMessage(
                id=self._generate_id(),
                role="assistant",
                content=response.text,
                timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            ),
        )

        return response

    async def get_history(self, project_id: str) -> ChatHistory:
        """获取对话历史"""
        history_path = (
            Path(self.config.data_dir) / project_id / "chat-history.json"
        )

        if not history_path.exists():
            return ChatHistory(messages=[], total=0)

        try:
            data = json.loads(history_path.read_text())
            messages = [ChatMessage(**msg) for msg in data.get("messages", [])]
            return ChatHistory(messages=messages, total=data.get("total", 0))
        except (json.JSONDecodeError, TypeError):
            return ChatHistory(messages=[], total=0)

    async def _load_clone(
        self, project_id: str, version: Optional[str] = None
    ) -> Optional[dict]:
        """加载克隆体"""
        output_dir = Path(self.config.output_dir) / project_id

        if not output_dir.exists():
            return None

        skill_files = list(output_dir.glob("*.md"))
        if not skill_files:
            return None

        # 获取最新版本或指定版本
        if version:
            target_file = output_dir / f"v{version}.md"
        else:
            target_file = sorted(skill_files)[-1]

        if not target_file.exists():
            return None

        content = target_file.read_text()
        return {"content": content, "project_id": project_id}

    def _generate_response(self, clone: Optional[dict], message: str) -> ChatResponse:
        """生成响应"""
        if not clone:
            return ChatResponse(
                text="抱歉，我还没有被构建。请先构建数字克隆体。",
                confidence=0.0,
                personality_match=0.0,
            )

        lower_message = message.lower()

        if any(word in lower_message for word in ["你好", "hi", "hello"]):
            return ChatResponse(
                text="你好！我是你的数字克隆体，很高兴和你聊天。",
                confidence=0.9,
                personality_match=0.85,
            )

        if any(word in lower_message for word in ["你是谁", "who are you"]):
            return ChatResponse(
                text="我是基于你的真实数据构建的数字克隆体，代表你的思维方式和表达风格。",
                confidence=0.85,
                personality_match=0.9,
            )

        if any(word in lower_message for word in ["谢谢", "thank"]):
            return ChatResponse(
                text="不客气！如果还有其他问题，随时可以问我。",
                confidence=0.95,
                personality_match=0.88,
            )

        # 默认响应
        return ChatResponse(
            text=f'收到你的消息："{message}"。我会根据我的人格特征来回应你。',
            confidence=0.7,
            personality_match=0.75,
        )

    async def _save_message(
        self, project_id: str, message: ChatMessage
    ) -> None:
        """保存消息"""
        history = await self.get_history(project_id)
        history.messages.append(message)
        history.total = len(history.messages)

        history_path = (
            Path(self.config.data_dir) / project_id / "chat-history.json"
        )
        history_path.parent.mkdir(parents=True, exist_ok=True)

        data = {
            "messages": [msg.__dict__ for msg in history.messages],
            "total": history.total,
        }
        history_path.write_text(json.dumps(data, indent=2, ensure_ascii=False))

    def _generate_id(self) -> str:
        """生成唯一 ID"""
        return f"{int(time.time() * 1000)}-{id(self) % 10000:04d}"
