#!/usr/bin/env bash
# Orchestra macOS/Linux Installer
# One-liner: curl -fsSL https://raw.githubusercontent.com/ReyCannavaro/orchestra/main/install.sh | bash

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
    echo -e "\033[1;36m📂 Found local core-skills directory. Syncing...\033[0m"
    cp -R "$SCRIPT_DIR/core-skills/"* "$TARGET_DIR/"
else
    echo -e "\033[1;36m🌐 Fetching latest Orchestra skills from GitHub (ReyCannavaro/orchestra)...\033[0m"
    TEMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'orchestra')
    ARCHIVE_URL="https://github.com/ReyCannavaro/orchestra/archive/refs/heads/main.tar.gz"

    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$ARCHIVE_URL" | tar -xz -C "$TEMP_DIR"
    elif command -v wget >/dev/null 2>&1; then
        wget -qO- "$ARCHIVE_URL" | tar -xz -C "$TEMP_DIR"
    else
        echo -e "\033[1;31mError: curl or wget is required to download skills archive.\033[0m"
        exit 1
    fi

    if [ -d "$TEMP_DIR/orchestra-main/core-skills" ]; then
        cp -R "$TEMP_DIR/orchestra-main/core-skills/"* "$TARGET_DIR/"
    else
        echo -e "\033[1;31mError: core-skills folder not found in downloaded archive.\033[0m"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
    rm -rf "$TEMP_DIR"
fi

echo -e "\033[1;32m✔ Successfully installed Orchestra Core Skills to $TARGET_DIR\033[0m"
echo -e "\033[1;35m✨ To scaffold a project, run: npx orchestra-os init\033[0m\n"
