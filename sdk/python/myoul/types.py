"""
MySoul.SKILL SDK 类型定义
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional


class StreamType(str, Enum):
    """数据流类型"""

    DIARY = "diary"
    BLOG = "blog"
    SOCIAL = "social"
    INTERVIEW = "interview"
    CONVERSATION = "conversation"
    VALUES = "values"
    THINKING = "thinking"
    PROFESSIONAL = "professional"


@dataclass
class SoulConfig:
    """SDK 配置"""

    name: str
    data_dir: str
    output_dir: str
    api_url: Optional[str] = None
    api_key: Optional[str] = None


@dataclass
class DataStream:
    """数据流"""

    type: StreamType
    content: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class Project:
    """项目"""

    id: str
    name: str
    created_at: str
    updated_at: str
    version: str
    data_streams: int
    total_words: int
    quality_score: int
    status: str = "active"


@dataclass
class ValidationResult:
    """验证结果"""

    score: int
    coverage: Dict[str, int]
    issues: List[str]
    recommendations: List[str]


@dataclass
class BuildOptions:
    """构建选项"""

    model: Optional[str] = None
    language: Optional[str] = None
    on_progress: Optional[Callable[[str, int], None]] = None


@dataclass
class PersonalityDimension:
    """人格维度"""

    label: str
    value: int
    level: str


@dataclass
class PersonalityModel:
    """人格模型"""

    dimensions: List[PersonalityDimension]
    overall_score: int


@dataclass
class BuildResult:
    """构建结果"""

    version: str
    score: int
    output_path: str
    personality: PersonalityModel


@dataclass
class ChatResponse:
    """对话响应"""

    text: str
    confidence: float
    personality_match: float


@dataclass
class ChatMessage:
    """对话消息"""

    id: str
    role: str
    content: str
    timestamp: str


@dataclass
class ChatHistory:
    """对话历史"""

    messages: List[ChatMessage] = field(default_factory=list)
    total: int = 0
