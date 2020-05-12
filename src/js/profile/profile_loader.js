const categoryClass = '.data-category';
const indicatorClass = '.indicator__sub-indicator';
const subcategoryClass = '.data-category__indicator';

export default class ProfileLoader {

    loadProfile = (dataBundle) => {
        //todo - make this constructor

        const profile = dataBundle.profile;
        const all_categories = profile.profileData;
        const geometries = dataBundle.geometries;

        let categoryTemplate = $(categoryClass)[0].cloneNode(true);
        let indicatorTemplate = $(indicatorClass)[0].cloneNode(true);

        console.log(indicatorTemplate)

        $(categoryClass).remove();
        $(subcategoryClass, categoryTemplate).remove();
    }
}