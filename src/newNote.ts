import * as fs from "fs-extra";
import * as path from "path";
import * as vscode from "vscode";
import {
    errorIfUndefined,
    quickPickRelativePath,
    showFile
} from "./utils/interactions";
import { Filter, getItems, Item } from "./utils/item";
import { ensureWorkspaceTagOnFile } from "./utils/tag";

function validDirItems() {
    const filter = new Filter((item) => item.stats.isDirectory());
    return getItems([filter]);
}

async function pickAPath() {
    const dirs = await validDirItems();
    return await quickPickRelativePath(dirs, {
        title: "Directory of new note",
    });
}

async function askFileBaseName() {
    return await vscode.window
        .showInputBox({
            prompt: `Name of note`,
            value: "",
        })
        .then(errorIfUndefined);
}

async function constructFullPath(dir: Item) {
    return await askFileBaseName().then((baseName) => {
        return path.join(dir.path, baseName + ".md");
    });
}

function createFileWithTag(path: string) {
    return fs.ensureFile(path).then(() => {
        ensureWorkspaceTagOnFile(path);
        return path;
    });
}

export function newNote() {
    pickAPath().then(constructFullPath).then(createFileWithTag).then(showFile);
}
