import {onProfileLoaded as onProfileLoadedSearch} from '../elements/search';

export function configureSearchEvents(controller, components) {
    controller.on('profileLoaded', onProfileLoadedSearch);

    components.search.on('search.resultClick', payload => controller.onSearchResultClick(payload));
    controller.bubbleEvents(components.search, ['search.before', 'search.results', 'search.clear'])
}
