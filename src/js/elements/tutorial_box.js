export class TutorialBox {
    constructor() {

    }

    prepTutorialBox = (payload) => {
        const overview = payload.overview;
        $('.tutorial .profile-name').text(overview.name);
    }
}