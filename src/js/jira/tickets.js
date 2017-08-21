var username = $('#header-details-user-fullname').attr("data-username"),
	tickets = {},
	ticketsColours = {
		good: '#cfe9b6',
		late: '#e9b6b6',
		modified: '#f0b664',
		mine: '#b6e9db'
	},
	ticketsOEM = [
		{
			label: 'css-im-group',
			refs: [
				'IMGROUP', // Master
				'SMLA' // Subaru Master
			]
		},
		{
			label: 'css-vauxhall',
			refs: [
				'VVB', // Master
				'BEVB', // Bellingers
				'BVB', // Beadles
				'GVB', // Go Vauxhall
				'BURNHAM', // Advance Vauxhall
				'THURLOW', // Thurlow Nunn
				'VAUXUFM' // Vauxhall Migrations
			]
		},
		{
			label: 'css-mazda',
			refs: [
				'MAZDAB', // Master
				'MUVLB' // UVL
			]
		},
		{
			label: 'css-gmme',
			refs: [
				'GMME', // Master
				'GCREB', // Chevrolet
				'GCNCC' // Cadillac
			]
		}
	],
	ticketsToday = 0,
	hoursToday = 0,
	ticketsNext = 0,
	hoursNext = 0,
	currentDate = moment().format('MM DD YYYY'),
	nextWord,
	nextDate;

var champions = [
	{
		name: 'matt.mumford',
		type: 'Mazda',
		table: '#gadget-71902-renderbox'
	},
	{
		name: 'beau.august',
		type: 'Vauxhall',
		table: '#gadget-72006-renderbox'
	},
	{
		name: 'chris.kent',
		type: 'IM Group',
		table: '#gadget-71901-renderbox'
	},
	{
		name: 'nuno.barros',
		type: 'GMME',
		table: '#gadget-72007-renderbox'
	}
]

tickets.init = function() {
	Settings.get('checkTickets').then(function(checkTickets) {
		if (!checkTickets) return;
		setTimeout(function() {
			tickets.loopTables();
			tickets.Champions();
			tickets.Approval();
			tickets.myIssues();
			tickets.checkWorkQueue();
		}, 1000);
	});
}

tickets.loopTables = function() {
	tickets.checkNext();
	$('.page-type-dashboard .issue-table').each(function() {
		var $this = $(this),
			ticketsArr = {};
		tickets.loopTickets($this);
	});
	tickets.showData();
}

tickets.loopTickets = function(table) {
	var ticketsObj = {};
	table.find(".issuerow").each(function() {
		var $this = $(this),
			ticketTimestamp = $this.find('.livestamp'),
			ticketUpdatedDateTime = $(this).find(".updated time").attr("datetime"),
			ticketDateTime = ticketTimestamp.attr('datetime'),
			timeData = {};

			timeData.timeUnix = moment().unix();
			timeData.ticketDate = moment(ticketDateTime).format('MM DD YYYY');
			timeData.ticketUnix = moment(ticketDateTime).unix();
			timeData.ticketUpdatedDate = moment(ticketUpdatedDateTime).format('MM DD YYYY');
			timeData.ticketUpdatedTime = moment(ticketUpdatedDateTime).format('HH:mm');

		if (!ticketTimestamp.length) return;
		tickets.group(timeData, $this, ticketsObj);
		tickets.good(timeData, $this);
		tickets.late(timeData, $this);
		tickets.modified(timeData, $this);
		ticketsToday += tickets.today(timeData, $this);
		ticketsNext += tickets.next(timeData, $this);
	});
	tickets.colorGroups(ticketsObj);
}

tickets.checkNext = function() {
	var nextDay = moment().add(1, 'days').weekday();
	var numDays = 1;
	if (nextDay == 6) numDays += 2;
	if (nextDay == 0) numDays += 1;
	nextDate = moment().add(numDays, 'days').format('MM DD YYYY');
	nextWord = numDays == 1 ? 'Tomorrow' : moment(nextDate).format('dddd');
}

tickets.group = function(timeData, el, obj) {
	var issueKey = el.attr('data-issuekey'),
		keyString = issueKey.split('-')[0];
		color = '#'+Math.floor(Math.random()*16777215).toString(16);

	if(obj[keyString]) obj[keyString].items.push(el);
	else obj[keyString] = { 'color': color, 'items': [el]}
}

tickets.colorGroups = function(obj) {

	Object.keys(obj).forEach(function(key) {

		var items = obj[key].items,
			color = obj[key].color;

		if(items.length > 1) {

			for (var n = 0; n < items.length; n++) {
				var el = items[n];
				el.find('.issuetype').css('background-color', color);
			}
		}
	});
}

