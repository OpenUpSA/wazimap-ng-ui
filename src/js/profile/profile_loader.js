import {Category} from "./category";

const categoryClass = '.data-category';
const profileHeaderClass = '#profile-top';
const indicatorClass = '.indicator__sub-indicator';

let tooltipClone = null;
let categoryTemplate = null;
let indicatorTemplate = null;
let profileHeader = null;


export default class ProfileLoader {
    constructor() {
    }

    loadProfile = (dataBundle) => {
        //todo - make this constructor
        this.setDomElements();
        this.loadCategories(dataBundle);
    }

    setDomElements = () => {
        //get the objects first, them remove defaults
        categoryTemplate = $(categoryClass)[0].cloneNode(true);
        indicatorTemplate = $(indicatorClass)[0].cloneNode(true);
        profileHeader = $(profileHeaderClass);
        tooltipClone = $('.sub-indicator__chart_area .bar-chart__row_tooltip')[0].cloneNode(true);

        //remove
        $(categoryClass).remove();
    }

    loadCategories = (dataBundle) => {
        const profile = dataBundle.profile;

        const categories = profile.profileData;
        for (const [category, detail] of Object.entries(categories)) {
            let c = new Category(category, detail, categoryTemplate, profileHeader, indicatorTemplate, tooltipClone);
        }
    }
}