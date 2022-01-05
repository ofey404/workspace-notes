#!/usr/bin/env bash
set -x             # for debug
set -euo pipefail  # fail early
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )" 

WORKSPACE_DIR=$SCRIPT_DIR/workspace
NOTE_DIR=$SCRIPT_DIR/notes

refresh_from_data() {
    local dirname=$1
    rm -rf $SCRIPT_DIR/$dirname
    cp -r $SCRIPT_DIR/data/$dirname $SCRIPT_DIR/$dirname
}

refresh_from_data notes
refresh_from_data workspace

mkdir -p $WORKSPACE_DIR/.vscode

cat << EOF > $WORKSPACE_DIR/.vscode/settings.json
{
  "workspaceNotes.noteRepoPath": "$NOTE_DIR",
}
EOF

find $SCRIPT_DIR/notes -type f -exec sed -i "s:IS_WORKSPACE_NOTE:$WORKSPACE_DIR:g" {} \;
