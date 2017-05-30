$('.switch').click(function() {
	$(this).toggleClass('checked');
});
		// // Read it using the storage API
		// chrome.storage.sync.set(['foo', 'bar'], function(items) {
		// 	console.log('Settings retrieved', items);
		// });