import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

function config() {
  return vscode.workspace.getConfiguration("workspaceNotes");
}

export function repoPath() {
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

function resolveHome(filepath: string | undefined) {
  if (path === null || !filepath) {
    return "";
  }

  if (filepath[0] === "~") {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

