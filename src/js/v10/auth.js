var login = 'beau.august@gforces.co.uk';
var pass = 'Brown-lamp12';
var backendPath = '/backend/auth/';
var currentDate = Math.round((new Date()).getTime() / 1000);
var isOnND = $('link[href="//images.netdirector.co.uk"]');
var loginAttempts = 0;

auth = {};

auth.login = function() {
	$.ajax({
		url: 'http://' + window.location.hostname + backendPath,
		data: {
			'Components_Auth_LoginForm[username]': login,
			'Components_Auth_LoginForm[password]': pass
		},
		type: 'POST'
	})
	.done( function(data){
		if (data.includes('Components_Auth_LoginForm[username]')) {
			loginAttempts++;
			if (loginAttempts == 3) return;
			setTimeout(function() { backendLogin() }, 2000);
		} else {
			localStorage.setItem('NDAutoLog', currentDate);
		}
	})
}

auth.checkExpiry = function() {
	var expiryTime = 24 * 3600;
	var expiryDate = localStorage.getItem('NDAutoLog') ? parseInt(localStorage.getItem('NDAutoLog')) + expiryTime : 0;

	return new Promise(function(resolve, error) {
		if (currentDate < expiryDate) return;
		else resolve();
	});
}

auth.init = function() {
	if (!isOnND.length) return;
	Settings.get('autoLogin').then(function(autoLogin) {
		if (!autoLogin) return;
		auth.checkExpiry().then(function() {
			auth.login();
		});
	});
}

auth.init();