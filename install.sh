#!/usr/bin/env bash
# Orchestra macOS/Linux Installer
# One-liner: curl -fsSL https://raw.githubusercontent.com/<username>/orchestra/main/install.sh | bash

set -e

echo ""
echo -e "\033[1;36m  ___  ____   ____ _   _ _____ ____ _____ ____     _    \033[0m"
echo -e "\033[1;36m / _ \|  _ \ / ___| | | | ____/ ___|_   _|  _ \   / \   \033[0m"
echo -e "\033[1;36m| | | | |_) | |   | |_| |  _| \___ \ | | | |_) | / _ \  \033[0m"
echo -e "\033[1;36m| |_| |  _ <| |___|  _  | |___ ___) || | |  _ < / ___ \ \033[0m"
echo -e "\033[1;36m \___/|_| \_\\\\____|_| |_|_____|____/ |_| |_| \_/_/   \\_\\\033[0m"
echo -e "\033[2m  The Symphony Paradigm for Autonomous Multi-Agent Engineering\033[0m"
echo ""

TARGET_DIR="$HOME/.agents/skills"
echo -e "\033[1;33m📦 Setting up Orchestra Global Hub at $TARGET_DIR...\033[0m"

mkdir -p "$TARGET_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
if [ -d "$SCRIPT_DIR/core-skills" ]; then
    cp -R "$SCRIPT_DIR/core-skills/"* "$TARGET_DIR/"
fi

echo -e "\033[1;32m✔ Successfully installed Orchestra Core Skills to $TARGET_DIR\033[0m"
echo -e "\033[1;35m✨ To scaffold a project, run: npx orchestra init\033[0m\n"
