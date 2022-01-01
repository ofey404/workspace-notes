install:
	yes | vsce package
	code --install-extension workspace-notes-*.vsix 
