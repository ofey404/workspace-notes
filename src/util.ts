import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";

function getWorkspacePath() {
  if (vscode.workspace.workspaceFolders !== undefined) {
    return vscode.workspace.workspaceFolders[0].uri.path;
  }
  return undefined;
}


// Resolves the home tilde.
export function resolveHome(filepath: string | undefined) {
  if (path === null || !filepath) {
    return "";
  }

  if (filepath[0] === "~") {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}


export function playground() {
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
