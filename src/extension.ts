'use strict';

import { ExtensionContext, StatusBarAlignment, window, StatusBarItem, commands, workspace } from 'vscode';

// detect if the list is open or not
var opened = false;
var configuration = workspace.getConfiguration('historynavigation');

export function activate(context: ExtensionContext) {
	// navigates to the last change in the page
	context.subscriptions.push(commands.registerCommand('historynavigation.goToPreviousChange', () => {
		commands.executeCommand('workbench.action.navigateBack');
	}));
	// navigates to the next change in the page
	context.subscriptions.push(commands.registerCommand('historynavigation.goToNextChange', () => {
		commands.executeCommand('workbench.action.navigateForward');
	}));
	// go the previous opened editor
	context.subscriptions.push(commands.registerCommand('historynavigation.goToPreviousEditor', () => {
		commands.executeCommand('workbench.action.previousEditor');
	}));
	// go the next opened editor
	context.subscriptions.push(commands.registerCommand('historynavigation.goToNextEditor', () => {
		commands.executeCommand('workbench.action.nextEditor');
	}));
	// open the list of last used pages
	context.subscriptions.push(commands.registerCommand('historynavigation.openEditorHistory', () => {
		if (!opened) {
			commands.executeCommand('workbench.action.openPreviousEditorFromHistory');
			opened = true;
		} else {
			opened = false;
			commands.executeCommand('workbench.action.closeQuickOpen');
		}
	}));

	// creates the commands in the status bar
	const statusList = createStatusBarHistoryControls(context);
	const dictionary = {
		'historynavigation.goToPreviousChange': '$(arrow-left)',
		'historynavigation.goToPreviousEditor': '$(arrow-left)',
		'historynavigation.openEditorHistory': '$(list-ordered)',
		'historynavigation.goToNextEditor': '$(arrow-right)',
		'historynavigation.goToNextChange': '$(arrow-right)',
	};

	openWidgetBySettings(statusList, dictionary);

	workspace.onDidChangeConfiguration(e => {
		configuration = workspace.getConfiguration('historynavigation');
		openWidgetBySettings(statusList, dictionary);
	});
}
// initialize the statusbar
var createStatusBarHistoryControls = (context: ExtensionContext): StatusBarItem[] => {
	const statusPreviousChange = window.createStatusBarItem(StatusBarAlignment.Right, -1000000000000000005);
	statusPreviousChange.command = 'historynavigation.goToPreviousChange';
	statusPreviousChange.tooltip = 'Last Edit Location';
	context.subscriptions.push(statusPreviousChange);

	const statusPrevious = window.createStatusBarItem(StatusBarAlignment.Right, -1000000000000000004);
	statusPrevious.command = 'historynavigation.goToPreviousEditor';
	statusPrevious.tooltip = 'Previous Editors';
	context.subscriptions.push(statusPrevious);

	const statusPreviousList = window.createStatusBarItem(StatusBarAlignment.Right, -1000000000000000003);
	statusPreviousList.command = 'historynavigation.openEditorHistory';
	statusPreviousList.tooltip = 'History of Previous Editors';
	context.subscriptions.push(statusPreviousList);

	const statusNext = window.createStatusBarItem(StatusBarAlignment.Right, -1000000000000000002);
	statusNext.command = 'historynavigation.goToNextEditor';
	statusNext.tooltip = 'Next Editor';
	context.subscriptions.push(statusNext);

	const statusNextChange = window.createStatusBarItem(StatusBarAlignment.Right, -1000000000000000001);
	statusNextChange.command = 'historynavigation.goToNextChange';
	statusNextChange.tooltip = 'Next Edit Location';
	context.subscriptions.push(statusNextChange);

	return [statusPreviousChange, statusPrevious, statusPreviousList, statusNext, statusNextChange].reverse();
};

var openWidgetBySettings = (statusList: StatusBarItem[], dictionary: { [key: string]: string }): void => {
	// reset
	commands.executeCommand('setContext', 'extensionEnabled.navigation', false);
	commands.executeCommand('setContext', 'extensionEnabled.contextMenu', false);
	for (let status of statusList) {
		updateStatus(status, '');
	}
	// configure
	if (configuration.viewMode === 'Navigation bar') {
		commands.executeCommand('setContext', 'extensionEnabled.navigation', true);
	} else if (configuration.viewMode === 'Context menu') {
		commands.executeCommand('setContext', 'extensionEnabled.contextMenu', true);
	} else if (configuration.viewMode === 'Status bar') {
		for (let status of statusList) {
			updateStatus(status, dictionary[status.command]);
		}
	}
};

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
};