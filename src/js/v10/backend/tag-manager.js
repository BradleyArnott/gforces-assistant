var tagManager = {},
	cssTagsJS = [
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
	},
	{
		id: 4,
		name: 'HR Spacing',
		code: ''
	},	
	{
		id: 5,
		name: 'New Car Detail (Desktop-first)',
		code: ''
	},	
	{
		id: 6,
		name: 'New Car Detail (User-first)',
		code: ''
	},	
	{
		id: 7,
		name: 'New Car Dropdown',
		code: ''
	},
	{
		id: 8,
		name: 'Add class to body',
		code: ''
	},
	{
		id: 9,
		name: 'Current Year',
	},
	{
		id: 10,
		name: 'Open in new tab',
		code: ''
	}
];

tagManager.init = function() {
	$('<a title="Add" id="add-css-tag" href="#" class="btn btn-success css-assistant--button">Use predefined code</a>').appendTo('body');
	$('#add-css-tag').click(function(e) {
		e.preventDefault();
		tagManager.populate().then(function() {
			tagManager.scriptClick();
		});
	})
}  

function isEmpty( el ){
	return !$.trim(el.html())
}

tagManager.populate = function() {
	return new Promise(function(resolve, reject){
		let scriptContainer = $('<div class="nd-widget-box custom-css-js--container"><div class="nd-widget-title"><h2>Predefined CSS Scripts</h2></div></div>');
		
		for (let t = 0; t < cssTagsJS.length; t++) {
			let scriptName = cssTagsJS[t].name,
				scriptID = cssTagsJS[t].id;
			$('<a href="#"" class="script" data-id="' + scriptID + '"><div class="inner">' + scriptName + '</div></a>').appendTo(scriptContainer);
		}
		$(scriptContainer).appendTo('body');
		resolve();		
	})
}

tagManager.scriptClick = function() {
	$('.custom-css-js--container .script').click(function(e) {
		e.preventDefault();
		console.log('CSS - ' + $(this).find('.inner').text())
	})
}

tagManager.init();