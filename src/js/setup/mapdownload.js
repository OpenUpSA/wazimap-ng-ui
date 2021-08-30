export function configureMapDownloadEvents(mapDownload) {
    let initialHtml = $('.map-download').html();
    let loadState = $('.location-tag__loading-icon')[0].cloneNode(true);

    mapDownload.on('mapdownload.started', payload => $('.map-download').html(loadState))
    mapDownload.on('mapdownload.completed', payload => $('.map-download').html(initialHtml))
}

