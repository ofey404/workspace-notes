import * as fs from "fs-extra";
import * as matter from "gray-matter";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

function config() {
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

// ================ Tag management ==================================

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

export async function addWorkspaceTagIfNo(filePath: string) {
  let obj = matter(await fs.readFile(filePath, "utf-8"));
  let workspacePath = getWorkspacePath();
  if (workspacePath === undefined) {
    return;
  }
  pushTagIfNo(obj, "workspace", workspacePath);
  await fs.outputFile(filePath, matter.stringify(obj.content, obj.data));
}

function hasTag(obj: matter.GrayMatterFile<matter.Input>, tag: string) {
  if (obj.data[tag] !== undefined) {
    return true;
  }
  return false;
}

function hasTagPair(
  obj: matter.GrayMatterFile<matter.Input>,
  tag: string,
  val: string
) {
  if (hasTag(obj, tag)) {
    if (obj.data[tag] instanceof Array) {
      if (obj.data[tag].includes(val)) {
        return true;
      }
    } else {
      if (val === obj.data[tag]) {
        return true;
      }
    }
  }
  return false;
}

export function hasWorkspaceTag(filePath: string) {
  let obj = matter(fs.readFileSync(filePath, "utf-8"));
  let workspacePath = getWorkspacePath();

  if (workspacePath === undefined) {
    return false;
  }
  if (hasTagPair(obj, "workspace", workspacePath)) {
    return true;
  }
  return false;
}

export function removePrefix(path: string, prefix: string) {
  return path.slice(prefix.length + 1, path.length);
}

export function ensureStringDefined(ans: string | undefined) {
  if (ans === undefined) {
    vscode.window.showErrorMessage("ans shouldn't be undefined");
    process.exit();
  }
  return ans;
}
