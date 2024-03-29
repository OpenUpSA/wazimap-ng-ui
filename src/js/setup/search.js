import {onProfileLoaded as onProfileLoadedSearch} from '../elements/header/search';

export function configureSearchEvents(controller, search) {
    controller.on('profileLoaded', onProfileLoadedSearch);

    search.on('search.resultClick', payload => controller.onSearchResultClick(payload));
    controller.bubbleEvents(search, ['search.before', 'search.results', 'search.clear'])

    search.on('search.category.selected', category => {
        controller.triggerEvent('open.point_data.panel');
        controller.triggerEvent('point_tray.category.selected', category);
    })

    search.on('search.point.selected', pointData => {
        controller.triggerEvent('open.point_data.panel');
        controller.triggerEvent('point_tray.point.selected', pointData);
    })
}
