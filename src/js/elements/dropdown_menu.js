export default class DropdownMenu {
    constructor(container) {
        $(container).find(".mapping-options__filter_menu").each(function (index){
            let element = $(this);

            element.find('.dropdown-menu__trigger').on('click', () => {
                element.find('.dropdown-menu__content').removeClass('hidden');
                element.find('.dropdown-menu__content').show();
            })

            let text = index % 2 == 0 ? 'Select an attribute' : 'Select a value';

            element.find(".dropdown-menu__trigger .dropdown-menu__selected-item .truncate").text(text);
        })
    }
}