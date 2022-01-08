import * as assert from 'assert';
import { beforeEach } from 'mocha';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { ensureWorkspaceTagOnFile, hasWorkspaceTag } from '../../../utils/tag';
import { resetFixture, toRepoPath } from '../lib';

suite('utils/tag Test Suite', () => {
    vscode.window.showInformationMessage('Start config tests.');

    beforeEach(() => {
        resetFixture();
    });

    test('hasWorkspaceTag() and ensureWorkspaceTagOnFile() test', () => {
        let yes = toRepoPath([
            "./yes.md",
            "./notfile.md/yes.md",
            "./nested/category/yes.md",
        ]);
        let no = toRepoPath([
            "./no.md",
            "./notfile.md/no.md",
            "./nested/category/no.md",
        ]);

        yes.forEach(y => {
            assert.ok(hasWorkspaceTag(y));
        });
        no.forEach(n => {
            assert.ok(!hasWorkspaceTag(n), n);
        });

        no.forEach(n => {
            ensureWorkspaceTagOnFile(n);
            assert.ok(hasWorkspaceTag(n));
        });
    });
});