tickets.late = function(timeData, el) {
	if (timeData.ticketUnix > timeData.timeUnix) return;
	el.css('background', ticketsColours.late);
}

tickets.good = function(timeData, el) {
	if (timeData.ticketUnix < timeData.timeUnix) return;
	if (currentDate != timeData.ticketDate) return;
	el.css('background', ticketsColours.good);
}

tickets.modified = function(timeData, el) {
	if (currentDate != timeData.ticketDate) return;
	if (timeData.ticketUpdatedDate != currentDate) return;
	if (timeData.ticketUpdatedTime < '09:30') return;
	el.css('background', ticketsColours.modified);
}

tickets.today = function(timeData, el) {
	if (currentDate != timeData.ticketDate) return 0;
	if (el.find('.status span').text() == 'In Progress') return 0;
	var estimate = tickets.timeSpent(el.find('.timeoriginalestimate').text());
	if (isNaN(estimate)) return 0;
	var worked = tickets.timeSpent(el.find('.timespent').text());
		hours = estimate - worked;
	if (hours < 0) return 1;
	hoursToday += hours;
	return 1;
}

tickets.next = function(timeData, el) {
	if (nextDate != timeData.ticketDate) return 0;
	if (el.find('.status span').text() == 'In Progress') return 0;
	var estimate = tickets.timeSpent(el.find('.timeoriginalestimate').text());
	el.css('background', '#e5e5e5');
	if (isNaN(estimate)) return 0;
	var worked = tickets.timeSpent(el.find('.timespent').text()),
		hours = estimate - worked;
	if (hours < 0) return 0;
	hoursNext += hours;
	return 1;
}

tickets.timeSpent = function(time) {
	var timeSpentArr = time.split(' '),
	newTimeSpent = 0;

	for ( var i = 0, l = timeSpentArr.length; i < l; i++ ) {
		var newTime = timeSpentArr[i];
		if(newTime) {
			if (newTime.indexOf('m') >= 0) newTime = parseFloat(newTime) / 60;
			newTimeSpent = parseFloat(newTime) + parseFloat(newTimeSpent);
		}
	}
	if (newTimeSpent < 0) newTimeSpent = 0;
	return newTimeSpent;
}

tickets.Champions = function() {
	for (champion in champions) {
		let user = champions[champion];
		if (user.name != username) continue;
		let champTickets = $(user.table).find('.issuerow').length,
			plural = champTickets == 1 ? 'is' : 'are',
			pluralTickets = champTickets == 1 ? 'ticket' : 'tickets',
			text = 'There ' + plural + ' <strong>' + champTickets + '</strong> ' + user.type + '-related ' + pluralTickets,
			el = $('<div class="ticket-count champion"><div class="inner">' + text + '</div></div>');
		el.appendTo('.ticket-count-container');
	}
}

tickets.Approval = function() {
	let table = $('#gadget-79400-renderbox');

	let approvalTickets = table.find('.issuerow').length,
		plural = approvalTickets == 1 ? 'is' : 'are',
		pluralTickets = approvalTickets == 1 ? 'ticket' : 'tickets',
		text = 'There ' + plural + ' <strong>' + approvalTickets + '</strong> third-party approval ' + pluralTickets,
		el = $('<div class="ticket-count approval"><div class="inner">' + text + '</div></div>');
	el.appendTo('.ticket-count-container');
}

tickets.showData = function() {
	var todayContentContainer = $('<div class="ticket-count-container"></div>');
	var todayContent = (ticketsToday == 0) ? '<div class="ticket-count today completed"><div class="inner">All tickets done for today</div></div>' : '<div class="ticket-count today"><div class="inner">Total Hours Today <strong>' + hoursToday.toFixed(1) + '</strong> Total Tickets Today <strong>' + ticketsToday + '</strong></div></div>';
    var nextContent = '<div class="ticket-count tomorrow"><div class="inner">Total hours ' + nextWord + ' <strong>' + hoursNext.toFixed(1) + '</strong> Total tickets ' + nextWord + ' <strong>' + ticketsNext + '</strong></div></div>';
    $(todayContent).appendTo(todayContentContainer);
    $(nextContent).appendTo(todayContentContainer);
    $('.page-type-dashboard #content').prepend(todayContentContainer);
}


tickets.myIssues = function() {
	$('#gadget-54826-chrome .issuerow').each(function() {
		var issueReporter = $(this).find('.reporter a').attr('rel');
		if (issueReporter != username) return;
		$(this).css('background', ticketsColours.mine);
	});
}

