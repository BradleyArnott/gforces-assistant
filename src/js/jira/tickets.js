var tickets = {},
	ticketsColours = {
		good: '#cfe9b6',
		late: '#e9b6b6',
		modified: '#f0b664'
	},
	ticketsToday = 0,
	hoursToday = 0,
	ticketsNext = 0,
	hoursNext = 0,
	currentDate = moment().format('MM DD YYYY'),
	nextWord,
	nextDate;

tickets.init = function() {
	Settings.get('checkTickets').then(function(checkTickets) {
		if (!checkTickets) return;
		setTimeout(function() {
			tickets.loopTables();
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
	if (nextDay == 6 || nextDay == 7) numDays += (nextDay - 5) + 1;
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
	var estimate = parseFloat(el.find('.timeoriginalestimate').text());
	if (isNaN(estimate)) return 0;
	var worked = tickets.timeSpent(el.find('.timespent').text());
		hours = estimate - worked;
	if (hours < 0) return 0;
	hoursToday += hours;
	return 1;
}

tickets.next = function(timeData, el) {
	if (nextDate != timeData.ticketDate) return 0;
	if (el.find('.status span').text() == 'In Progress') return 0;
	var estimate = parseFloat(el.find('.timeoriginalestimate').text());
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

tickets.showData = function() {
	var todayContent = (ticketsToday == 0) ? '<div class="ticket-count today completed">All Tickets Done For Today</div>' : '<div class="ticket-count today">Total Hours Today <strong>' + hoursToday.toFixed(1) + '</strong> Total Tickets Today <strong>' + ticketsToday + '</strong></div>';
    $('.page-type-dashboard #content').prepend('<div class="ticket-count tomorrow">Total Hours ' + nextWord + ' <strong>' + hoursNext.toFixed(1) + '</strong> Total Tickets ' + nextWord + ' <strong>' + ticketsNext + '</strong></div>');
    $('.page-type-dashboard #content').prepend(todayContent);
}

tickets.init();