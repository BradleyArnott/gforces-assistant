var Settings = {}; 

chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {

	switch(data.action) {

		case 'saveSetting':
			Settings.save(data);
			break;
		case 'getSetting':
			Settings.get(data).then(function(option){
				sendResponse(option);
			});
			break;
	}

	return true;
});

Settings.save = function(data) {
	dataOptions = {};
	dataOptions[data.label] = data.value;
	chrome.storage.local.set(dataOptions);
	console.log('Setting made, ' + data.label + ': ' + data.value);
}

Settings.get = function(data) {
	var setting = data.label;
	return new Promise(function (resolve, reject) {
		chrome.storage.local.get(setting, function(result) {
			console.log('Setting retrieved, ' + setting + ': ' + result[setting]);
			resolve(result);
		});	
	});
}
