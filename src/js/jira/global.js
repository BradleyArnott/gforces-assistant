const globalJIRA = {

    init() {
        const position = document.querySelector('.aui-header-primary .aui-nav > li:last-child');
        if (!position) return;
        const parent = position.parentNode;
        const menu = document.createElement('li');
        const { username } = document.querySelector('#header-details-user-fullname').dataset;
        const openIssues = `https://jira.netdirector.co.uk/issues/?jql=status%20in%20(Reopened%2C%20Resolved%2C%20%22More%20information%22%2C%20Quoted%2C%20Rejected%2C%20Done%2C%20%22Pending%20Customer%20Feedback%22%2C%20%22Third%20Party%20Feedback%22%2C%20%22Query%20Answered%22%2C%20%22Awaiting%20Feedback%22%2C%20Completed)%20AND%20reporter%20in%20(${username})%20ORDER%20BY%20summary%20ASC`;

        let newItem = '<a class="aui-nav-link aui-dropdown2-trigger " id="ts-custom-labels-link" href="" aria-haspopup="true" aria-owns="ts-custom-labels-link-content" aria-controls="ts-custom-labels-link-content">CSS Assistant</a>';
        newItem += '<div id="ts-custom-labels-link-content" class="aui-dropdown2 aui-style-default aui-dropdown2-in-header" data-dropdown2-alignment="left" aria-hidden="true">';
        newItem += '<div class="aui-dropdown2-section">';
        newItem += '<strong>Labels</strong>';
        newItem += '<ul id="report" class="aui-list-truncate">';
        newItem += '<li><a href="/issues/?jql=labels%20%3D%20css-automated-nodue">No Due Date</a></li>';
        newItem += '<li><a href="/issues/?jql=labels%20%3D%20css-automated-noquote">No Quote</a></li>';
        newItem += '</div>';
        newItem += '<div class="aui-dropdown2-section">';
        newItem += '</ul>';
        newItem += '<ul id="report" class="aui-list-truncate">';
        newItem += `<li><a href="${openIssues}">My Open Issues</a></li>`;
        newItem += '</ul>';
        newItem += '</div>';
        newItem += '</div>';

        menu.innerHTML = newItem;
        parent.insertBefore(menu, position);
    },
};

globalJIRA.init();
