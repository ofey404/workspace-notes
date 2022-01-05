#!/usr/bin/env bash
set -x             # for debug
set -euo pipefail  # fail early
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" 

refresh_from_data() {
    local dirname=$1
    rm -rf $SCRIPT_DIR/notes
    cp -r $SCRIPT_DIR/data/notes $SCRIPT_DIR/notes
}

refresh_from_data notes
refresh_from_data workspace

mkdir -p $SCRIPT_DIR/workspace/.vscode

cat << EOF > $SCRIPT_DIR/workspace/.vscode/settings.json
{
  "workspaceNotes.noteRepoPath": "$SCRIPT_DIR/notes",
}
EOF

