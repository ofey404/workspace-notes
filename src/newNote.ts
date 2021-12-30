import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { noteRepoPath, showFile } from "./util";

function ensureAndShow(file: string) {
  fs.ensureFile(file).then(() => {
    showFile(file);
  });
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
    ensureAndShow(fullPath);
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
