export function configureTutorialEvents(controller, tutorialObj, tutorialArr) {
    controller.on('profile.loaded', () => {
        tutorialObj.createSlides(tutorialArr);
        tutorialObj.addTutorialButton(controller.config.config.feedback?.visible);
    })
}
