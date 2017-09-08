var popup = {},
	devMode = false,
	templateEditor = false;

popup.setSwitches = function() {

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

popup.clickSwitches = function() {

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

popup.checkPage = function() {
	var isOnND = '<link href="https://images.netdirector.co.uk" rel="preconnect">';
	return new Promise(function(resolve) {
		chrome.runtime.sendMessage({action: 'getPageData'}, function(data) {
			var DOMHead = data[0].head;
			console.log(data[0])
			if (DOMHead.indexOf(isOnND) == -1) return;
			resolve(data[0]);
		});
	});
}

popup.checkLogIn = function(hostname) {

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
			console.log("login failed")
			resolve();
		});
	});
}

popup.checkSplit = function(data) {
	var isSplitTest = (data.body).includes('vwo_loaded');
	if (!isSplitTest) return;
	$('.backend .splitTests').addClass('active');
}

popup.trailingSlashes = function() {
	$('.trailing-slashes').click(function(e) {
		e.preventDefault();
		chrome.runtime.sendMessage({
			action: 'checkSlashes'
		});
	});
}

popup.checkOverflow = function() {
	$('.overflow-elements').click(function(e) {
		e.preventDefault();
		chrome.runtime.sendMessage({
			action: 'checkOverflow'
		});
	});
}

popup.getDeploy = function(hostname) {

	$.ajax({
		url: 'http://' + hostname + '/backend/assets/',
		type: 'GET'
	}).done(function(response) {

		if(response) {
			var html = $($.parseHTML(response)),
				options = html.find('#Site_assets_path option');
				hash = html.find('.nd-widget-box .alert-info').text().split('/').slice(-1)[0];

			$('.backendHash').text(hash);

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

popup.modal = function() {

	$('.options').click(function(e) {
		e.preventDefault();
		$('.modal').show();
	});

	$('.modal input').keydown(function (event) {
		var keypress = event.keyCode || event.which;
		if (keypress != 13) return;
		popup.sendAuth();
	});

	$('.modal .btn').click(function(e) {
		e.preventDefault();
		var modal = $('.modal');

		if ($(this).hasClass('cancel')) {
			modal.find('input').val('');
			modal.hide();
			return;
		}
		popup.sendAuth();
	});	
}

popup.sendAuth = function() {
	var modal = $('.modal'),
		username = modal.find('input.username').val(),
		password = modal.find('input.password').val();

	chrome.runtime.sendMessage({
		action: 'sendAuthData',
		username: username,
		password: password
	});	
	modal.hide();
}

popup.buttons = function(hostname) {

	$('.button').each(function() {
		var btn = $(this).find('.btn'),
			dataPath = btn.attr('data-path');
		if (!dataPath) return;
		btn.attr('href', 'http://' + hostname + dataPath);
	});
}

popup.dropdownButton = function() {
	$('.sprite .btn').click(function() {
		chrome.runtime.sendMessage({
			action: 'generateDropdown'
		});	
	});
}

popup.checkDevMode = function(data) {
	let links = $(data.head).filter('link');

	links.each(function(index) {
		if ($(links[index]).attr('href').indexOf('temp-') == -1) return;
		$('.devmode.switch').addClass('checked').attr('enabled', 'true');
		devModeOn = true;
	});
}

popup.setDevMode = function(hostname) {

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

popup.speedTest = function(hostname) {

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

popup.init = function() {
	popup.setSwitches();
	popup.modal();
	popup.clickSwitches();
	popup.checkPage().then(function(data) {
		popup.checkLogIn(data.url).then(function() {
			popup.checkSplit(data);
			popup.getDeploy(data.url);
			popup.setDevMode(data.url);
			popup.checkDevMode(data);
			popup.buttons(data.url);
			popup.dropdownButton();
			popup.trailingSlashes();
			popup.checkOverflow();
			popup.speedTest(data.url);
		});
	});
}

popup.init();