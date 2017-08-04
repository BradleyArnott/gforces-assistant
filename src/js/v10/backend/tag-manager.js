$('<a title="Add" id="add-css-tag" href="#" class="btn btn-success css-assistant--button">Use predefined code</a>').insertAfter('#tag-edit');
var tagManager = {};

const cssTagsJS = [
	{
		id: 0,
		name: 'JS-Absolute',
		code: ''
	},	
	{
		id: 1,
		name: 'JS-Absolute (Advanced)',
		code: ''
	},
	{
		id: 2,
		name: 'Judge Service',
		code: ''
	},
	{
		id: 3,
		name: 'Miappi',
		code: ''
	}
];

tagManager.init = function() {
	$('#add-css-tag').click(function(e) {
		e.preventDefault();
		tagManager.populate().then(function() {
			tagManager.scriptClick();
		});
	})
}

tagManager.populate = function() {
	return new Promise(function(resolve, reject){
		let scriptContainer = $('<div class="nd-widget-box custom-css-js--container"><div class="nd-widget-title"><h2>Predefined CSS Scripts</h2></div></div>');
		
		for (let t = 0; t < cssTagsJS.length; t++) {
			let scriptName = cssTagsJS[t].name,
				scriptID = cssTagsJS[t].id;
			console.log(t)
			$('<a href="#"" class="script" data-id="' + scriptID + '"><div class="inner">' + scriptName + '</div></a>').appendTo(scriptContainer);
		}
		$(scriptContainer).appendTo('body');
		resolve();		
	})
}

tagManager.scriptClick = function() {
	$('.custom-css-js--container .script').click(function(e) {
		e.preventDefault();
		console.log($(this).attr('data-id'));
	})
}

tagManager.init();