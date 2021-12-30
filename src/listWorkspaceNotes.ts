import * as vscode from "vscode";
import * as path from "path";
import * as klaw from "klaw";
import * as matter from "gray-matter";
import { showFile } from "./util";

import { getWorkspacePath, noteRepoPath, ignorePattern } from "./util";

function removePrefix(path: string, prefix: string) {
  return path.slice(prefix.length + 1, path.length);
}

function collectTo(files: Array<klaw.Item>) {
  return (item: klaw.Item) => {
    const relativePath = removePrefix(item.path, noteRepoPath());
    if (!ignorePattern().test(relativePath) && !item.stats.isDirectory()) {
      files.push(item);
    }
  };
}

function errorScanningFile() {
  return (err: klaw.Event, item: klaw.Item) => {
    vscode.window.showErrorMessage(
      `Error ${err} occurred while scanning file: ${item} `
    );
  };
}

function errorShowQuickPick() {
  return (err: any) => {
    vscode.window.showErrorMessage(
      `Error ${err} occurred while showing quickpick.`
    );
  };
}

function byMtime(a: klaw.Item, b: klaw.Item) {
  const aTime = new Date(a.stats.mtime);
  const bTime = new Date(b.stats.mtime);
  if (aTime > bTime) {
    return -1;
  } else if (aTime < bTime) {
    return 1;
  } else {
    return 0;
  }
}

function toRelativePath(f: klaw.Item) {
  return removePrefix(f.path, noteRepoPath());
}

function showFileIfValid() {
  return (relativePath: string | undefined) => {
    if (relativePath !== null && relativePath) {
      let candidate = path.join(noteRepoPath(), relativePath);
      showFile(candidate);
    }
  };
}

function sortAndShowQuickPick(files: Array<klaw.Item>) {
  return () => {
    const relativePaths = files.sort(byMtime).map(toRelativePath);

    vscode.window
      .showQuickPick(relativePaths)
      .then(showFileIfValid(), errorShowQuickPick());
  };
}

export function listWorkspaceNotes() {
  let workspacePath = getWorkspacePath();
  let files: klaw.Item[] = [];

  klaw(noteRepoPath())
    .on("data", collectTo(files))
    .on("error", errorScanningFile())
    .on("end", sortAndShowQuickPick(files));
}
