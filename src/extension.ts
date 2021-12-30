// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import * as fs from "fs-extra";

function registerCommand(
  context: vscode.ExtensionContext,
  command: string,
  callback: (...args: any[]) => any
) {
  let disposable = vscode.commands.registerCommand(command, callback);
  context.subscriptions.push(disposable);
}

function getWorkspacePath() {
  if (vscode.workspace.workspaceFolders !== undefined) {
    return vscode.workspace.workspaceFolders[0].uri.path;
  }
  return undefined;
}

// Resolves the home tilde.
function resolveHome(filepath: string | undefined) {
  if (path === null || !filepath) {
    return "";
  }

  if (filepath[0] === "~") {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

function playground() {
  const notePath = vscode.workspace
    .getConfiguration("workspaceNotes")
    .get("defaultNotePath");
  vscode.window.showInformationMessage("Note path is: " + notePath);

  let workspacePath = getWorkspacePath();
  if (workspacePath !== undefined) {
    let message = `YOUR-EXTENSION: workspace = ${workspacePath}`;
    vscode.window.showInformationMessage(message);
  } else {
    let message =
      "YOUR-EXTENSION: Working folder not found, open a folder an try again";
    vscode.window.showErrorMessage(message);
  }

  vscode.window.showInformationMessage("Hello World from workspace-notes!");
}

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
    fs.ensureFile(noteFullPath)
      .then(showTextDocumentCallback(noteFullPath));
  };
}

function newNote() {
  const config = vscode.workspace.getConfiguration("workspaceNotes");
  const noteFolder = resolveHome(config.get("defaultNotePath"));

  vscode.window
    .showInputBox({
      prompt: `Note path (relate to note repository root)`,
      value: "",
    })
    .then(createNewNoteCallback(noteFolder));
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, "workspace-notes.newNote", newNote);
}

// this method is called when your extension is deactivated
export function deactivate() {}
