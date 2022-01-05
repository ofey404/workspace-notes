import { runTests } from '@vscode/test-electron';
import * as fs from "fs-extra";
import * as path from 'path';

const settingGenerationFailed = "setting generation failed.";

function generateSettings(testWorkspace: string, testNoteDirectory: string) {
	let content = `{
  "workspaceNotes.noteRepoPath": "${testNoteDirectory}",
}
`;
	let settingFile = path.join(testWorkspace, ".vscode", "settings.json");
	fs.ensureFile(settingFile).then(() => {
		fs.writeFile(settingFile, content).catch(() => {
			throw settingGenerationFailed;
		});
	});
}


async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// The path to test workspace
		const testWorkspace = path.resolve(__dirname, '../../test-fixtures/workspace');
		const testNoteDirectory = path.resolve(__dirname, '../../test-fixtures/notes');

		generateSettings(testWorkspace, testNoteDirectory);

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath, extensionTestsPath, launchArgs: [testWorkspace] });
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
