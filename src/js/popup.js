var frontendActions = {};

frontendActions.setSwitches = function() {

	$('.switch').each(function() {
		var option = $(this).attr('data-option'),
			$this = $(this);

		if (option == undefined) return;

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

		if ($(this).attr('data-option') == undefined) return;

		$(this).attr('enabled', isActive);

		var isActive = $(this).hasClass('checked'),
			option = $(this).attr('data-option');

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

frontendActions.modal = function() {

	$('.options').click(function(e) {
		e.preventDefault();
		$('.modal').show();
	});

	$('.modal .btn').click(function(e) {
		e.preventDefault();
		var modal = $(this).parents('.modal');

		if ($(this).hasClass('cancel')) {
			modal.find('input').val('');
			modal.hide();
			return;
		}

		var username = $(this).parents('.modal').find('input.username').val(),
			password = $(this).parents('.modal').find('input.password').val();

		chrome.runtime.sendMessage({
			action: 'sendAuthData',
			username: username,
			password: password
		});	

		modal.hide();
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

frontendActions.dropdownButton = function() {
	$('.sprite .btn').click(function() {
		chrome.runtime.sendMessage({
			action: 'generateDropdown'
		});	
	});
}


frontendActions.checkDevMode = function(data) {
	var links = $(data.dom).filter('link');

	links.each(function(index) {
		if ($(links[index]).attr('href').indexOf('temp-') == -1) return;
		$('.devmode.switch').addClass('checked').attr('enabled', 'true');
		devModeOn = true;
	});
}

frontendActions.setDevMode = function(hostname) {

	$('.devmode.switch').click(function() {
		var devMode = $(this).attr('enabled') == 'true'; // Convert string to boolean
		$.ajax({
			url: 'http://' + hostname + '/backend/assets/set-development-mode?mode=' + !devMode,
			type: 'GET'
		}).done(function(response) {
			$(this).attr('enabled', !devMode);
			chrome.runtime.sendMessage({
				action: 'reloadPage'
			});
		}).fail(function(jqXHR, textStatus) {
			console.log(jqXHR)
			return false;
		});
	});
}

frontendActions.speedTest = function(hostname) {

	return new Promise(function(resolve) {

		$('.speed-test').click(function() {
			$.ajax({
				url: 'http://www.webpagetest.org/runtest.php',
				data: {
					url: hostname,
					k: 'A.f860abf3c5a1c9c511a1e0b39f7302b5',
					f: 'json',
					location: 'London_EC2:Chrome'
				},
				type: 'POST'
			}).done (function(data){
				chrome.runtime.sendMessage({
					action: 'openPage',
					url: data.data.userUrl
				});
			})
		});
	});
}

frontendActions.init = function() {
	frontendActions.setSwitches();
	frontendActions.modal();
	frontendActions.clickSwitches();
	frontendActions.checkPage().then(function(data) {
		frontendActions.checkLogIn(data.url).then(function() {
			frontendActions.getDeploy(data.url);
			frontendActions.setDevMode(data.url);
			frontendActions.checkDevMode(data);
			frontendActions.buttons(data.url);
			frontendActions.dropdownButton();
			frontendActions.speedTest(data.url);
		});
	});
}

frontendActions.init();