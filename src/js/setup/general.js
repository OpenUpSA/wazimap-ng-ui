export function configurePage(controller, config) {
    if (config.config.page_title)
        $('title').text(config.config.page_title);

    if (config.analytics)
        config.analytics.registerEvents(controller);
}

export function initialPageLoad(controller) {
  controller.on('profile.loaded', payload => {
      // there seems to be a bug where menu items close if this is not set
      $(".sub-category__dropdown_wrapper a").attr("href", "#");
      controller.loadInitialFilters(payload.payload);
  })
}
