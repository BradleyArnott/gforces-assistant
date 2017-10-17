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
	CSSLabels = {
		'repeatissue': '#ffb355',
		'css-qa-config': '#7e82ff',
		'css-qa-content': '#7e82ff',
		'css-qa-setup': '#7e82ff',
		'css-qa-dev': '#ffa4a4',
		'css-core': '#d5d832',
		'css-scope-change': '#ff6c6c'
	},
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
		subtasks.createKey();
	});
}

subtasks.loopList = function() {
	$('#issuetable .issuerow').each(function() {
		var $this = $(this),
			taskStatus = $this.find(".status span").html();

		subtasks.identifyCSS($this, taskStatus);
		subtasks.hideTeam($this, 'PM');
		subtasks.checkComplete($this, taskStatus);
		subtasks.checkLabels($this);
	});
}

subtasks.checkLabels = function(el) {
	var labelEl = el.find('.labels-wrap > .labels');
	if (labelEl.is('span')) return;
	labelEl.find('a').each(function() {
		var label = $(this).attr('title');
		for (lbl in CSSLabels) {
			if (label.indexOf(lbl) !== -1) el.css('background', CSSLabels[lbl]);
		}
	});
}

subtasks.checkComplete = function(el, value) {
	arrayPos = $.inArray(value, subtasksDone);
	if (arrayPos === -1) return;
	el.hide().css('background', subtasksDoneColour);
}

subtasks.hideTeam = function(el, team) {
	var shouldHide = el.find(".stsummary a").is(':contains("' + team + ' ")');
	if (!shouldHide) return;
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

subtasks.createKey = function() {
	let list = '<div class="custom-css-key"><div class="key-title"> Label colour key:</div><ul>';

	for (const [key, value] of Object.entries(CSSLabels)) {
		list += `<li><div style="background:${value};"></div><span>${key}</span></li>`;
	};
	list += '</div>'
	$(list).appendTo('.issue-main-column #details-module_heading');
}

subtasks.init();
