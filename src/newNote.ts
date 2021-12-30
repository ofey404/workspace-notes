import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import * as matter from "gray-matter";
import { getWorkspacePath, noteRepoPath, showFile } from "./util";

function addWorkspaceTagIfNo(filePath: string) {
  let s = fs.readFileSync(filePath, "utf-8");
  let obj = matter(s);
  let workspacePath = getWorkspacePath();
  if (workspacePath === undefined) {
    return;
  }
  if ("workspace" in obj.data) {
    if (obj.data.workspace instanceof Array) {
      if (!obj.data.workspace.includes(workspacePath)) {
        obj.data.workspace.push(workspacePath);
      }
    } else {
      if (workspacePath !== obj.data.workspace) {
        obj.data.workspace = [obj.data.workspace, workspacePath];
      }
    }
  } else {
    obj.data.workspace = getWorkspacePath();
  }
  s = matter.stringify(obj.content, obj.data);
  fs.outputFileSync(filePath, s);
}

function createNewNote() {
  return (realtiveToBase: string | undefined) => {
    // Check for aborting the new note dialog
    if (realtiveToBase === null) {
      vscode.window.showErrorMessage("New note creation aborted.");
      return;
    }

    // Check for empty string but confirmation in the new note dialog
    if (realtiveToBase === "" || !realtiveToBase) {
      vscode.window.showErrorMessage("New note name should not be empty.");
      return;
    }

    let fullPath = path.join(noteRepoPath(), realtiveToBase);

    fs.ensureFile(fullPath).then(() => {
      addWorkspaceTagIfNo(fullPath);
      showFile(fullPath);
    });
  };
}

export function newNote() {
  vscode.window
    .showInputBox({
      prompt: `Note path (relate to note repository root)`,
      value: "",
    })
    .then(createNewNote());
}
