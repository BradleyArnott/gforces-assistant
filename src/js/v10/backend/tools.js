var editorTools = {};

editorTools.init = function() {
	let isInEditor = $('[href*="/templateEditor.css"]');
	if (!isInEditor.length) return;
	Settings.get('editorTools').then(function(isOn) {
		if (!isOn) return;
		setTimeout(function() {
			editorTools.injectContent('js', 'js/v10/backend/order-modules.js');
			editorTools.injectContent('css', 'css/v10/modal-styles.css');
		}, 700);
	});
};

editorTools.injectContent = function(type, filePath) {
	let codePath = chrome.extension.getURL(filePath),
		codeLink = type == 'css' ? $('<link>').attr('href', codePath).attr("rel","stylesheet").attr("type","text/css") : $('<script>').attr('src', codePath);

	$('head').append(codeLink);
};

editorTools.init();
