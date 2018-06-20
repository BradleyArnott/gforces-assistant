const projects = {
    data: [],

    init() {
        setTimeout(() => {
            this.loopIssues()
                .then(() => {
                    this.setCookie(this.data, 1);
                });
        }, 2000);
    },

    loopIssues() {
        return new Promise(((resolve) => {
            const promises = [];
            const issues = document.querySelectorAll('.ghx-first .ghx-column[data-column-id="1298"] .ghx-issue');
            const cached = JSON.parse(this.getCookie());
            if (cached) this.data = JSON.parse(this.getCookie());
            issues.forEach((issue) => {
                promises.push(new Promise(((res) => {
                    if (!cached) {
                        this.getIssue(issue)
                            .then(this.applyDays)
                            .then(() => {
                                res();
                            });
                    } else {
                        cached.forEach((entry, index) => {
                            const cachedKey = entry.issue;
                            const issueKey = issue.getAttribute('data-issue-key');

                            if (cachedKey === issueKey) {
                                if (!entry.phaseOne) return;
                                entry.issue = issue;
                                this.applyDays(entry);
                                resolve();
                                return;
                            }

                            if (index === cached.length - 1 && cachedKey !== issueKey) {
                                this.getIssue(issue)
                                    .then(this.applyDays)
                                    .then(() => {
                                        resolve();
                                    });
                            }
                        });
                    }
                })));
            });

            Promise.all(promises)
                .then(() => {
                    resolve();
                });
        }));
    },

    getCookie() {
        const name = 'CSS-Days-Phase-1=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return false;
    },

    setCookie(data) {
        const tomorrow = moment().add(1, 'day').hours(8).minutes(0)
            .seconds(0)
            .toDate();
        const expires = `expires=${tomorrow}`;
        document.cookie = `CSS-Days-Phase-1=${JSON.stringify(data)};${expires};path=/`;
    },

    getDays(issue) {
        const daysClass = issue.classList[5];
        const numDays = daysClass.slice(9);
        return numDays;
    },

    applyDays(data) {
        if (!data.phaseOne) return;
        const days = projects.getDays(data.issue);
        const warn = days === 3 ? ' warn' : '';
        const over = days > 3 ? ' over' : '';
        const counter = document.createElement('div');
        const content = `<div class=""><span>${days}</span></div>`;
        const placement = data.issue.querySelector('.ghx-issue-content');

        counter.className = `custom-days-count${warn}${over}`;
        counter.innerHTML = content;

        placement.parentNode.insertBefore(counter, placement.nextSibling);
    },

    getIssue(issue) {
        const key = issue.getAttribute('data-issue-key');
        const request = new XMLHttpRequest();

        return new Promise((resolve) => {
            request.open('GET', `https://jira.netdirector.co.uk/rest/api/2/issue/${key}`, true);

            request.onload = () => {
                if (request.status >= 200 && request.status < 400) {
                    const resp = JSON.parse(request.response);
                    const { labels } = resp.fields;
                    const phaseOne = labels.includes('CSS-QA-Phase1');
                    this.data.push({ issue: key, phaseOne });
                    resolve({ issue, phaseOne });
                }
            };

            request.send();
        });
    },
};



projects.init();
