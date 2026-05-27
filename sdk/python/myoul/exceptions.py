"""
MySoul.SKILL SDK 异常定义
"""


class MySoulError(Exception):
    """基础异常"""

    pass


class ValidationError(MySoulError):
    """验证错误"""

    def __init__(self, message: str, issues: list[str] | None = None):
        super().__init__(message)
        self.issues = issues or []


class BuildError(MySoulError):
    """构建错误"""

    def __init__(self, message: str, stage: str = ""):
        super().__init__(message)
        self.stage = stage


class ProjectNotFoundError(MySoulError):
    """项目不存在错误"""

    def __init__(self, project_id: str):
        super().__init__(f"项目不存在: {project_id}")


class DataStreamError(MySoulError):
    """数据流错误"""

    pass


class ApiError(MySoulError):
    """API 错误"""

    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.status_code = status_code