tickets.checkWorkQueue = function() {
	$.get('https://jira.netdirector.co.uk/rest/api/2/search?jql=status+in+(%22In+Progress%22,+Reopened,+Error,+Reported,+%22To+Do%22,+%22More+Information%22,+Queued)+AND+(labels+not+in+(CSSQueue,+ProjectCSS,+MobileFirstMigration,+css-core,+css-site-review,+css-code-review)+OR+labels+is+EMPTY)+AND+type+!%3D+%22Project+-+Design%22+AND+assignee+in+(EMPTY)+AND+NOT+reporter+in+(api.user)+AND+Department+%3D+CSS+AND+NOT+project+%3D+11300+AND+NOT+project+%3D+%22Third+Party+Code+Approval%22+AND+issuetype+!%3D+%22QA+Sub-Task%22+ORDER+BY+cf%5B11004%5D+ASC', function( data ) {
		let issues = data.issues;
		for (let i = 0; i < issues.length; i++) {
			tickets.checkQuote(issues[i]);
			tickets.checkDue(issues[i]);
			tickets.labelOEM(issues[i]);
		};
	});
}

tickets.clearNotDue = function(issue) {
	tickets.getTransitions(issue.key).then(function(data) {
		let message = `*Automated message:* This ticket has been set to 'More Info', because it is in the CSS MS ticket queue without a due date. 
						If the time is now after 09:30 AM, please set the due date to no earlier than the next working day. 
						If this ticket is yet to be quoted on, please move it to the quote queue.
						If this is QA, it may have accidentally been set to the Type 'Sub-task' instead of 'QA Sub-task.'`;
		tickets.addLabel(issue.key, 'css-automated-nodue');
		tickets.moreInfo(issue.key, message, data);
	});
}

tickets.checkQuote = function(issue) {
	let quote = issue.fields.timeoriginalestimate,
		message = `*Automated message:* This ticket has been set to 'More Info', because it is in the CSS MS ticket queue without a quote.
					If this is an MS ticket, please move it to the quote queue.
					If this is QA, it may have accidentally been set to the Type 'Sub-task' instead of 'QA Sub-task.'`;		
	if (quote !== null) return;
	tickets.getTransitions(issue.key).then(function(data) {
		tickets.addLabel(issue.key, 'css-automated-noquote');
		tickets.moreInfo(issue.key, message, data);
	});
}

tickets.checkDue = function(issue) {
	let due = issue.fields.customfield_11004,
		sameDate = moment(currentDate).isSame(moment(due).format('MM DD YYYY'));

	if (due === null) tickets.clearNotDue(issue);
	else if (!sameDate) return;
}

tickets.getTransitions = function(key, status) {
	return new Promise(function(resolve, reject) {
		$.get('https://jira.netdirector.co.uk/rest/api/2/issue/' + key + '/transitions?expand=transitions.fields', function( data ) {
			let transitions = data.transitions;
			for (let i = 0; i < transitions.length; i++) {
				let transitionName = transitions[i].name;
				if ('More Info'.indexOf(transitionName) == -1) continue;
				resolve(transitions[i].id);
			}
		});
	});
}

tickets.moreInfo = function(key, message, transitionID) {
	let transitionUrl = 'https://jira.netdirector.co.uk/rest/api/2/issue/' + key + '/transitions?expand=transitions.fields',
		transitionData = {
	    "update": {
	        "comment": [
	            {
	                "add": {
	                    "body": message
	                }
	            }
	        ]
	    },
	    "transition": {
	        "id": transitionID
	    }
	};
	transitionData = JSON.stringify(transitionData);

	console.log(key + ' set to "More Info"');

	$.ajax({
		type: 'POST',
		url: transitionUrl, 
		data: transitionData,
		contentType: 'application/json',
		dataType: 'json'
	});
}

tickets.addLabel = function(key, label) {
	let transitionUrl = 'https://jira.netdirector.co.uk/rest/api/2/issue/' + key,
		transitionData = {
		"update": {		
			"labels": [
				{
					"add": label
				}
			]
		}
	};

	transitionData = JSON.stringify(transitionData);

	$.ajax({
		type: 'PUT',
		url: transitionUrl, 
		data: transitionData,
		contentType: 'application/json',
		dataType: 'json'
	});

	console.log('label "' + label + '" added to ' + key);
}

tickets.labelOEM = function(issue) {
	let key = issue.key,
		labels = issue.fields.labels;

	for (let t = 0; t < ticketsOEM.length; t++) {
		let ticketsRef = ticketsOEM[t].refs;

		for (let r = 0; r < ticketsRef.length; r++) {
			if (!key.startsWith(ticketsRef[r])) continue;
			let OEMLabel = ticketsOEM[t].label,
				hasLabel = labels.indexOf(OEMLabel);

			if (hasLabel !== -1) return;
			tickets.addLabel(key, ticketsOEM[t].label);
		}
	}
}

tickets.init();