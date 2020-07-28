export function configureProfileEvents(controller, objs = {profileLoader: null}) {
    const profileLoader = objs['profileLoader'];

    controller.on('profile.loaded', payload => profileLoader.loadProfile(payload.payload))
    controller.bubbleEvents(profileLoader, ['profile.chart.saveAsPng', 'profile.chart.valueTypeChanged']);
}
