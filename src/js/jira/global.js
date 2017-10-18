const globalJIRA = {

    init() {
        let newItem = '<a class="aui-nav-link aui-dropdown2-trigger " id="ts-custom-labels-link" href="" aria-haspopup="true" aria-owns="ts-custom-labels-link-content" aria-controls="ts-custom-labels-link-content">Automated Labels</a>';
        newItem += '<div id="ts-custom-labels-link-content" class="aui-dropdown2 aui-style-default aui-dropdown2-in-header" data-dropdown2-alignment="left" aria-hidden="true">';
        newItem += '<div class="aui-dropdown2-section">';
        newItem += '<ul id="report" class="aui-list-truncate">';
        newItem += '<li><a href="/issues/?jql=labels%20%3D%20css-automated-nodue">No Due Date</a></li>';
        newItem += '<li><a href="/issues/?jql=labels%20%3D%20css-automated-noquote">No Quote</a></li>';
        newItem += '</ul>';
        newItem += '</div>';
        newItem += '</div>';

        const position = document.querySelector('.aui-header-primary .aui-nav > li:last-child');
        const parent = position.parentNode;
        const menu = document.createElement('li');

        menu.innerHTML = newItem;
        parent.insertBefore(menu, position);
    },
};

globalJIRA.init();
