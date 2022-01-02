import * as path from "path";
import * as vscode from "vscode";
import { showFile } from "./interactUtils";
import { newNote } from "./newNote";
import {
  newTransform,
  toRelativePath,
  transformAsync,
} from "./transformAndPick";
import {
  errorIfUndefined,
  hasWorkspaceTag,
  ignorePattern,
  noteRepoPath,
} from "./util";

async function collectWorkspaceNote() {
  const filter = newTransform((item) => {
    return (
      !ignorePattern().test(item.path) &&
      !item.stats.isDirectory() &&
      hasWorkspaceTag(item.path)
    );
  });
  return transformAsync([filter]);
}

export function pickWorkspaceNote() {
  collectWorkspaceNote()
    .then((items) => {
      const relativeDirs = items.map(toRelativePath);
      if (relativeDirs.length === 0) {
        newNote();
        vscode.window.showInformationMessage("here");
        throw "error";
      }
      if (relativeDirs.length === 1) {
        return relativeDirs[0];
      }
      return vscode.window.showQuickPick(relativeDirs).then(errorIfUndefined);
    })
    .then(async (p) => {
      vscode.window.showInformationMessage(p);

      let fullPath = path.join(noteRepoPath(), p);
      await showFile(fullPath);
    });
}
