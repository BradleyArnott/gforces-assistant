var tickets = {},
	ticketsColours = {
		good: '#cfe9b6',
		late: '#e9b6b6',
		modified: 'f0b664'
	},
	ticketsUrl = 'https://jira.netdirector.co.uk/secure/Dashboard.jspa';

tickets.init = function() {
	var currentPage = window.location.href;
	if (!currentPage.startsWith(ticketsUrl)) return;
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
			ticketDateTime = ticketTimestamp.attr('datetime'),
			timeData = {};

			timeData.currentDate = moment().format('MM DD YYYY');
			timeData.timeUnix = moment().unix();
			timeData.ticketDate = moment(ticketDateTime).format('MM DD YYYY');
			timeData.ticketUnix = moment(ticketDateTime).unix();

		if (!ticketTimestamp.length) return;
		tickets.late(timeData, $this);
		tickets.good(timeData, $this);
		tickets.modified(timeData, $this);
	});
}

tickets.late = function(timeData, el) {
	if (timeData.ticketUnix > timeData.timeUnix) return;
	el.css('background', ticketsColours.late);
}

tickets.good = function(timeData, el) {
	if (timeData.ticketUnix < timeData.timeUnix) return;
	if (timeData.currentDate != timeData.ticketDate) return;
	el.css('background', ticketsColours.good);
}

tickets.modified = function(timeUnix, ticketUnix, el) {
	if (timeData.currentDate != timeData.ticketDate) return;
}

tickets.init();