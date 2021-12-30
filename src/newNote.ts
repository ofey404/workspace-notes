import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { resolveHome } from "./util";

function showTextDocumentCallback(noteFullPath: string) {
  return () => {
    vscode.window.showTextDocument(vscode.Uri.file(noteFullPath), {
      preserveFocus: false,
      preview: false,
    });
  };
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
    fs.ensureFile(noteFullPath).then(showTextDocumentCallback(noteFullPath));
  };
}

export function newNote() {
  const config = vscode.workspace.getConfiguration("workspaceNotes");
  const noteFolder = resolveHome(config.get("defaultNotePath"));

  vscode.window
    .showInputBox({
      prompt: `Note path (relate to note repository root)`,
      value: "",
    })
    .then(createNewNoteCallback(noteFolder));
}
