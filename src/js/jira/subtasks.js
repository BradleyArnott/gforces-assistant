var subtasks = {},
	subtasksToDo = {
		'Queued': '#C8E1FB',
		'Not Started': '#C8E1FB',
		'Quote requested': '#C8E1FB',
		'Quoted': '#C8E1FB',
		'In Progress': '#BAF3C3',
		'More information': '#FFFFD5'
	},
	subtasksDone = [
		'Closed',
		'Resolved',
		'Rejected'
	],
	subtasksDoneColour = '#b2d8b9';

$.extend($.expr[':'], {
	'contains': function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || '').toLowerCase()
		.indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});

subtasks.init = function() {
	Settings.get('checkSubTasks').then(function(checkSubTasks) {
		if (!checkSubTasks) return;
		subtasks.loopList();
		subtasks.addButton();
	});
}

subtasks.loopList = function() {
	$('#issuetable .issuerow').each(function() {
		var $this = $(this),
			taskStatus = $this.find(".status span").html();

		subtasks.identifyCSS($this, taskStatus);
		subtasks.hidePM($this);
		subtasks.checkComplete($this, taskStatus);
	});
}

subtasks.checkComplete = function(el, value) {
	arrayPos = $.inArray(value, subtasksDone);
	if (arrayPos === -1) return;
	el.hide().css('background', subtasksDoneColour);
}

subtasks.hidePM = function(el) {
	var isPM = el.find(".stsummary a").is(':contains("PM ")');
	if (!isPM) return;
	el.hide();	
}

subtasks.identifyCSS = function(el, value) {
	var isCSS = el.find(".stsummary a").is(':contains("CSS")');
	if (!isCSS) return;
	if (!subtasksToDo.hasOwnProperty(value)) return;
	if (value == 'More information') el.appendTo('#issuetable');
	el.css('background', subtasksToDo[value]);
}

subtasks.addButton = function() {
	$(".page-type-navigator #opsbar-opsbar-transitions").append("<li class=\"toolbar-item\"><a enabled=\"true\" class=\"toolbar-trigger show-all-tasks\"><span class=\"trigger-label\">Show all Sub-Tasks</span></a></li>");
	$(".show-all-tasks").click(function() {
		isEnabled = $(this).attr('enabled')
		if (isEnabled == 'true') {
			$(this).attr('enabled', 'false');
			$(this).find("span").text("Hide irrelevant sub-tasks");
			$('#issuetable .issuerow').css('display', 'table-row');
			return;
		}
		$('#issuetable .issuerow').removeAttr("style");
		subtasks.loopList();
		$(this).attr('enabled', 'true');
		$(this).find("span").text("Show all sub-tasks");
	});
}

subtasks.init();
