var dropdownClassName = 'new-cars';

ImgGrabber();
jellyVariableCreator();

function ImgGrabber() {
	var imgs = $('.list-item .inset .responsive-image img');

	//loops through images
	imgs.map(function() {
		//get src of image
		var src = $(this).attr('src');

		//sort out img src url
		if (src.search('image/upload/') != -1 && src.search('auto-client/') != -1) {

			var url1 = src.split('image/upload/')[0]; 
			var url2 = src.split('auto-client/')[1]; 
			src = url1 + 'auto-client/' + url2;
		}

		//add html download to DOM
		var file_type = src.substr(src.length - 4);
		var alt = $(this).attr('alt').replace(' ', '');
		var download_link = $('<a></a>').attr('href', src).attr('download', alt + file_type).appendTo('body');

		//download and clean up
		download_link[0].click();
		download_link[0].remove();

	});
};

//function to copy a value 
function copyToClipboard(value) {
	var $temp = $("<textarea>" + value + "</textarea>");
	$("body").append($temp);
	$temp.select();
	document.execCommand("copy");
	$temp.remove();
}

//getting less var and copying
function jellyVariableCreator() {
	var menuItems = $('.header-container .nav .' + dropdownClassName + '.dropdown .dropdown-menu a');
	var lessNewCars = '@new-cars: \n\t"",';
	var menuLength = menuItems.length;

	menuItems.map(function(index) {

		//sorting out less variable for copying
		lessNewCars += '\n\t"' + $(this).attr('href').match("[^/]*(?=\/$)") + '"';

		if (index != menuLength - 1) {
			lessNewCars += ','
		}

		index++;
	});
		//finishing less variable
		lessNewCars += '\n;';

	//copy less variable to clipboard
	copyToClipboard(lessNewCars);
}