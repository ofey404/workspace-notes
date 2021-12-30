import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { noteRepoPath, showFile } from "./util";

function ensureAndShow(file: string) {
  fs.ensureFile(file).then(() => {
    showFile(file);
  });
}

function createNewNoteCallback(noteFolder: string) {
  return (notePath: string | undefined) => {
    // Check for aborting the new note dialog
    if (notePath === null) {
      vscode.window.showErrorMessage("New note creation aborted.");
      return;
    }

    // Check for empty string but confirmation in the new note dialog
    if (notePath === "" || !notePath) {
      vscode.window.showErrorMessage("New note name should not be empty.");
      return;
    }

    let noteFullPath = path.join(noteFolder, notePath);
    ensureAndShow(noteFullPath);
  };
}

export function newNote() {
  vscode.window
    .showInputBox({
      prompt: `Note path (relate to note repository root)`,
      value: "",
    })
    .then(createNewNoteCallback(noteRepoPath()));
}
