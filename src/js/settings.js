var Settings = {};

Settings.get = function(option) {
	return new Promise(function (resolve, reject) {
		chrome.runtime.sendMessage({
			action: 'getSetting', 
			label: option
			}, function(result) {
				console.log('Setting retrieved, ' + option + ': ' + result[option]);
				resolve(result[option]);
		});
	});
}