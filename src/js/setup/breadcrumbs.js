export function configureBreadcrumbsEvents(controller, objs = {profileLoader: null, locationInfoBox: null}) {
    const profileLoader = objs['profileLoader'];
    const locationInfoBox = objs['locationInfoBox'];

    controller.bubbleEvents(profileLoader, ['profile.breadcrumbs.selected', 'profile.nav.clicked']);
    controller.bubbleEvent(locationInfoBox, 'location_infobox.breadcrumbs.selected');
    profileLoader.on('profile.breadcrumbs.selected', payload => controller.onBreadcrumbSelected(payload))
    locationInfoBox.on('location_infobox.breadcrumbs.selected', payload => controller.onBreadcrumbSelected(payload))
}