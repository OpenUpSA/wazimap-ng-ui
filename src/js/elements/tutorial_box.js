export class TutorialBox {
    constructor() {

    }

    prepTutorialBox = (payload) => {
        const overview = payload.overview;
        if (typeof overview !== 'undefined') {
            $('.tutorial .profile-name').text(overview.name);
        }
    }
}