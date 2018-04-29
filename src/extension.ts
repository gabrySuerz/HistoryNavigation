'use strict';

import { ExtensionContext, StatusBarAlignment, window, StatusBarItem, commands } from 'vscode';

// detect if the list is open or not
var opened = false

export function activate(context: ExtensionContext) {
	// creates the commands in the status bar
	// createStatusBarHistoryControls(context)
	// navigates to the last change in the page (not used)
	context.subscriptions.push(commands.registerCommand('extension.goToPreviousChange', () => {
		commands.executeCommand("workbench.action.editor.previousChange")
	}));
	// go the previous opened editor
	context.subscriptions.push(commands.registerCommand('extension.goToPreviousEditor', () => {
		commands.executeCommand("workbench.action.navigateBack")
	}));
	// go the next opened editor
	context.subscriptions.push(commands.registerCommand('extension.goToNextEditor', () => {
		commands.executeCommand("workbench.action.navigateForward")
	}));
	// open the list of last used pages
	context.subscriptions.push(commands.registerCommand('extension.openEditorHistory', () => {
		if (!opened) {
			commands.executeCommand("workbench.action.openPreviousEditorFromHistory")
			opened = true
		} else {
			opened = false
			commands.executeCommand("workbench.action.closeQuickOpen")
		}
	}));
}
// initialize the statusbar
var createStatusBarHistoryControls = (context: ExtensionContext): void => {
	const statusPrevious = window.createStatusBarItem(StatusBarAlignment.Right, 300);
	statusPrevious.command = 'extension.goToPreviousEditor';
	context.subscriptions.push(statusPrevious);

	const statusPreviousList = window.createStatusBarItem(StatusBarAlignment.Right, 200);
	statusPreviousList.command = 'extension.openEditorHistory';
	context.subscriptions.push(statusPreviousList);

	const statusNext = window.createStatusBarItem(StatusBarAlignment.Right, 100);
	statusNext.command = 'extension.goToNextEditor';
	context.subscriptions.push(statusNext);

	const statusPreviousChange = window.createStatusBarItem(StatusBarAlignment.Right, 400);
	statusPreviousChange.command = 'extension.goToPreviousChange';
	context.subscriptions.push(statusPreviousChange);

	updateStatus(statusPreviousChange, '$(arrow-left)');
	updateStatus(statusPrevious, '$(arrow-left)');
	updateStatus(statusPreviousList, '$(list-ordered)');
	updateStatus(statusNext, '$(arrow-right)');
}
// check if there is an icon and then if open or not
var updateStatus = (status: StatusBarItem, text: string): void => {
	if (text) {
		status.text = text;
	}

	if (text) {
		status.show();
	} else {
		status.hide();
	}
}
// check if there is history to show or not the commands
var checkHistory = (status: StatusBarItem, command: string): void => {
	let res = commands.executeCommand(command);
	if (res != null) {
		status.show();
	} else {
		status.hide();
	}
}