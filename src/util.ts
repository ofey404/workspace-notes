import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import * as os from "os";
import * as matter from "gray-matter";

export function showFile(path: string) {
  vscode.window.showTextDocument(vscode.Uri.file(path), {
    preserveFocus: false,
    preview: false,
  });
}

export function config() {
  return vscode.workspace.getConfiguration("workspaceNotes");
}

export function noteRepoPath() {
  return resolveHome(config().get("defaultNotePath"));
}

export function ignorePattern() {
  let patterns = config().get<Array<string>>("ignorePatterns") as Array<string>;
  let p: string = patterns
    .map((pattern) => {
      return "(" + pattern + ")";
    })
    .join("|");
  return new RegExp(p);
}

export function getWorkspacePath() {
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

function pushTagIfNo(
  obj: matter.GrayMatterFile<matter.Input>,
  tag: string,
  val: string
) {
  if (tag in obj.data) {
    if (obj.data[tag] instanceof Array) {
      if (!obj.data[tag].includes(val)) {
        obj.data[tag].push(val);
      }
    } else {
      if (val !== obj.data[tag]) {
        obj.data[tag] = [obj.data[tag], val];
      }
    }
  } else {
    obj.data[tag] = val;
  }
}

export function addWorkspaceTagIfNo(filePath: string) {
  let obj = matter(fs.readFileSync(filePath, "utf-8"));
  let workspacePath = getWorkspacePath();
  if (workspacePath === undefined) {
    return;
  }
  pushTagIfNo(obj, "workspace", workspacePath);
  fs.outputFileSync(filePath, matter.stringify(obj.content, obj.data));
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
