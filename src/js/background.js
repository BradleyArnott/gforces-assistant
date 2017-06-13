var background = {},
	keySize = 256,
	ivSize = 128,
	iterations = 100;

chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {

	switch(data.action) {

		case 'saveSetting':
			background.save(data);
			break;
		case 'getSetting':
			background.get(data).then(function(option){
				sendResponse(option);
			});
			break;
		case 'getPageData':
			background.scrape().then(function(data){
				sendResponse(data);
			});
			break;
		case 'openPage':
			background.openTab(data);
			break;
		case 'reloadPage':
			chrome.tabs.reload();
			break;
		case 'sendAuthData':
			background.setAuth(data);
			break;
		case 'getAuthData':
			background.getAuth().then(function(data){
				sendResponse(data);
			});
			break;
		case 'generateDropdown':
			chrome.tabs.executeScript({file:"js/v10/frontend/dropdown.js"})
			break;
	}

	return true;
});

background.save = function(data) {
	dataOptions = {};
	dataOptions[data.label] = data.value;
	chrome.storage.local.set(dataOptions);
}

background.get = function(data) {
	var setting = data.label;
	return new Promise(function (resolve, reject) {
		chrome.storage.local.get(setting, function(result) {
			resolve(result);
		});	
	});
}

background.openTab = function(data) {
	pageUrl = data.url;
	chrome.tabs.create({ url: pageUrl });
}

background.scrape = function() {

	function getDOM() {
		var pageUrl = window.location.hostname,
			pageDOM =  document.head.innerHTML,
			data = {};

		data.url = pageUrl;
		data.dom = pageDOM;

		return data;
	}

	return new Promise(function(resolve) {
		chrome.tabs.executeScript({
			code: '(' + getDOM + ')();'
		}, function(data) {
			resolve(data);
		});
	});
}

background.encrypt = function(msg, pass) {

	var salt = CryptoJS.lib.WordArray.random(128/8);
	var key = CryptoJS.PBKDF2(pass, salt, {
		keySize: keySize/32,
		iterations: iterations
	});
	var iv = CryptoJS.lib.WordArray.random(128/8);
	var encrypted = CryptoJS.AES.encrypt(msg, key, { 
		iv: iv, 
		padding: CryptoJS.pad.Pkcs7,
		mode: CryptoJS.mode.CBC
	});

	var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();

	return transitmessage;
}

background.decrypt = function(transitmessage, pass) {
	var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32)),
		iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32)),
		encrypted = transitmessage.substring(64),
		key = CryptoJS.PBKDF2(pass, salt, {
			keySize: keySize/32,
			iterations: iterations
		}),
		decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
			iv: iv, 
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC
		});

	return decrypted;
}

background.setAuth = function(data) {
	background.get('passphrase').then(function(result) {
		var passphrase = result.value,
			username = data.username,
			password = data.password;

		var encrypted = background.encrypt(password, passphrase);

		var userData = {
			label: 'userData',
			value: {
				username: username,
				password: encrypted
			}
		}
		background.save(userData);
	});
}

background.getAuth = function() {

	return new Promise(function(resolve) {

		background.get('passphrase').then(function(passphrase) {
			var passphrase = passphrase.value;
			background.get('userData').then(function(data) {
				if(data.userData.username == undefined) return;
				var username = data.userData.username,
					encrypted = data.userData.password,
					decrypted = background.decrypt(encrypted, passphrase),
					authData = {};

				authData.username = username;
				authData.password = decrypted.toString(CryptoJS.enc.Utf8);
				resolve(authData);
			});
		});
	});
}

background.init = function() {

	chrome.runtime.onInstalled.addListener(function(details){

	    if(details.reason == "install"){
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
				passphrase = "";

			for(var i = 0; i < 32; i++) {
				passphrase += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			chrome.storage.local.set({
				label: 'passphrase',
				value: passphrase
			});
		}
	});
}

background.init();