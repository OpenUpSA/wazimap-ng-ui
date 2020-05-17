import {Category} from "./category";
import {ProfileHeader} from "./profile-header";

const profileWrapperClass = '.rich-data-content';
const navWrapperClass = '.rich-data-nav__list';
const navItemClass = '.rich-data-nav__item';
const indicatorClass = '.sub-indicator';
const activeNavClass = 'w--current';

let maxId = 0;
let indicatorTemplate = null;
let profileWrapper = null;


export default class ProfileLoader {
    constructor() {
    }

    loadProfile = (dataBundle) => {
        //todo - make this constructor
        const profile = dataBundle.profile;
        const geometries = dataBundle.geometries;

        this.setDomElements();
        this.loadCategories(profile);
        this.updateGeography(profile);

        let profileHeader = new ProfileHeader(profile.parents, geometries);
    }

    setDomElements = () => {
        //get the objects first, them remove defaults
        indicatorTemplate = $(indicatorClass)[0].cloneNode(true);
        profileWrapper = $(profileWrapperClass);

        //remove
        $(navWrapperClass).find(navItemClass).remove();
    }

    updateGeography = (profile) => {
        $('.location__title h1').text(profile.geography.name);
        $('.current-location .truncate', profileWrapper).text(profile.geography.name);
    }

    loadCategories = (profile) => {
        const categories = profile.profileData;
        this.createNavItem('top', 'Summary');
        for (const [category, detail] of Object.entries(categories)) {
            const id = this.getNewId();
            this.createNavItem(id, category);
            let c = new Category(category, detail, profileWrapper, id);
        }
    }

    getNewId = () => {
        maxId++;
        let id = 'category-' + maxId;
        return id;
    }

    createNavItem = (id, category) => {
        let navItem = $(navItemClass)[0].cloneNode(true);
        $(navItem).attr('href', '#' + id);
        $(navItem).attr('title', category);
        $('.rich-data-nav__item-text .truncate', navItem).text(category);

        $(navItem).on('click', () => {
            $(navWrapperClass).find(navItemClass).each(function () {
                if ($(this).hasClass(activeNavClass)) {
                    $(this).removeClass(activeNavClass);
                }
            });

            $(navItem).addClass(activeNavClass);
        })

        $(navWrapperClass).append(navItem);
    }
}