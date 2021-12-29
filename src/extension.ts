// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";

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

function resolveHome(filepath: string | undefined) {
  if (path === null || !filepath) {
    return "";
  }

  if (filepath[0] === '~') {
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
function newNote() {
  const config = vscode.workspace.getConfiguration('vsnotes');
  const noteFolder = resolveHome(config.get('defaultNotePath'));
  
  vscode.window.showInformationMessage("noteFolder = " + noteFolder);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, "workspace-notes.newNote", newNote);
}

// this method is called when your extension is deactivated
export function deactivate() {}
