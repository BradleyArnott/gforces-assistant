var tickets = {},
	ticketsColours = {
		good: '#cfe9b6',
		late: '#e9b6b6',
		modified: 'f0b664'
	},
	ticketsToday = 0,
	hoursToday = 0,
	ticketsNext = 0,
	hoursNext = 0,
	currentDate = moment().format('MM DD YYYY'),
	nextDate = moment().add(3, 'days').format('MM DD YYYY');

tickets.init = function() {
	Settings.get('checkTickets').then(function(checkTickets) {
		if (!checkTickets) return;
		setTimeout(function() {
			tickets.loopTables();
		}, 1000);
	});
}

tickets.loopTables = function() {
	$('.page-type-dashboard .issue-table').each(function() {
		var $this = $(this);
		tickets.loopTickets($this);
	});
}

tickets.loopTickets = function(table) {
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
		tickets.late(timeData, $this);
		tickets.good(timeData, $this);
		tickets.modified(timeData, $this);
		ticketsToday += tickets.today(timeData, $this);
		ticketsNext += tickets.next(timeData, $this);
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
	var estimate = parseFloat($(this).find('.timeoriginalestimate').text()),
		worked = tickets.timeSpent($(this).find('.timespent').text());
		hours = estimate - worked;
	if (hours < 0) return;
	hoursToday += hours;
	return 1;
}

tickets.next = function(timeData, el) {
	if (nextDate != timeData.ticketDate) return;
	if (el.find('.status span').text() == 'In Progress') return 0;
	var estimate = parseFloat($(this).find('.timeoriginalestimate').text()),
		worked = tickets.timeSpent($(this).find('.timespent').text());
		hours = estimate - worked;
	if (hours < 0) return;
	hoursNext += hours;
	return 1;
}

tickets.timeSpent = function(time) {
    var timeSpentArr = time.split(' ');
    var newTimeSpent = 0;
    for ( var i = 0, l = timeSpentArr.length; i < l; i++ ) {
        var newTime = timeSpentArr[i];
        if(newTime) {
            if (newTime.indexOf('m') >= 0) newTime = parseFloat(newTime) / 60;
            newTimeSpent = parseFloat(newTime) + parseFloat(newTimeSpent);
        }
    }
    if (newTimeSpent < 0) newTimeSpent = 0;
    console.log(newTimeSpent);
    return newTimeSpent;
}

tickets.init();