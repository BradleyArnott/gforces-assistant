var dropdown = {},
	urlPrefix = 'image/upload/',
	urlSuffix = 'auto-client/';

dropdown.modal = function(options) {
	var modal = $('<div class="gforces-assistant--modal"><label for="dropdown">Dropdown select</label><select class="dropdown-list"></select><label for="variable">Variable name</label><input class="variable" placeholder="eg. @new-cars" type="text"></input><label for="images">Extract Listing Images from current page</label><input class="checkbox" type="checkbox" name="images"><div class="button"><a href="" class="btn confirm">Confirm</a></div><div class="button"><a href="" class="btn cancel">Cancel</a></div></div>'),
		overlay = $('<div class="gforces-assistant--overlay"></div>');
		overlayConfirm = $('<div class="gforces-assistant--overlay--confirm"><div class="box"></div></div>');

	overlay.appendTo('body');
	overlayConfirm.appendTo('body');
	modal.appendTo('body');
	$.each(options, function(index, value){
		var select = $('.gforces-assistant--modal select'),
			option = $('<option>' + value.title + '</option>');
		option.appendTo('.gforces-assistant--modal select');
	});
	overlay.fadeIn();
	modal.fadeIn();
}

dropdown.setOptions = function() {

	return new Promise(function(resolve, error) {
		var options = [];

		$('.header-container .nav li.dropdown').each(function(){
			var title = $(this).find('> a > span').text();
			var data = {
				el: $(this),
				title: title
			};

			options.push(data);
		});
		resolve(options);
	})
}

dropdown.confirm = function(options, downloadImages, dropdownValue, varName) {
	var dropdownEl;

	if (downloadImages) dropdown.grabImages();

	$.each(options, function(index, value){
		if (dropdownValue != value.title) return;
		dropdownEl = value.el;
	});

	dropdown.generateSprite(dropdownEl, varName).then(function(data){
		dropdown.copyVariable(data);
		$('.gforces-assistant--overlay--confirm').fadeIn(250).delay(550).fadeOut();
	});
}

dropdown.buttons = function(options) {

	$('.gforces-assistant--modal .btn').click(function(e){
		e.preventDefault();

		if ($(this).hasClass('confirm')) {
			var dropdownValue = $('.gforces-assistant--modal option:selected').val(),
				downloadImages = $('.gforces-assistant--modal .checkbox').is(':checked'),
				varName = $('.gforces-assistant--modal .variable').val() ? $('.gforces-assistant--modal .variable').val() : '@dropdown-items';
			dropdown.confirm(options, downloadImages, dropdownValue, varName);
		}

		$('.gforces-assistant--modal').remove();
		$('.gforces-assistant--overlay').remove();
	});
}

dropdown.grabImages = function() {
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

dropdown.generateSprite = function(el, varName) {

	return new Promise(function(resolve, error) {
		var menuItems = $(el).find('.dropdown-menu a'),
			variableString = varName + ': \n\t"",',
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
	$('.gforces-assistant--modal').remove();
	$('.gforces-assistant--overlay').remove();
	$('.gforces-assistant--overlay--confirm').remove();
	dropdown.setOptions().then(function(data){
		dropdown.modal(data);
		dropdown.buttons(data);
	});
}

dropdown.init();