export default class DropdownMenu {
    constructor(container, initialSelectionLabel) {
        $(container).find(".mapping-options__filter_menu").each(function (){
            let element = $(this);

            element.find('.dropdown-menu__trigger').on('click', () => {
                element.find('.dropdown-menu__content').removeClass('hidden');
                element.find('.dropdown-menu__content').show();
            })

            element.find(".dropdown-menu__trigger .dropdown-menu__selected-item .truncate").text(initialSelectionLabel);
        })
    }
}