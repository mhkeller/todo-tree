let config;

function init (configuration) {
	config = configuration;
}

function getAttribute (tag, attribute, defaultValue, ignoreDefaultHighlight) {
	function getCustomHighlightSettings (customHighlight, tag) {
		let result;
		Object.keys(customHighlight).map(function (t) {
			let flags = '';
			if (config.isRegexCaseSensitive() === false) {
				flags += 'i';
			}
			t = t.replace(/\\/g, '\\\\');
			t = t.replace(/[|{}()[\]^$+*?.-]/g, '\\$&');

			const regex = new RegExp(t, flags);

			if (tag.match(regex)) {
				result = customHighlight[tag];
			}
		});
		return result;
	}

	const tagSettings = getCustomHighlightSettings(config.customHighlight(), tag);
	if (tagSettings && tagSettings[attribute] !== undefined) {
		return tagSettings[attribute];
	} else if (ignoreDefaultHighlight !== true) {
		const defaultHighlight = config.defaultHighlight();
		if (defaultHighlight[attribute] !== undefined) {
			return defaultHighlight[attribute];
		}
	}
	return defaultValue;
}

function getIcon (tag) {
	return getAttribute(tag, 'icon', undefined);
}

function getIconColour (tag) {
	const useColourScheme = config.shouldUseColourScheme();

	let colour = getAttribute(tag, 'iconColor', undefined);
	if (colour === undefined) {
		colour = getAttribute(tag, 'iconColour', undefined, useColourScheme);
	}
	if (colour === undefined && useColourScheme) {
		colour = getSchemeColour(tag, config.backgroundColourScheme());
	}

	if (colour === undefined) {
		const foreground = getAttribute(tag, 'foreground', undefined, useColourScheme);
		const background = getAttribute(tag, 'background', undefined, useColourScheme);

		colour = foreground || (background || 'green');
	}

	return colour;
}

function getSchemeColour (tag, colours) {
	const index = config.tags().indexOf(tag);
	if (colours && colours.length > 0) {
		return colours[index % colours.length];
	}
}

function getForeground (tag) {
	const useColourScheme = config.shouldUseColourScheme();
	let colour = getAttribute(tag, 'foreground', undefined, useColourScheme);
	if (colour === undefined && useColourScheme) {
		colour = getSchemeColour(tag, config.foregroundColourScheme());
	}
	return colour;
}

function getBackground (tag) {
	const useColourScheme = config.shouldUseColourScheme();
	let colour = getAttribute(tag, 'background', undefined, useColourScheme);
	if (colour === undefined && useColourScheme) {
		colour = getSchemeColour(tag, config.backgroundColourScheme());
	}
	return colour;
}

module.exports.init = init;
module.exports.getAttribute = getAttribute;
module.exports.getIcon = getIcon;
module.exports.getIconColour = getIconColour;
module.exports.getForeground = getForeground;
module.exports.getBackground = getBackground;
