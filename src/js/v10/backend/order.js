const colorArray = [
    '#1abc9c',
    '#9b59b6',
    '#2ecc71',
    '#e67e22',
    '#34495e',
    '#f1c40f',
    '#e74c3c',
    '#bdc3c7',
    '#3498db',
    '#7f8c8d',
    '#FD5B03',
    '#6F532A',
    '#953163',
    '#7CEECE',
];
let itemContainer = '';
const selectorArray = {};
let isModule = true;

const orderModules = {

    init() {
        orderModules.addButtons().then(() => {
            orderModules.set();
            orderModules.clickEvents();
            orderModules.closeEvents();
            orderModules.saveEvents();
        });
    },
};

orderModules.addButtons = function () {
    return new Promise(((resolve, reject) => {
        $('<div class="order-modal-overlay"></div><div class="order-modal"><a href="#" class="save">Save</a><a href="#" class="cancel">Cancel</a></div>').appendTo('body');
        $('.container-wrap > .nd-module-btns').append("<a class='nd-module-remove custom-order-settings' style='background: #673ab7 !important; margin-right: 3px !important; border-radius: 0 0 3px 3px;' href='#'><i class='nd-icon-resize-vertical nd-icon-invert'></i></a>");
        $('.container-wrap .row-fluid > .nd-module-btns').append("<a class='nd-module-remove custom-order-settings' style='background: #673ab7 !important; margin-right: 3px !important; border-radius: 0 0 3px 3px;' href='#'><i class='nd-icon-resize-vertical nd-icon-invert'></i></a>");
        $('[class^="layout"] > [class^="span"]').append("<div class='nd-module-btns'><a class='nd-module-remove custom-order-settings' style='background: #673ab7 !important; margin-right: 3px !important; border-radius: 0 0 3px 3px;' href='#'><i class='nd-icon-resize-vertical nd-icon-invert'></i></a></div>");

        $('.order-modal').sortable({
            cancel: '.order-modal a',
            scroll: false,
            zIndex: 10000,
        });
        $('.order-modal').disableSelection();
        resolve();
    }));
};
orderModules.saveEvents = function () {
    $('body').on('click', '.order-modal .save', (e) => {
        e.preventDefault();

        orderModules.getList().then((data) => {
            orderModules.changeOrder(data);
            orderModules.clear();
        });
    });
};

orderModules.getList = function () {
    const itemList = [];

    return new Promise(((resolve, reject) => {
        $('.order-modal span').each(function () {
            itemList.push($(this).attr('data-index'));
        });
        resolve(itemList);
    }));
};

orderModules.changeOrder = function (items) {
    items.forEach((item, i) => {
        if (isModule === false) {
            $(itemContainer).find('.container').append(selectorArray[item]);
        } else {
            $(itemContainer).append(selectorArray[item]);
        }
    });
    isModule = true;
};

orderModules.closeEvents = function () {
    $('body').on('click', '.order-modal .cancel, .order-modal-overlay', (e) => {
        e.preventDefault();
        orderModules.clear();
    });
};

orderModules.clickEvents = function () {
    $('.custom-order-settings').click(function (e) {
        e.preventDefault();
        $('.order-modal').find('span').remove();

        let itemType = '> [data-module]',
            slicePosition = 0,
            itemNames = [];

        itemContainer = $(this).closest('.row-fluid, [class^="span"], .container-wrap');

        if (itemContainer.hasClass('container-wrap')) {
            isModule = false;
            itemType = '.row-fluid';
            slicePosition = 1;
        }

        $(itemContainer).find(itemType).each(function (i) {
            $(this).attr('style', `border: 5px solid ${colorArray[i]} !important;`);
            let itemClass = $(this).attr('class'),
                splitClass = itemClass.split(/\s+/).join(' ');
            selectorArray[i] = $(this)[0];
            itemNames.push(splitClass);
        });
        if (itemNames.length === 0) return;
        orderModules.addList(itemNames);

        $('.order-modal').show();
        $('.order-modal-overlay').show();
    });
};

orderModules.addList = function (itemNames) {
    let markup = '';
    itemNames.forEach((item, i) => {
        markup += `<span data-index="${i}" style="border-left: 5px solid ${colorArray[i]};">${item}</span>`;
    });
    $('.order-modal').append(markup);
};

orderModules.set = function () {
    $('body').on('click', '.order-modal .save', (e) => {
        e.preventDefault();
        const contentOrder = [];
        $('.order-modal span').each(function () {
            contentOrder.push($(this).attr('data-index'));
        });
        orderModules.clear();
        orderModules.arrange(contentOrder);
    });
};

orderModules.arrange = function (items) {
    items.forEach((item, i) => {
        if (isModule === false) $(itemContainer).find('.container').append(selectorArray[item]);
        else $(itemContainer).append(selectorArray[item]);
    });
    isModule = true;
};

orderModules.clear = function () {
    $('.order-modal').hide().find('span').remove();
    $('.order-modal-overlay').hide();
    $('[data-module]').attr('style', '');
    $('.row-fluid').attr('style', '');
};

orderModules.init();
