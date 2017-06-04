var background = {}; 

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

	}

	return true;
});

background.save = function(data) {
	dataOptions = {};
	dataOptions[data.label] = data.value;
	chrome.storage.local.set(dataOptions);
	console.log('Setting made, ' + data.label + ': ' + data.value);
}

background.get = function(data) {
	var setting = data.label;
	return new Promise(function (resolve, reject) {
		chrome.storage.local.get(setting, function(result) {
			console.log('Setting retrieved, ' + setting + ': ' + result[setting]);
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