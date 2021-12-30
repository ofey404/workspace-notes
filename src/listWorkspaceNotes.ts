import * as vscode from "vscode";
import * as path from "path";
import * as klaw from "klaw";
import { getWorkspacePath, noteFolder, ignorePattern } from "./util";

export function listWorkspaceNotes() {
  let workspacePath = getWorkspacePath();
  // TODO: First implement list all notes.

  const noteFolderLen = noteFolder().length;
  let files: klaw.Item[] = [];

  // Using klaw, recursively iterate through notes directory.
  klaw(noteFolder())
    .on("data", (item) => {
      const relativePath = item.path.slice(
        noteFolder().length + 1,
        item.path.length
      );
      if (!ignorePattern().test(relativePath) && !item.stats.isDirectory()) {
        files.push(item);
      }
    })
    .on("error", (err: klaw.Event, item: klaw.Item) => {
      vscode.window.showErrorMessage(
        "Error occurred while scanning file: " + item
      );
      console.error("Error while walking notes folder: ", item, err);
    })
    .on("end", () => {
      // Sort files and generate path array
      files = files.sort(function (a, b) {
        const aTime = new Date(a.stats.mtime);
        const bTime = new Date(b.stats.mtime);
        if (aTime > bTime) {
          return -1;
        } else if (aTime < bTime) {
          return 1;
        } else {
          return 0;
        }
      });
      const shortPaths = [];
      for (let j = 0; j < files.length; j++) {
        shortPaths.push(
          files[j].path.slice(noteFolderLen + 1, files[j].path.length)
        );
      }

      vscode.window.showQuickPick(shortPaths).then(
        (res) => {
          if (res !== null && res) {
            vscode.window
              .showTextDocument(vscode.Uri.file(path.join(noteFolder(), res)))
              .then(
                (file) => {
                  console.log("Opening file ", res);
                },
                (err) => {
                  console.error(err);
                }
              );
          }
        },
        (err) => {
          console.error(err);
        }
      );
    });
}
