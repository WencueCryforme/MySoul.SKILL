@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: MySoul.SKILL - 数字克隆体构建工具 (Windows)
:: 用法: buildNewSoul.cmd <命令> [选项]

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "PROJECTS_DIR=%PROJECT_ROOT%\projects"

if "%~1"=="" goto :help
if "%~1"=="help" goto :help
if "%~1"=="--help" goto :help
if "%~1"=="-h" goto :help
goto :%~1 2>nul || goto :unknown

:help
echo.
echo MySoul.SKILL 数字克隆体构建工具
echo.
echo 命令:
echo   create ^<名称^>   创建新项目
echo   list            列出所有项目
echo   info ^<名称^>     显示项目信息
echo   build ^<名称^>    构建数字克隆体（需通过 AI Agent 执行）
echo   export ^<名称^>   导出产物 SKILL
echo   help            显示帮助
echo.
goto :eof

:create
if "%~2"=="" (
    echo [ERROR] 请指定项目名称
    goto :eof
)

set "NAME=%~2"
set "PROJECT_DIR=%PROJECTS_DIR%\%NAME%"

if exist "%PROJECT_DIR%" (
    echo [WARN] 项目 '%NAME%' 已存在
    set /p "CONFIRM=覆盖？(y/N): "
    if /i "!CONFIRM!" neq "y" (
        echo [INFO] 已取消
        goto :eof
    )
    rmdir /s /q "%PROJECT_DIR%"
)

:: 生成随机ID
set "RAND="
for /l %%i in (1,1,6) do (
    set /a "r=!random! %% 36"
    if !r! lss 10 (
        set "RAND=!RAND!!r!"
    ) else (
        set /a "c=!r! - 10 + 65"
        cmd /c exit /b !c!
        set "RAND=!RAND!!=exitcodeAscii!"
    )
)
set "PROJECT_ID=MS-%NAME%-%RAND%"

:: 获取时间戳
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "DT=%%I"
set "TIMESTAMP=%DT:~0,4%-%DT:~4,2%-%DT:~6,2%T%DT:~8,2%:%DT:~10,2%:%DT:~12,2%Z"

:: 创建目录
mkdir "%PROJECT_DIR%\streams"
mkdir "%PROJECT_DIR%\output"
mkdir "%PROJECT_DIR%\logs"

type nul > "%PROJECT_DIR%\streams\.gitkeep"
type nul > "%PROJECT_DIR%\output\.gitkeep"
type nul > "%PROJECT_DIR%\logs\.gitkeep"

:: 创建 meta.json
(
echo {
echo   "project_id": "%PROJECT_ID%",
echo   "name": "%NAME%",
echo   "created_at": "%TIMESTAMP%",
echo   "updated_at": "%TIMESTAMP%",
echo   "version": "1.0.0",
echo   "status": "created",
echo   "data_streams": [],
echo   "build_count": 0,
echo   "config": {
echo     "stateful": true,
echo     "personality_scope": "full",
echo     "language": "zh-CN"
echo   }
echo }
) > "%PROJECT_DIR%\meta.json"

echo.
echo [INFO] 项目创建成功！
echo   项目ID: %PROJECT_ID%
echo   路径: %PROJECT_DIR%
echo.
echo 下一步：在加载 MySoul.SKILL 的 AI Agent 中执行 /add %NAME% [数据]
echo.
goto :eof

:list
if not exist "%PROJECTS_DIR%" (
    echo [INFO] 暂无项目
    goto :eof
)
echo.
echo MySoul.SKILL 项目列表
echo.
for /d %%D in ("%PROJECTS_DIR%\*") do (
    if exist "%%D\meta.json" (
        echo   ● %%~nxD
    )
)
echo.
goto :eof

:info
if "%~2"=="" (
    echo [ERROR] 请指定项目名称
    goto :eof
)
set "PROJECT_DIR=%PROJECTS_DIR%\%~2"
if not exist "%PROJECT_DIR%" (
    echo [ERROR] 项目 '%~2' 不存在
    goto :eof
)
echo.
echo 项目信息: %~2
echo.
type "%PROJECT_DIR%\meta.json"
echo.
goto :eof

:build
if "%~2"=="" (
    echo [ERROR] 请指定项目名称
    goto :eof
)
set "PROJECT_DIR=%PROJECTS_DIR%\%~2"
if not exist "%PROJECT_DIR%" (
    echo [ERROR] 项目 '%~2' 不存在
    goto :eof
)
echo [INFO] 构建需要通过 AI Agent 执行
echo [WARN] 请在加载 MySoul.SKILL 的 AI Agent 中运行: /build %~2
goto :eof

:export
if "%~2"=="" (
    echo [ERROR] 请指定项目名称
    goto :eof
)
set "OUTPUT_DIR=%PROJECTS_DIR%\%~2\output"
if not exist "%OUTPUT_DIR%" (
    echo [ERROR] 项目 '%~2' 尚未构建
    goto :eof
)
for %%F in ("%OUTPUT_DIR%\*.md") do (
    if "%~3" neq "" (
        copy "%%F" "%~3" >nul
        echo [INFO] 已导出到: %~3
    ) else (
        echo [INFO] 产物位置: %%F
    )
    goto :eof
)
echo [ERROR] 未找到产物 SKILL 文件
goto :eof

:unknown
echo [ERROR] 未知命令: %~1
echo 使用 'buildNewSoul.cmd help' 查看帮助
goto :eof
