// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { repoPath } from '../../../utils/config';
import { getMarkdown } from '../../../utils/item';
import { generateFixtureSettings } from '../../runTest';

suite('utils/item Test Suite', () => {
	vscode.window.showInformationMessage('Start item tests.');

	generateFixtureSettings();

	test('class Item test', () => {
	});

	test('class Filter test', () => {
	});

	test('getItems() test', () => {
	});

	test('inNoteRepo() test', () => {
	});

	test('getMarkdown() test', async () => {
		// Generated by:
		// find note/dir/ -name "*.md" -type f
		let expected = [
			"./yes.md",
			"./no.md",
			"./notfile.md/no.md",
			"./notfile.md/yes.md",
			"./nested/category/no.md",
			"./nested/category/yes.md",
		].map(realtivePath => path.join(repoPath(), realtivePath)).sort();

		let itemsPath = (await getMarkdown()).map(item => item.path).sort();
		if (expected.length !== itemsPath.length) {
			assert.fail();
		}
		for (let i=0; i<expected.length; i++) {
			assert.strictEqual(itemsPath[i], expected[i]);
		}
	});
});