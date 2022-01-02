# Workspace Notes

Access markdown notes quickly from workspace, while managing notes in a single repository.

No black magic, with minimum assumption. Only rely on tag `workspace: /path/to/it`.

**30s video demo:**

![demo](https://raw.githubusercontent.com/ofey404/workspace-notes/master/images/demo.gif)

## Usage

First, set `workspaceNotes.noteRepoPath` to your note directory. In my case it's `~/Documents/WorkspaceNotes`.

`Workspace Notes: Create a New Note` command can create a new note associated to current workspace.

- Workspace information is stored in the header of markdown file, like the example below.

```markdown
---
workspace: /home/ofey/Code/LearningVSCodeExtension/workspace-notes
---

**Example Note Content**
```

`Workspace Notes: Pick a workspace note to open` command can quick pick a workspace note from the repository.

- If only one candidate, open it directly.
- If there don't have any note related to current workspace, create one.

`Workspace Notes: List all notes` command can list all notes in repository and pick one. Ordered by modify time.

`Workspace Notes: Add workspace tag to current note` command is to add workspace tag to current note.

## Extension Settings

* `workspaceNotes.noteRepoPath`: path to note repository.
* `workspaceNotes.ignorePatternsPOSIX` and `workspaceNotes.ignorePatternsPOSIX`:
  * ignore patterns, match **absolute paths**.


## Known Issues

`workspaceNotes.ignorePatternsWindows` is untested.

## Release Notes

### 0.0.*

- Setup everything.
- Add `workspace-notes.newNote`.
- Add `workspace-notes.listAllNotes`.
- Add `workspace-notes.pickWorkspaceNote`.
- Add `workspace-notes.addWorkspaceTag`.

## Thanks

Inspired by [VSNotes](https://github.com/patleeman/VSNotes).