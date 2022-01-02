import * as vscode from "vscode";
import * as path from "path";
import * as klaw from "klaw";
import { Stream } from "stream";
import { showFile, noteRepoPath, ignorePattern } from "./util";
import internal = require("stream");
import { newNote } from "./newNote";

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
  options?: vscode.QuickPickOptions,
  onNotFound?: () => void
) {
  const relativePaths = files.map(toRelativePath);

  if (relativePaths.length === 0) {
    if (onNotFound) {
      onNotFound();
    }
    return;
  }

  if (relativePaths.length === 1) {
    let candidate = path.join(noteRepoPath(), relativePaths[0]);
    showFile(candidate);
    return;
  }

  vscode.window
    .showQuickPick(relativePaths, options)
    .then(showFileIfValid(), errorShowQuickPick());
}

function newTransform(test: (item: klaw.Item) => Boolean) {
  return new Stream.Transform({
    objectMode: true,
    transform: function (item, enc, next) {
      if (test(item)) {
        this.push(item);
      }
      next();
    },
  });
}

export function ignorePatternAndDir() {
  const test = (item: klaw.Item) => {
    const relativePath = toRelativePath(item);
    return !ignorePattern().test(relativePath) && !item.stats.isDirectory();
  };
  return newTransform(test);
}

const isMarkdownRegExp = new RegExp(".+.md$");

export function isMarkDown() {
  const test = (item: klaw.Item) => {
    const relativePath = toRelativePath(item);
    return isMarkdownRegExp.test(relativePath);
  };
  return newTransform(test);
}

export function transformInRepo(
  transforms: internal.Transform[],
  onEnd: Function
) {
  let files: klaw.Item[] = [];

  let target = klaw(noteRepoPath());

  for (var t of transforms) {
    target = target.pipe(t);
  }

  target
    .on("data", (item) => files.push(item))
    .on("error", errorScanningFile())
    .on("end", onEnd(files));
}

function onNotFound() {
        vscode.window.showInformationMessage("No workspace note, create one?");
        newNote();
}

export function transformAndPick(
  transforms: internal.Transform[],
  pickOptions?: vscode.QuickPickOptions
) {
  const onEnd = (files: klaw.Item[]) => {
    return () => {
      files.sort(byMtime);
      quickPickRelativePath(files, pickOptions, onNotFound);
    };
  };

  transformInRepo(transforms, onEnd);
}
