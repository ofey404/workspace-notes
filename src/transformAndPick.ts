import * as vscode from "vscode";
import { Stream } from "stream";
import * as path from "path";
import * as klaw from "klaw";
import { showFile, noteRepoPath, ignorePattern } from "./util";
import internal = require("stream");

function removePrefix(path: string, prefix: string) {
  return path.slice(prefix.length + 1, path.length);
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

function quickPickRelativePath(
  files: Array<klaw.Item>,
  options?: vscode.QuickPickOptions
) {
  const relativePaths = files.map(toRelativePath);

  if (relativePaths.length === 1) {
    let candidate = path.join(noteRepoPath(), relativePaths[0]);
    showFile(candidate);
    return;
  }

  vscode.window
    .showQuickPick(relativePaths, options)
    .then(showFileIfValid(), errorShowQuickPick());
}

export function ignorePatternAndDir() {
  return new Stream.Transform({
    objectMode: true,
    transform: function (item, enc, next) {
      const relativePath = toRelativePath(item);
      if (!ignorePattern().test(relativePath) && !item.stats.isDirectory()) {
        this.push(item);
      }
      next();
    },
  });
}

const isMarkdownRegExp = new RegExp(".+.md$");
export function isMarkDown() {
  return new Stream.Transform({
    objectMode: true,
    transform: function (item, enc, next) {
      const relativePath = toRelativePath(item);
      if (isMarkdownRegExp.test(relativePath)) {
        this.push(item);
      }
      next();
    },
  });
}

export function transFormAndPick(
  transforms: internal.Transform[],
  pickOptions?: vscode.QuickPickOptions
) {
  let files: klaw.Item[] = [];

  let target = klaw(noteRepoPath());

  for (var t of transforms) {
    target = target.pipe(t);
  }

  target
    .on("data", (item) => files.push(item))
    .on("error", errorScanningFile())
    .on("end", () => {
      files.sort(byMtime);
      quickPickRelativePath(files, pickOptions);
    });
}
