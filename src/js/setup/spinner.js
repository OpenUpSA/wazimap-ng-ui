import {LoadingSpinner} from '../elements/loading_spinner';

export function configureSpinnerEvents(controller) {
    const searchLoadSpinner = new LoadingSpinner($('.location__search_loading'));
    const contentMapSpinner = new LoadingSpinner('.breadcrumb__loading', {start: true}, true);

    controller.on("search.before", payload => searchLoadSpinner.start());
    controller.on("search.results", payload => searchLoadSpinner.stop());
    controller.on("layerLoaded", payload => contentMapSpinner.stop());
}
