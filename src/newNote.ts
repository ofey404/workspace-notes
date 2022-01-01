import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { addWorkspaceTagIfNo, noteRepoPath, showFile } from "./util";

function createNewNote(realtiveToBase: string | undefined) {
  if (realtiveToBase === null || realtiveToBase === "" || !realtiveToBase) {
    return;
  }

  let fullPath = path.join(noteRepoPath(), realtiveToBase);

  fs.ensureFile(fullPath).then(() => {
    addWorkspaceTagIfNo(fullPath);
    showFile(fullPath);
  });
}

export function newNote() {
  vscode.window
    .showInputBox({
      prompt: `Note path (relate to note repository root)`,
      value: "",
    })
    .then(createNewNote);
}
