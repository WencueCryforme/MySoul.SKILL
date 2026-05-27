"""
MySoul.SKILL SDK for Python
"""

from .client import MySoul
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
from .exceptions import (
    MySoulError,
    ValidationError,
    BuildError,
    ProjectNotFoundError,
)

__version__ = "1.0.0"
__all__ = [
    "MySoul",
    "SoulConfig",
    "DataStream",
    "StreamType",
    "Project",
    "ValidationResult",
    "BuildOptions",
    "BuildResult",
    "ChatResponse",
    "ChatHistory",
    "MySoulError",
    "ValidationError",
    "BuildError",
    "ProjectNotFoundError",
]
