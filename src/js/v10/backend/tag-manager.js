var tagManager = {},
	cssTagsJS = [
	{
		id: 0,
		name: 'JS Absolute',
		ref: '00.%20Misc/js/js-absolute.js'
	},	
	{
		id: 1,
		name: 'JS Absolute (Advanced)',
		ref: '00.%20Misc/js/js-absolute-advanced.js'
	},
	{
		id: 2,
		name: 'Judge Service',
		ref: '00.%20Misc/js/judge-service-superwidget.js'
	},
	{
		id: 3,
		name: 'Miappi',
		ref: '00.%20Misc/js/miappi.js'
	},
	{
		id: 4,
		name: 'HR Spacing',
		ref: '00.%20Misc/js/hr-spacing.js'
	},	
	{
		id: 5,
		name: 'New Car Detail (Desktop-first)',
		ref: '00.%20Misc/js/new-car-detail.js'
	},	
	{
		id: 6,
		name: 'New Car Detail (User-first)',
		ref: '00.%20Misc/js/new-car-detail-MF.js'
	},	
	{
		id: 7,
		name: 'New Car Dropdown',
		ref: '00.%20Misc/js/_ND/menuImages.js'
	},
	{
		id: 8,
		name: 'Current Year',
		ref: '00.%20Misc/js/footer-year.js',
	},
	{
		id: 9,
		name: 'Open in new tab',
		ref: '00.%20Misc/js/open-in-new-tab-button.js'
	}
];

tagManager.init = function() {
	$('<a title="Add" id="add-css-tag" href="#" class="btn btn-success css-assistant--button">Use predefined code</a>').appendTo('body');
	$('#add-css-tag').click(function(e) {
		e.preventDefault();
		$('.custom-css-js--container').remove();
		if ($('.nd-form-standard').length == 0) return;
		tagManager.populate().then(function() {
			tagManager.scriptClick();
			tagManager.scriptClose();
		});
	})
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


tagManager.get = function(ID) {
	let scriptPath = 'https://gforcesdevtest.slsapp.com/source/netdirector-auto-resources/trunk/',
		file = cssTagsJS[ID].ref,
		fullURL = scriptPath + file,
		scriptTitle = 'CSS - ' + cssTagsJS[ID].name;

	$.get(fullURL).then(function(data) {
		$('.nd-form-standard input').val(scriptTitle);
		$('.nd-form-standard textarea').val(data);
	});
}

tagManager.init();