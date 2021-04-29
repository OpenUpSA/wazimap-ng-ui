import {EVENTS} from '../elements/tutorial';

export function configureTutorialEvents(controller, tutorialObj, tutorialArr) {
    controller.on('profile.loaded', () => tutorialObj.createSlides(tutorialArr))
    tutorialObj.on(EVENTS.next, () => controller.onTutorial(EVENTS.next))
    tutorialObj.on(EVENTS.prev, () => controller.onTutorial(EVENTS.prev))
}
