import * as assert from 'assert';
import * as os from "os";
import * as path from 'path';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { ignorePattern, repoPath } from '../../../utils/config';
import { generateFixtureSettings } from '../../runTest';

suite('utils/config Test Suite', () => {
	vscode.window.showInformationMessage('Start config tests.');

	generateFixtureSettings();

	test('repoPath() test', () => {
		let p = repoPath();
		let testRepoPath = path.join(path.dirname(p), "notes");
		assert.strictEqual(p, testRepoPath);
	});

	test('ignorePattern() test', () => {
		let pattern = ignorePattern();
		let expected: RegExp;
		if (os.platform() === "win32") {
			expected = /(.*\\\..*|^\..*)/;
		} else {
			expected = /(.*\/\..*|^\..*)/;
		}

		assert.strictEqual(typeof(pattern), typeof(expected));
		assert.strictEqual(pattern.toString(), expected.toString());
	});
});
