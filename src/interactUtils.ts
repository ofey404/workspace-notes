import * as vscode from "vscode";

export function showFile(path: string) {
  vscode.window.showTextDocument(vscode.Uri.file(path), {
    preserveFocus: false,
    preview: false,
  });
}
