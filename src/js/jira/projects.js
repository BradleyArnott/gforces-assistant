projects = {

	data: [],

	init: function() {

		setTimeout(function() {

			projects.loopIssues()
				.then(function() {
					console.log(projects.data)
					projects.setCookie(projects.data, 1);
				})

		}, 2000);
	},

	loopIssues: function() {

		return new Promise(function(resolve, reject) {

			let promises = [],
				issues = $('.ghx-first .ghx-column[data-column-id="1298"] .ghx-issue'),
				cached = JSON.parse(projects.getCookie());
			if (cached) projects.data = JSON.parse(projects.getCookie());

			for (let i = 0; i < issues.length; i++) {
				let issue = issues[i];

				promises.push(new Promise(function(resolve, reject) {

					if (!cached) {
						projects.getIssue(issue)
							.then(projects.applyDays)
							.then(function() {
								resolve();
							});

					} else {
						for (let p = 0; p < cached.length; p++) {
							let cachedKey = cached[p].issue,
								issueKey = $(issue).attr('data-issue-key');

							if (cachedKey === issueKey) {
								if (!cached[p].phaseOne) continue;
								cached[p].issue = issue;
								projects.applyDays(cached[p]);
								resolve();
								break;
							}

							if (p == cached.length - 1 && cachedKey !== issueKey) {
								projects.getIssue(issue)
									.then(projects.applyDays)
									.then(function() {
										resolve();
									});
							}
						}
					}
				}));
			};

			Promise.all(promises)
				.then(function() {
					resolve();
				})
		});
	},

	getCookie: function() {
		let name = "CSS-Days-Phase-1=",
			decodedCookie = decodeURIComponent(document.cookie),
			ca = decodedCookie.split(';');

		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return false
	},

	setCookie: function(data, days) {
		const tomorrow = moment().add(1, 'day').hours(8).minutes(0).seconds(0).toDate(),
			expires = "expires="+ tomorrow;
		document.cookie = 'CSS-Days-Phase-1=' + JSON.stringify(data) + ';' + expires + ';path=/';
	},

	getDays: function(issue) {
		const daysClass = issue.classList[5],
			numDays = daysClass.slice(9);

		return numDays;
	},

	applyDays: function(data) {
		if (!data.phaseOne) return;
		const days = projects.getDays(data.issue),
			warn = days == 3 ? ' warn' : '',
			over = days > 3 ? ' over' : '',
			content = '<div class="custom-days-count' + warn + over + '"><span>' + days + '</span></div>',
			placement = $(data.issue).find('.ghx-issue-content');
		$(content).insertAfter(placement);
	},

	getIssue: function(issue) {
		const key = $(issue).attr('data-issue-key');
		return new Promise(function(resolve, reject) {
			$.get('https://jira.netdirector.co.uk/rest/api/2/issue/' + key, function( data ) {
				let labels = data.fields.labels,
					phaseOne = $.inArray('CSS-QA-Phase1', labels) !== -1;
				projects.data.push({issue: key, phaseOne: phaseOne});
				resolve({issue: issue, phaseOne: phaseOne});
			});
		});
	}
};

projects.init();