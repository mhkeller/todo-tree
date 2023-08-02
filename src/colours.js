const vscode = require('vscode');
const utils = require('./utils.js');

function validateColours (workspace) {
	function check (setting) {
		const definedColour = workspace.getConfiguration('todo-tree.highlights').get(setting);
		if (definedColour !== undefined && !utils.isValidColour(definedColour)) {
			invalidColours.push(setting + ' (' + definedColour + ')');
		}
	}

	var invalidColours = [];
	let result = '';

	const attributeList = ['foreground', 'background', 'iconColour', 'rulerColour'];
	attributeList.forEach(function (attribute) { check('defaultHighlight.' + attribute); });

	const config = vscode.workspace.getConfiguration('todo-tree.highlights');
	Object.keys(config.customHighlight).forEach(function (tag) {
		attributeList.forEach(function (attribute) { check('customHighlight.' + tag + '.' + attribute); });
	});

	if (invalidColours.length > 0) {
		result = 'Invalid colour settings: ' + invalidColours.join(', ');
	}

	return result;
}

function validateIconColours (workspace) {
	let hasInvalidCodiconColour = false;
	let hasInvalidOcticonColour = false;

	function checkIconColour (setting) {
		const icon = workspace.getConfiguration('todo-tree.highlights').get(setting + '.icon');
		const iconColour = workspace.getConfiguration('todo-tree.highlights').get(setting + '.iconColour');
		if (icon !== undefined && iconColour !== undefined) {
			if (utils.isCodicon(icon)) {
				if (utils.isHexColour(iconColour) || utils.isRgbColour(iconColour) || utils.isNamedColour(iconColour)) {
					invalidIconColours.push(setting + '.iconColour (' + iconColour + ')');
					hasInvalidCodiconColour = true;
				}
			} else {
				if (utils.isThemeColour(iconColour)) {
					invalidIconColours.push(setting + '.iconColour (' + iconColour + ')');
					hasInvalidOcticonColour = true;
				}
			}
		}
	}

	var invalidIconColours = [];
	let result = '';

	checkIconColour('defaultHighlight');

	const config = vscode.workspace.getConfiguration('todo-tree.highlights');
	Object.keys(config.customHighlight).forEach(function (tag) {
		checkIconColour('customHighlight.' + tag);
	});

	if (invalidIconColours.length > 0) {
		result = 'Invalid icon colour settings: ' + invalidIconColours.join(', ') + '.';
		if (hasInvalidCodiconColour) {
			result += ' Codicons can only use theme colours.';
		}
		if (hasInvalidOcticonColour) {
			result += ' Theme colours can only be used with Codicons.';
		}
	}

	return result;
}

module.exports.validateColours = validateColours;
module.exports.validateIconColours = validateIconColours;
