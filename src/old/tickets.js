'use strict';

var jqUI_CssSrc = GM_getResourceText ("jqUI_CSS");

GM_addStyle (jqUI_CssSrc);

$(function(){

	TaskButton();
    ToDoCheck();
    TicketCount();
    AddUserName();

});

/* TICKET COUNT STUFF
================================================= */

function TicketCount() {

	var today = new Date();
    var currentDateTimeUnix = moment(today).unix();
    var currentDate = moment(today).format('MM DD YYYY');
    var totalTomorrow = 0;
    var totalHours = 0;
    var ticketsToday = 0;
    var ticketsTomorrow = 0;
    var nextDay = moment(moment(currentDate).add(1, 'days')).format('MM DD YYYY');
    var nextWording = 'Tomorrow';

    if($('#gadget-61805-renderbox').length === 0){

	    if(moment(moment(currentDate).add(1, 'days')).format('d') == 6) {
	        nextDay = moment(moment(currentDate).add(3, 'days')).format('MM DD YYYY');
	        nextWording = 'Monday';
	    }

	    if(moment(moment(currentDate).add(1, 'days')).format('d') === 0) {
	        nextDay = moment(moment(currentDate).add(2, 'days')).format('MM DD YYYY');
	        nextWording = 'Monday';
	    }

	    setTimeout(function() {

	    	$('.page-type-dashboard .issue-table').each(function() {

	   			var ticketsArr = {};
	   			var $gadget = $(this);

	        	$(this).find(".issuerow").each(function() {

		        	var issueKey = $(this).attr('data-issuekey');
		        	var $livetimestamp = $(this).find('.livestamp');
		            var ticketDateTime = $livetimestamp.attr("datetime");
		            var ticketDateTimeUnix = moment(ticketDateTime).unix();
		            var ticketDate = moment(ticketDateTime).format('MM DD YYYY');
		            var updatedDateTime = $(this).find(".updated time").attr("datetime");
		            var updatedDateTimeUnix = moment($(this).find(".updated time").attr("datetime")).unix();
		            var updatedDate = moment(updatedDateTime).format('MM DD YYYY');
		            var updatedTime = moment(updatedDateTime).format('HH:mm');

		            if($livetimestamp.length) {

		            	var cssString = {};
		            	var keyString = issueKey.split('-')[0];
		            	var color = '#'+Math.floor(Math.random()*16777215).toString(16);

		            	if(ticketsArr[keyString]) {

		            		ticketsArr[keyString].items.push($(this).index());

		            	} else {

		            		ticketsArr[keyString] = {
				            	'color': color,
				            	'items': [$(this).index()]
				            }

		            	}

			            // Error - Late
			            if (ticketDateTimeUnix < currentDateTimeUnix) {
			                cssString['background-color'] = "6#e9b6b";
			            }

			            // Success - Today
			            if (ticketDate == currentDate && ticketDateTimeUnix > currentDateTimeUnix) {
			                cssString['background-color'] = "#cfe9b6";
			            }

			            // Edited - Today
			            if (ticketDate == currentDate && updatedDate == currentDate) {

			                if (updatedTime > '09:30') {
			                    cssString['background-color'] = "#f0b664";
			                }

			            }

			            $(this).css(cssString);

			            if (ticketDate == currentDate && $(this).find('.status span').text() != 'In Progress') {
			                var hoursString = $(this).find('.timeoriginalestimate').text();
			                var timeWorked = timeSpent($(this).find('.timespent').text());
			                var hours = parseFloat(hoursString) - parseFloat(timeWorked);
			                if(hours > 0) totalHours = parseFloat(totalHours) + parseFloat(hours);
			                ticketsToday++;
			            }

			            if (ticketDate == nextDay && $(this).find('.status span').text() != 'In Progress') {
			                var hoursString = $(this).find('.timeoriginalestimate').text();
			                var timeWorked = timeSpent($(this).find('.timespent').text());
			                var hours = parseFloat(hoursString) - parseFloat(timeWorked);
			                if(hours > 0) totalTomorrow = parseFloat(totalTomorrow) + parseFloat(hours);
			                ticketsTomorrow++;
			            }

			        }

			    });

			    Object.keys(ticketsArr).forEach(function(key) {

			    	var items = ticketsArr[key].items;
			    	var color = ticketsArr[key].color;

			    	if(items.length > 1) {
				    	for (var n = 0; n < items.length; n++) {
				    		var row = $gadget.find('tbody tr').eq(items[n]);
				    		row.find('.issuetype').css('background', color);
			    		}
			    	}

				});

	        });

	        $('.page-type-dashboard #content').prepend('<div class="ticket-count tomorrow">Total Hours '+nextWording+' <strong>' + totalTomorrow.toFixed(1) + '</strong> Total Tickets '+nextWording+' <strong>' + ticketsTomorrow + '</strong></div>');

	        if(totalHours <= 0) {
	            $('.page-type-dashboard #content').prepend('<div class="ticket-count today completed">All Tickets Done Today</div>');
	        } else {
	            $('.page-type-dashboard #content').prepend('<div class="ticket-count today">Total Hours Today <strong>' + totalHours.toFixed(1) + '</strong> Total Tickets Today <strong>' + ticketsToday + '</strong></div>');
	        }

	    }, 1000);

	}

}

function timeSpent(time) {

    var timeSpentArr = time.split(' ');
    var newTimeSpent = 0;
    for ( var i = 0, l = timeSpentArr.length; i < l; i++ ) {
        var newTime = timeSpentArr[i];
        if(newTime) {
            if (newTime.indexOf('m') >= 0) newTime = parseFloat(newTime) / 60;
            newTimeSpent = parseFloat(newTime) + parseFloat(newTimeSpent);
        }
    }
    if(newTimeSpent < 0) newTimeSpent = 0;
    return newTimeSpent;

}