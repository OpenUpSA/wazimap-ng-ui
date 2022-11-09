export function configureRichDataPanelEvents(controller, objs = {richDataLinkRendrer: null}) {
    const richDataLinkRendrer = objs['richDataLinkRendrer'];

    controller.bubbleEvents(richDataLinkRendrer, ['open.rich_data.panel']);

    controller.on('profile.facilities.loaded', (payload) => {
        richDataLinkRendrer.showLink = payload
        richDataLinkRendrer.render()
    });

    controller.on('hashChange', () => {
        richDataLinkRendrer.hideLink();
    })
}
