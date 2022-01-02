// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { newNote } from "./newNote";
import { listAllNotes } from "./listAllNotes";
import { pickWorkspaceNote } from "./pickWorkspaceNote";

function registerCommand(
  context: vscode.ExtensionContext,
  command: string,
  callback: (...args: any[]) => any
) {
  let disposable = vscode.commands.registerCommand(command, callback);
  context.subscriptions.push(disposable);
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  registerCommand(context, "workspace-notes.newNote", newNote);
  registerCommand(context, "workspace-notes.listAllNotes", listAllNotes);
  registerCommand(
    context,
    "workspace-notes.pickWorkspaceNote",
    pickWorkspaceNote
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
