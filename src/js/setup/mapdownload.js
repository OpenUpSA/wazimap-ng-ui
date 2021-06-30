export function configureMapDownloadEvents(controller, mapDownload) {
    let initialHtml = $('.map-download').html();
    let loadState = $('.location-tag__loading-icon')[0].cloneNode(true);

    mapDownload.on('mapdownload.started', payload => $('.map-download').html(loadState))
    mapDownload.on('mapdownload.completed', payload => $('.map-download').html(initialHtml))

    let showEvents = ['panel.rich_data.closed', 'panel.point_mapper.closed','panel.data_mapper.closed'];
    showEvents.forEach(event => {
        controller.on(event, () => {
            mapDownload.showButton();
        })
    });

    let hideEvents = ['panel.rich_data.opened', 'panel.point_mapper.opened','panel.data_mapper.opened'];
    hideEvents.forEach(event => {
        controller.on(event, () => {
            mapDownload.hideButton();
        })
    });
}