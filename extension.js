const vscode = require('vscode');
const fs = require("fs");
const path = require('path');

function getUserNotesFilePath() {
	const t = vscode.workspace.workspaceFolders;
	const p = path.join(t[0].uri.fsPath, "/.vscode/magicNotes.json");
	return (p)
}
function getLocalData() {
	const t = vscode.workspace.workspaceFolders;
	try {
		const p = path.join(t[0].uri.fsPath, "/.vscode/magicNotes.json");
		const f = fs.readFileSync(p, 'utf-8')
		const data = JSON.parse(f)
		return (data);
	}
	catch (err) {
		return (false);
	}

}
function checkIfDataExists() {
	const t = vscode.workspace.workspaceFolders;
	try {
		const p = path.join(t[0].uri.fsPath, "/.vscode/magicNotes.json");
		const f = fs.readFileSync(p, 'utf-8')
		return (true)
	}
	catch (err) {
		return (false);
	}
}
function setupCode() {
	console.log("Running Setup Workspace")
	const t = vscode.workspace.workspaceFolders;
	const dir = path.join(t[0].uri.fsPath, "/.vscode/");
	console.log(`Creating magicNotes.json in ${dir}`)
	fs.stat(dir, (err, stats) => {
		if (err) {
			console.log(`Error Creating File In Invalid Directory: ${err}`);
			try {
				console.log(`Attempting to create directory`);
				fs.mkdirSync(dir)
				try {
					fs.writeFileSync(dir + "/magicNotes.json", JSON.stringify([{ name: "Hello World" }]))
				}
				catch (err) {
					vscode.window.showErrorMessage(err)
					return (false)
				}
				return (true)
			} catch (err) {
				vscode.window.showErrorMessage(err)
				return (false)
			}
		}
		if (stats.isDirectory()) {
			console.log(`${dir} is a valid directory`)
			try {
				console.log(`Creating file`)
				fs.writeFileSync(dir + "/magicNotes.json", JSON.stringify([{ name: "Hello World" }]))
			} catch (err) {
				console.log(`Error Creating File: ${err}`)
			}
		}
	})
}
function createNewNote(data) {
	console.log("Creating New Note")
	const local = getLocalData();
	local.push(data);
	console.log(local);
	fs.writeFileSync(getUserNotesFilePath(), local);
}
function loadHTML() {
	const p = path.join(__dirname, "/app/index.html");
	try {
		const data = fs.readFileSync(p, "utf-8")
		return (data)
	} catch (err) {
		return (err)
	}
}
function openWebView(data) {
	const panel = vscode.window.createWebviewPanel("Magic Notes", "magic-notes", vscode.ViewColumn.Beside, {
		enableScripts: true,
	})
	panel.webview.html = loadHTML();
	panel.webview.onDidReceiveMessage((message) => {
		const { type, data } = message
		switch (type) {
			case type == "create-new-note":
				createNewNote(data);
				break;
			default: console.log("Nothing")
		}
		console.log("Recieved: ", message)
	})
	panel.webview.postMessage(data);
}
function activate(context) {
	let disposable = vscode.commands.registerCommand('magic-notes.open', function () {
		if (checkIfDataExists()) {
			console.log("Check Works")
			const data = getLocalData()
			openWebView(data)
		} else {
			console.log("Check Failed")
			setupCode()
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
