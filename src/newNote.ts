import * as fs from "fs-extra";
import * as path from "path";
import * as vscode from "vscode";
import { showFile } from "./interactUtils";
import {
  newTransform,
  toRelativePath,
  transformAsync
} from "./transformAndPick";
import {
  addWorkspaceTagIfNo,
  errorIfUndefined,
  ignorePattern,
  noteRepoPath,
} from "./util";

function validDirItems() {
  const filter = newTransform((item) => {
    return !ignorePattern().test(item.path) && item.stats.isDirectory();
  });
  return transformAsync([filter]);
}

async function pickRelativeDirectory() {
  const dirs = await validDirItems();
  const relativeDirs = dirs.map(toRelativePath);
  return await vscode.window.showQuickPick(relativeDirs).then(errorIfUndefined);
}

async function askFileBaseName() {
  return await vscode.window
    .showInputBox({
      prompt: `Name of note`,
      value: "",
    })
    .then(errorIfUndefined);
}

async function constructFullPath(dirName: string) {
  return await askFileBaseName().then((baseName) => {
    return path.join(dirName, baseName + ".md");
  });
}

async function createFileWithTag(relativePath: string) {
  let fullPath = path.join(noteRepoPath(), relativePath);
  return await fs.ensureFile(fullPath).then(async () => {
    await addWorkspaceTagIfNo(fullPath);
    return fullPath;
  });
}

export function newNote() {
  pickRelativeDirectory()
    // TODO: path object {full/relative}
    .then(constructFullPath)
    .then(createFileWithTag)
    .then(showFile);
}
