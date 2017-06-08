var backendPath = '/backend/auth/';
var currentDate = Math.round((new Date()).getTime() / 1000);
var loginAttempts = 0;

auth = {};

auth.login = function(data) {
	$.ajax({
		url: 'http://' + window.location.hostname + backendPath,
		data: {
			'Components_Auth_LoginForm[username]': data.username,
			'Components_Auth_LoginForm[password]': data.password
		},
		type: 'POST'
	})
	.done( function(data){
		if (data.includes('Components_Auth_LoginForm[username]')) {
			loginAttempts++;
			if (loginAttempts == 3) return;
			setTimeout(function() { backendLogin() }, 2000);
		} else {
			sessionStorage.setItem('NDAutoLog', currentDate);
		}
	})
}

auth.checkExpiry = function() {
	var expiryTime = 24 * 3600;
	var expiryDate = sessionStorage.getItem('NDAutoLog') ? parseInt(sessionStorage.getItem('NDAutoLog')) + expiryTime : 0;

	return new Promise(function(resolve, error) {
		if (currentDate < expiryDate) return;
		else resolve();
	});
}

auth.init = function() {
	var isOnND = $('link[href="//images.netdirector.co.uk"]');
	if (!isOnND.length) return;
	Settings.get('autoLogin').then(function(autoLogin) {
		if (!autoLogin) return;
		chrome.runtime.sendMessage({
			action: 'getAuthData'
			}, function(result) {
				auth.checkExpiry().then(function() {
					auth.login(result);
				});
		});
	});
}

auth.init();