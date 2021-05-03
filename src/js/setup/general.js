export function configurePage(controller, config) {
    if (config.config.page_title)
        $('title').text(config.config.page_title);

    if (config.analytics)
        config.analytics.registerEvents(controller);
}
