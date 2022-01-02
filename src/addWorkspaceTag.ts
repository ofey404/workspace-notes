import * as vscode from "vscode";
import { inNoteRepo } from "./utils/item";
import { ensureWorkspaceTagOnFile } from "./utils/tag";

export function addWorkspaceTag() {
  const currentlyOpenTabfilePath =
    vscode.window.activeTextEditor?.document.uri.path;

  if (currentlyOpenTabfilePath === undefined) {
    vscode.window.showInformationMessage("Add workspace tag: No active file");
    return;
  } else if (!inNoteRepo(currentlyOpenTabfilePath)) {
    vscode.window.showInformationMessage(
      "Add workspace tag: Current file is not in note repository"
    );
    return;
  }
  ensureWorkspaceTagOnFile(currentlyOpenTabfilePath);
}
