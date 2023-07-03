import {onProfileLoaded as onProfileLoadedSearch} from '../elements/header/search';

export function configureSearchEvents(controller, search) {
    controller.on('profileLoaded', onProfileLoadedSearch);

    search.on('search.resultClick', payload => controller.onSearchResultClick(payload));
    controller.bubbleEvents(search, ['search.before', 'search.results', 'search.clear'])
}
