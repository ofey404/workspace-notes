import * as klaw from "klaw";
import * as path from "path";
import * as vscode from "vscode";
import { showFile } from "./utils/interactions";
import { newNote } from "./newNote";
import {
  newTransform,
  toRelativePath,
  transformAsync
} from "./transformAndPick";
import { ensureStringDefined, hasWorkspaceTag, ignorePattern, noteRepoPath } from "./util";

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

async function pickNoteQuick1(items: klaw.Item[]) {
      const relativeDirs = items.map(toRelativePath);
      if (relativeDirs.length === 0) {
        newNote();
        vscode.window.showInformationMessage("here");
        throw "error";
      }
      if (relativeDirs.length === 1) {
        return relativeDirs[0];
      }
      return vscode.window.showQuickPick(relativeDirs).then(ensureStringDefined);
}

export function pickWorkspaceNote() {
  collectWorkspaceNote()
    .then(pickNoteQuick1)
    .then(async (p) => {
      vscode.window.showInformationMessage(p);

      let fullPath = path.join(noteRepoPath(), p);
      await showFile(fullPath);
    });
}
