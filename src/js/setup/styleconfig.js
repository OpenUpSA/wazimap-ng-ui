export function configureStyleConfigEvents(controller, styleConfig) {
    controller.on('profile.loaded', () => styleConfig.insertStyleRules())
}
