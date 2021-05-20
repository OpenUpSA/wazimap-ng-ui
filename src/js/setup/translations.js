export function configureTranslationEvents(controller, translations) {
    controller.on('profile.loaded', payload => {
        translations.translate();
    });
}