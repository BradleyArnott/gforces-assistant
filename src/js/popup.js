$('.switch').each(function() {
	var option = $(this).attr('data-option');
	var $this = $(this);
	Settings.get(option).then(function(result) {
		if (!result) return;
		$this.attr('enabled', result);
		$this.addClass('checked');
	});
});

$('.switch').click(function() {
	$(this).toggleClass('checked');
	var isActive = $(this).hasClass('checked');
	$(this).attr('enabled', isActive)
	var option = $(this).attr('data-option');

	chrome.runtime.sendMessage({
		action: 'saveSetting',
		label: option,
		value: isActive
	});
});


chrome.runtime.onInstalled.addListener(function (details) {
	if (details.reason == "install") {
		$('.switch').each(function() {
			var option = $(this).attr('data-option');
			var option = option['false'];
			console.log("hjkhjk" + option);
			// Settings.save({optio});
		});
	}
});