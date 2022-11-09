
export function configureFacilityEvents(controller, objs = {profileLoader: null}) {
    const profileLoader = objs['profileLoader'];

    controller.bubbleEvents(profileLoader, ['profile.facilities.loaded']);
}
