export function configurePointDataEvents(controller, objs = {pointDataTray: null, pointData: null}) {
    const pointDataTray = objs['pointDataTray'];
    const pointData = objs['pointData'];

    controller.on("point_tray.category.selected", payload => pointData.showCategoryPoint(payload.payload, pointData.pointFilter.keywordSearchOptions));
    controller.on("point_tray.category.unselected", payload => pointData.removeCategoryPoints(payload.payload));
    controller.on("point_data.all.reload", payload => {
        pointData.activeCategories.map((category) => {
            pointData.removeCategoryPoints(category, false);
            pointData.showCategoryPoint(category, pointData.pointFilter.keywordSearchOptions)
        })
    });
    controller.on("map.zoomed", payload => pointData.onMapZoomed(payload.payload));
    controller.on("point_data.all.unselected", () => pointDataTray.unSelectAll())
    controller.on("point_data.category.loading", payload => {
        pointDataTray.triggerCategoryLoading(payload.payload);
    });
    controller.on("point_data.category.loaded", payload => {
        pointDataTray.triggerCategoryLoaded(payload.payload.category);
    });

    controller.bubbleEvents(pointDataTray, [
        'point_tray.theme.selected', 'point_tray.theme.unselected',
        'point_tray.tray.loading_themes', 'point_tray.tray.themes_loaded',
        'point_tray.category.selected', 'point_tray.category.unselected',
        'themeLoaded'
    ])

    controller.bubbleEvents(pointData, [
        'point_data.category.loaded', 'point_data.category.loading',
        'point_data.load_popup.hovered', 'point_data.load_popup.clicked',
        'point_data.all.unselected', 'point_data.all.reload'
    ]);

    pointDataTray.loadThemes();
}
