var tagManager = {},
	CMeditor,
	cssTagsJS = [
	{
		id: 0,
		name: 'JS Absolute',
		ref: 'js-absolute.js'
	},	
	{
		id: 1,
		name: 'JS Absolute (Advanced)',
		ref: 'js-absolute-advanced.js'
	},
	{
		id: 2,
		name: 'Judge Service',
		ref: 'judge-service-superwidget.js'
	},
	{
		id: 3,
		name: 'Miappi',
		ref: 'miappi.js'
	},
	{
		id: 4,
		name: 'HR Spacing',
		ref: 'hr-spacing.js'
	},	
	{
		id: 5,
		name: 'New Car Detail (Desktop-first)',
		ref: 'new-car-detail.js'
	},	
	{
		id: 6,
		name: 'New Car Detail (User-first)',
		ref: 'new-car-detail-MF.js'
	},	
	{
		id: 7,
		name: 'New Car Dropdown',
		ref: 'menuImages.js'
	},
	{
		id: 8,
		name: 'Current Year',
		ref: 'footer-year.js',
	},
	{
		id: 9,
		name: 'Open in new tab',
		ref: 'open-in-new-tab-button.js'
	},
	{
		id: 10,
		name: 'Scrolling footer toggle',
		ref: 'footer-toggle-scroll.js'
	}
];

tagManager.init = function() {
	tagManager.check();
	tagManager.removeButton();
}  

function isEmpty( el ){
	return !$.trim(el.html())
}


tagManager.populate = function() {
	return new Promise(function(resolve, reject){
		let scriptContainer = $('<div class="nd-widget-box custom-css-js--container"><a href="#" class="custom-css-js--close"></a><div class="nd-widget-title"><h2>Predefined CSS Scripts</h2></div></div>');
		
		for (let t = 0; t < cssTagsJS.length; t++) {
			let scriptName = cssTagsJS[t].name,
				scriptID = cssTagsJS[t].id;
			$('<a href="#"" class="script" data-id="' + scriptID + '"><div class="inner">' + scriptName + '</div></a>').appendTo(scriptContainer);
		}
		$(scriptContainer).appendTo('body');
		resolve();		
	})
}

tagManager.searchFunction = function() {
	$('#template-search').keyup(function() {

		let input = $(this),
			parent = $(this).parents('.table-menu');
			filter = input[0].value.toUpperCase(),
			ul = parent.find('ul'),
			li = ul.find('li');

		// Loop through all list items, and hide those who don't match the search query
		for (i = 0; i < li.length; i++) {
			let el = $(li[i]);

			let label = el.find('label');
			if (label[0].innerHTML.toUpperCase().indexOf(filter) > -1) {
				el.show();
			} else {
				el.hide();
			}
		}
	});
}

tagManager.addSearch = function() {
	return new Promise(function(resolve, reject) {
		let input = '<div class="padding-bottom padding-left"><input type="text" id="template-search" placeholder="Search for templates"></div>';
		$(input).insertAfter('.nd-table-checkbox-dropdown .table-menu > div:first-child');
		resolve();
	});
}

tagManager.addButton = function() {
	$('<a title="Add" id="add-css-tag" href="#" class="btn btn-success css-assistant--button">Use predefined code</a>').appendTo('body');
	$('#add-css-tag').click(function(e) {
		e.preventDefault();
		$('.custom-css-js--container').remove();
		tagManager.populate().then(function() {
			tagManager.scriptClick();
			tagManager.scriptClose();
		});
	})
}

tagManager.removeButton = function() {
	$(document).on('click', '#cancel-tag-edit', function() {
		$('#add-css-tag').remove();
		$('#template-search').remove();
	})
}

tagManager.addEditor = function() {
	CMeditor = CodeMirror.fromTextArea(document.getElementById('Snippet_content'), {
		mode: 'javascript',
		lineNumbers: true,
		tabSize: 4,
		indentUnit: 4,
		indentWithTabs: true,
		theme: 'monokai',
		keyMap: 'sublime',
		lineWrapping: true,
		gutters: ["CodeMirror-lint-markers"],
		lint: true,
		lintOnChange: true
	});
	CMeditor.on('change', checkTextArea);

	function checkTextArea() {
		CMeditor.save();
	}

	$('.nd-form-standard > .row-fluid > .span8').removeClass('span8');
}

tagManager.check = function() {
	$(document).on('click', '.edit-tag, #add-tag', function() {
		tagManager.checkSnippet().then(function() {
			tagManager.addEditor();
			tagManager.addSearch();
			tagManager.searchFunction();
			tagManager.addButton();
		})
	});
	$(document).on('click', '#save-tag', function() {
		$('#add-css-tag').remove();
	});
}


tagManager.scriptClick = function() {
	$('.custom-css-js--container .script').click(function(e) {
		e.preventDefault();
		let dataID = $(this).attr('data-id');
		tagManager.get(dataID);
		$('.custom-css-js--container').remove();
	})
}

tagManager.scriptClose = function() {
	$('.custom-css-js--close').click(function(e) {
		e.preventDefault();
		$('.custom-css-js--container').remove();
	})
}

tagManager.checkSnippet = function() {

	return new Promise(function(resolve, reject) {

		let checkTextArea = setInterval(function() {
			let isText = $('#Snippet_content').length;

			if (isText) {
				clearInterval(checkTextArea);
				resolve();
			}

			$('#add-css-tag').remove();

		}, 100);
	});
}

tagManager.get = function(ID) {
	let scriptPath = 'https://gforcesdevtest.slsapp.com/source/netdirector-auto-resources/trunk/00.%20Misc/js/',
		file = cssTagsJS[ID].ref,
		fullURL = scriptPath + file,
		scriptTitle = 'CSS - ' + cssTagsJS[ID].name;

	$.ajax({
		url: fullURL,
		type: "GET",
	}).then(function(data) {
		$('#Snippet_title').val(scriptTitle);
		$('#Snippet_content').val(data);
		if ($('.CodeMirror').length) {
			CMeditor.setValue($('#Snippet_content').val());
		}
	});
}

tagManager.init();