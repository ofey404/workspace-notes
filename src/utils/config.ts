import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

function config() {
    return vscode.workspace.getConfiguration("workspaceNotes");
}

const repoPathEmptyError =
  "workspaceNotes.noteRepoPath is empty, workspace-note may not work properly.";

export function repoPath() {
    const rp: string | undefined = config().get("noteRepoPath");
    if (rp === undefined || rp === "") {
        vscode.window.showErrorMessage(
            "workspaceNotes.noteRepoPath is empty, workspace-note may not work properly."
        );
        throw repoPathEmptyError;
    }
    return resolveHome(rp);
}

export function ignorePattern() {
    let patterns;
    if (os.platform() === "win32") {
        patterns = config().get<Array<string>>(
            "ignorePatternsWindows"
        ) as Array<string>;
    } else {
    // FIXME: other platforms?
        patterns = config().get<Array<string>>(
            "ignorePatternsPOSIX"
        ) as Array<string>;
    }
    let p: string = patterns
        .map((pattern) => {
            return "(" + pattern + ")";
        })
        .join("|");
    return new RegExp(p);
}

function resolveHome(filepath: string) {
    if (filepath[0] === "~") {
        return path.join(os.homedir(), filepath.slice(1));
    }
    return filepath;
}
