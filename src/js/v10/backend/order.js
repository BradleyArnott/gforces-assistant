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
const selectorArray = {};
let itemContainer = '';
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

orderModules.buttonMarkup = () =>
    `<a class='nd-module-remove custom-order-settings'
    style='background: #673ab7 !important;'
    href='#'><i class='nd-icon-resize-vertical nd-icon-invert' style='background-position: -432px -119px;'></i></a>`;

orderModules.modalMarkup = () =>
    `<div id="nd-reorder-modules" class="nd-modal nd-hide nd-fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="nd-modal-header">
            <a class="nd-close close-modal" aria-hidden="true">×</a>
            <h3>Order Modules</h3>
        </div>
        <div class="nd-modal-body">
            <div class="order-modal"></div>
        </div>
        <div class="nd-modal-footer">
            <button class="nd-btn nd-btn-danger close-modal" aria-hidden="true">Cancel</button>
            <button class="nd-btn nd-btn-success save" aria-hidden="true">Save</button>
        </div>
    </div>`;

orderModules.addButtons = () =>
    new Promise(((resolve) => {
        $(orderModules.modalMarkup()).appendTo('body');
        $('#nd-reorder-modules').modal({ show: false });
        $('.container-wrap > .nd-module-btns').append(orderModules.buttonMarkup());
        $('.container-wrap .row-fluid > .nd-module-btns').append(orderModules.buttonMarkup());

        $('.order-modal').sortable({
            cancel: '.order-modal a',
            scroll: false,
            zIndex: 10000,
        });

        $('.order-modal').disableSelection();
        resolve();
    }));

orderModules.saveEvents = () => {
    $('body').on('click', '#nd-reorder-modules .save', (e) => {
        e.preventDefault();

        orderModules.getList().then((data) => {
            orderModules.changeOrder(data);
            orderModules.clear();
        });
    });
};

orderModules.getList = () => {
    const itemList = [];

    return new Promise(((resolve) => {
        $('.order-modal span').each(function orderLoop() {
            itemList.push($(this).attr('data-index'));
        });
        resolve(itemList);
    }));
};

orderModules.changeOrder = (items) => {
    items.forEach((item) => {
        if (isModule === false) {
            $(itemContainer).find('.container').append(selectorArray[item]);
        } else {
            $(itemContainer).append(selectorArray[item]);
        }
    });
    isModule = true;
};

orderModules.closeEvents = () => {
    $('body').on('click', '#nd-reorder-modules .close-modal', (e) => {
        e.preventDefault();
        orderModules.clear();
    });
};

orderModules.clickEvents = () => {
    $('body').on('click', '.custom-order-settings', function clickEvent(e) {
        e.preventDefault();
        $('.order-modal').find('span').remove();

        let itemType = '> [data-module]';
        const itemNames = [];

        itemContainer = $(this).closest('.row-fluid, [class^="span"], .container-wrap');

        if (itemContainer.hasClass('container-wrap')) {
            isModule = false;
            itemType = '.row-fluid';
        }

        $(itemContainer).find(itemType).each(function itemLoop(i) {
            $(this).attr('style', `border: 5px solid ${colorArray[i]} !important;`);
            const itemClass = $(this).attr('class');
            if (!itemClass) return;
            const splitClass = itemClass.split(/\s+/).join(' ');
            selectorArray[i] = $(this)[0];
            itemNames.push(splitClass);
        });

        if (itemNames.length === 0) return;
        orderModules.addList(itemNames);

        $('#nd-reorder-modules').modal('show');
    });
};

orderModules.addList = (itemNames) => {
    let markup = '';
    itemNames.forEach((item, i) => {
        markup += `<span data-index="${i}" style="border-left: 5px solid ${colorArray[i]};">${item}</span>`;
    });
    $('.order-modal').append(markup);
};

orderModules.set = () => {
    $('body').on('click', '#nd-reorder-modules .save', (e) => {
        e.preventDefault();
        const contentOrder = [];
        $('.order-modal span').each(function orderLoop() {
            contentOrder.push($(this).attr('data-index'));
        });
        orderModules.clear();
        orderModules.arrange(contentOrder);
    });
};

orderModules.arrange = (items) => {
    items.forEach((item) => {
        if (isModule === false) $(itemContainer).find('.container').append(selectorArray[item]);
        else $(itemContainer).append(selectorArray[item]);
    });
    isModule = true;
};

orderModules.clear = () => {
    $('.order-modal').find('span').remove();
    $('[data-module]').attr('style', '');
    $('.row-fluid').attr('style', '');
    $('#nd-reorder-modules').modal('hide');
};

orderModules.init();
