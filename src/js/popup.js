var frontendActions = {};

frontendActions.setSwitches = function() {

	$('.switch').each(function() {
		var option = $(this).attr('data-option');
		var $this = $(this);
		Settings.get(option).then(function(result) {
			if (!result) return;
			$this.attr('enabled', result);
			$this.addClass('checked');
		});
	});
}

frontendActions.clickSwitches = function() {

	$('.switch').click(function() {
		$(this).toggleClass('checked');
		var isActive = $(this).hasClass('checked');
		$(this).attr('enabled', isActive);
		var option = $(this).attr('data-option');

		chrome.runtime.sendMessage({
			action: 'saveSetting',
			label: option,
			value: isActive
		});
	});
}

frontendActions.checkPage = function() {
	var isOnND = '<link href="//images.netdirector.co.uk" rel="preconnect">';
	return new Promise(function(resolve) {
		chrome.runtime.sendMessage({action: 'getPageData'}, function(data) {
			var DOMHead = data[0].dom;
			if (DOMHead.indexOf(isOnND) == -1) return;
			resolve(data[0]);
		});
	});
}

frontendActions.checkLogIn = function(hostname) {

	return new Promise(function(resolve) {
		$.ajax({
			url: 'http://' + hostname + '/backend/',
			type: 'GET'
		}).done(function(response) {

			if(response) {
				var error =  $($.parseHTML(response)).find("#login-form");
				if(error.length) return;
				$('.backend').slideDown();
				$('.backendTitle').text(hostname);
			}
			resolve();

		}).fail(function(jqXHR, textStatus) {
			resolve();
		});
	});
}

frontendActions.getDeploy = function(hostname) {

	$.ajax({
        url: 'http://' + hostname + '/backend/assets/',
        type: 'GET'
    }).done(function(response) {

	    if(response) {
	    	var html = $($.parseHTML(response)),
		    	options = html.find('#Site_assets_path option');

		    $(options).each(function() {
		    	if (!$(this).attr('selected')) return;
		    	var timestamp = $(this).text();
	    		$('.timestamp').text(timestamp);
		    });

        }

	}).fail(function(jqXHR, textStatus) {
		console.log(jqXHR)
        return false;
	});
}

frontendActions.buttons = function(hostname) {

	$('.button').each(function() {
		var btn = $(this).find('.btn'),
			dataPath = btn.attr('data-path');
		if (!dataPath) return;
		btn.attr('href', 'http://' + hostname + dataPath);
	});
}

frontendActions.checkDevMode = function(hostname) {
}

frontendActions.setDevMode = function(hostname, devMode) {

	$.ajax({
        url: 'http://' + hostname + '/backend/assets/set-development-mode?mode=' + !devMode,
        type: 'GET'
    }).done(function(response) {
		chrome.runtime.sendMessage({
			action: 'reloadPage'
		});
	}).fail(function(jqXHR, textStatus) {
		console.log(jqXHR)
        return false;
	});
}

frontendActions.init = function() {
	frontendActions.setSwitches();
	frontendActions.clickSwitches();
	frontendActions.checkPage().then(function(data) {
		frontendActions.checkLogIn(data.url);
		frontendActions.getDeploy(data.url);
		frontendActions.buttons(data.url);
	});
}

frontendActions.init();

