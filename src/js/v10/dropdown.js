var dropdown = {},
	urlPrefix = 'image/upload/',
	urlSuffix = 'auto-client/',
	dropdownClassName = 'new-cars';

dropdown.grabImage = function() {
	var images = $('.list-item img');

	images.each(function() {
		var src = $(this).attr('src');
		if (src.search(urlPrefix) == -1) return; 
		if (src.search(urlSuffix) == -1) return;

		var urlPrefixSplit = src.split(urlPrefix)[0],
			urlSuffixSplit = src.split(urlSuffix)[1],
			src = urlPrefixSplit + urlSuffix + urlSuffixSplit,
			fileType = src.substr(src.length - 4);
			alt = $(this).attr('alt').replace(' ', ''),
			download_link = $('<a></a>').attr('href', src).attr('download', alt + fileType).appendTo('body');

		download_link[0].click();
		download_link[0].remove();
	});
}

dropdown.copyVariable = function(string) {
	var textArea = $("<textarea>" + string + "</textarea>");
	$("body").append(textArea);
	textArea.select();
	document.execCommand("copy");
	textArea.remove();
}

dropdown.generateSprite = function() {

	return new Promise(function(resolve, error) {
		var menuItems = $('.header-container .' + dropdownClassName + '.dropdown .dropdown-menu a'),
			variableString = '@new-cars: \n\t"",',
			menuLength = menuItems.length;

		menuItems.each(function(index) {
			variableString += '\n\t"' + $(this).attr('href').match("[^/]*(?=\/$)") + '"';

			if (index != menuLength - 1) {
				variableString += ','
			}
		});

		variableString += '\n;';
		resolve(variableString);
	});
}

dropdown.init = function() {
	dropdown.grabImage();
	dropdown.generateSprite().then(function(data){
		dropdown.copyVariable(data);
	});
}

// dropdown.init();