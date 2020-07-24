import {loadMenu} from '../elements/menu';

export function configureDataExplorerEvents(controller) {
    controller.on('profile.loaded', payload => loadMenu(payload.payload.profile.profileData, payload => {
        controller.onSubIndicatorClick(payload)
    }))
}
