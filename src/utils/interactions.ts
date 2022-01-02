import * as vscode from "vscode";
import { Item } from "./item";

const ansUndefined = "ans shouldn't be undefined";

export function errorIfUndefined(ans: string | undefined) {
  if (ans === undefined) {
    throw ansUndefined;
  }
  return ans;
}

export function showFile(path: string) {
  vscode.window.showTextDocument(vscode.Uri.file(path), {
    preserveFocus: false,
    preview: false,
  });
}

function findByRelativePath(items: Item[]) {
  return (relativePath: string) => {
    const ans = items.find((i) => i.relativePath() === relativePath);
    if (ans === undefined) {
      vscode.window.showErrorMessage(
        "relative path " + relativePath + " not found in items: " + items
      );
      process.exit();
    }
    return ans;
  };
}

const noItemError = "No item provided to quickpick";

export async function quickPickRelativePath(items: Item[]) {
  if (items.length === 0) {
    throw noItemError;
  }
  if (items.length === 1) {
    return items[0];
  }
  const relativePaths = items.map((item) => item.relativePath());
  return await vscode.window
    .showQuickPick(relativePaths)
    .then(errorIfUndefined)
    .then(findByRelativePath(items));
}