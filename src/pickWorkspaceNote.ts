import * as vscode from "vscode";
import { newNote } from "./newNote";
import { quickPickRelativePath, showFile } from "./utils/interactions";
import { Filter, getMarkdown, Item } from "./utils/item";
import { hasWorkspaceTag } from "./utils/tag";

function collectWorkspaceNote() {
    const filter = new Filter((item) => {
        return hasWorkspaceTag(item.path);
    });
    return getMarkdown([filter]);
}

const createNote = "created a new note";

async function pickOrCreateOne(items: Item[]) {
    if (items.length === 0) {
        vscode.window.showInformationMessage("No workspace note, create one?");
        await newNote();
        throw createNote;
    }
    return await quickPickRelativePath(items);
}

export async function pickWorkspaceNote() {
    collectWorkspaceNote().then(pickOrCreateOne).then(showFile);
}
