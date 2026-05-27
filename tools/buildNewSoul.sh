#!/bin/bash
# MySoul.SKILL - 数字克隆体构建工具 (Unix/Linux/macOS)
# 用法: ./buildNewSoul.sh <命令> [选项]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECTS_DIR="${PROJECT_ROOT}/projects"

# 颜色
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

show_help() {
    echo -e "${BLUE}MySoul.SKILL 数字克隆体构建工具${NC}"
    echo ""
    echo "命令:"
    echo "  create <名称>   创建新项目"
    echo "  list            列出所有项目"
    echo "  info <名称>     显示项目信息"
    echo "  build <名称>    构建数字克隆体（需通过 AI Agent 执行）"
    echo "  export <名称>   导出产物 SKILL"
    echo "  help            显示帮助"
}

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

generate_id() {
    local rand=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 6 | head -n 1)
    echo "MS-${1}-${rand}"
}

get_timestamp() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

cmd_create() {
    local name="$1"
    [ -z "$name" ] && { log_error "请指定项目名称"; exit 1; }

    echo "$name" | grep -qE '^[a-zA-Z0-9_-]+$' || { log_error "名称只能含字母、数字、下划线、连字符"; exit 1; }

    local project_dir="${PROJECTS_DIR}/${name}"

    if [ -d "$project_dir" ]; then
        log_warn "项目 '${name}' 已存在"
        read -p "覆盖？(y/N): " confirm
        [ "$confirm" != "y" ] && [ "$confirm" != "Y" ] && { log_info "已取消"; exit 0; }
        rm -rf "$project_dir"
    fi

    local project_id=$(generate_id "$name")
    local timestamp=$(get_timestamp)

    mkdir -p "$project_dir"/{streams,output,logs}
    touch "$project_dir/streams/.gitkeep" "$project_dir/output/.gitkeep" "$project_dir/logs/.gitkeep"

    cat > "$project_dir/meta.json" << EOF
{
  "project_id": "${project_id}",
  "name": "${name}",
  "created_at": "${timestamp}",
  "updated_at": "${timestamp}",
  "version": "1.0.0",
  "status": "created",
  "data_streams": [],
  "build_count": 0,
  "config": {
    "stateful": true,
    "personality_scope": "full",
    "language": "zh-CN"
  }
}
EOF

    log_info "项目创建成功！"
    echo -e "  ${BLUE}项目ID${NC}: ${project_id}"
    echo -e "  ${BLUE}路径${NC}: ${project_dir}"
    echo ""
    echo "下一步：在加载 MySoul.SKILL 的 AI Agent 中执行 /add ${name} [数据]"
}

cmd_list() {
    [ ! -d "$PROJECTS_DIR" ] && { log_info "暂无项目"; exit 0; }

    echo -e "${BLUE}MySoul.SKILL 项目列表${NC}"
    echo ""
    local count=0
    for dir in "$PROJECTS_DIR"/*/; do
        [ -d "$dir" ] && [ -f "$dir/meta.json" ] || continue
        local pname=$(basename "$dir")
        local status=$(grep -o '"status": *"[^"]*"' "$dir/meta.json" | cut -d'"' -f4)
        echo -e "  ${GREEN}●${NC} ${pname} [${status}]"
        count=$((count + 1))
    done
    [ $count -eq 0 ] && log_info "暂无项目"
}

cmd_info() {
    local name="$1"
    [ -z "$name" ] && { log_error "请指定项目名称"; exit 1; }

    local project_dir="${PROJECTS_DIR}/${name}"
    [ ! -d "$project_dir" ] && { log_error "项目 '${name}' 不存在"; exit 1; }

    echo -e "${BLUE}项目信息: ${name}${NC}"
    echo ""
    cat "$project_dir/meta.json"
}

cmd_build() {
    local name="$1"
    [ -z "$name" ] && { log_error "请指定项目名称"; exit 1; }

    local project_dir="${PROJECTS_DIR}/${name}"
    [ ! -d "$project_dir" ] && { log_error "项目 '${name}' 不存在"; exit 1; }

    log_info "构建需要通过 AI Agent 执行"
    log_warn "请在加载 MySoul.SKILL 的 AI Agent 中运行: /build ${name}"
}

cmd_export() {
    local name="$1"
    [ -z "$name" ] && { log_error "请指定项目名称"; exit 1; }

    local output_dir="${PROJECTS_DIR}/${name}/output"
    [ ! -d "$output_dir" ] && { log_error "项目 '${name}' 尚未构建"; exit 1; }

    local skill_file=$(find "$output_dir" -name "*.md" -type f | head -1)
    [ -z "$skill_file" ] && { log_error "未找到产物 SKILL 文件"; exit 1; }

    if [ -n "$2" ]; then
        cp "$skill_file" "$2"
        log_info "已导出到: $2"
    else
        log_info "产物位置: ${skill_file}"
    fi
}

case "${1:-help}" in
    create) cmd_create "$2" ;;
    list)   cmd_list ;;
    info)   cmd_info "$2" ;;
    build)  cmd_build "$2" ;;
    export) cmd_export "$2" "$3" ;;
    help|*) show_help ;;
esac
