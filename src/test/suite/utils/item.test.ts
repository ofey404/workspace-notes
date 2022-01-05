// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { Filter, getMarkdown } from '../../../utils/item';

suite('utils/item Test Suite', () => {
	vscode.window.showInformationMessage('Start item tests.');

	test('class Item test', () => {
	});

	test('class Filter test', () => {
	});

	test('getItems() test', () => {
	});

	test('inNoteRepo() test', () => {
	});

	test('getMarkdown() test', () => {
        getMarkdown([new Filter((item) => !item.stats.isDirectory())]);
	});
});
