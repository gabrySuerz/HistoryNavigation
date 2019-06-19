'use strict';

import { ExtensionContext, StatusBarAlignment, window, StatusBarItem, commands } from 'vscode';

// detect if the list is open or not
var opened = false

export function activate(context: ExtensionContext) {
	// creates the commands in the status bar
  // createStatusBarHistoryControls(context)
  
	// navigates to the last change in the page
	context.subscriptions.push(commands.registerCommand('historynavigation.goToPreviousChange', () => {
		commands.executeCommand("workbench.action.navigateBack");
	}));
	// navigates to the next change in the page
	context.subscriptions.push(commands.registerCommand('historynavigation.goToNextChange', () => {
		commands.executeCommand("workbench.action.navigateForward");
	}));
	// go the previous opened editor
	context.subscriptions.push(commands.registerCommand('historynavigation.goToPreviousEditor', () => {
		commands.executeCommand("workbench.action.previousEditor");
	}));
	// go the next opened editor
	context.subscriptions.push(commands.registerCommand('historynavigation.goToNextEditor', () => {
		commands.executeCommand("workbench.action.nextEditor");
	}));
	// open the list of last used pages
	context.subscriptions.push(commands.registerCommand('historynavigation.openEditorHistory', () => {
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
	statusPrevious.command = 'historynavigation.goToPreviousEditor';
	context.subscriptions.push(statusPrevious);

	const statusPreviousList = window.createStatusBarItem(StatusBarAlignment.Right, 200);
	statusPreviousList.command = 'historynavigation.openEditorHistory';
	context.subscriptions.push(statusPreviousList);

	const statusNext = window.createStatusBarItem(StatusBarAlignment.Right, 100);
	statusNext.command = 'historynavigation.goToNextEditor';
	context.subscriptions.push(statusNext);

	const statusPreviousChange = window.createStatusBarItem(StatusBarAlignment.Right, 400);
	statusPreviousChange.command = 'historynavigation.goToPreviousChange';
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