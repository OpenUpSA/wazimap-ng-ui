import {Observable} from "../utils";
import {Category} from "./category";
import {Profile_header} from "./profile_header";

const profileWrapperClass = '.rich-data-content';
const navWrapperClass = '.rich-data-nav__list';
const navItemClass = '.rich-data-nav__item';
const indicatorClass = '.profile-indicator';
const activeNavClass = 'w--current';

let maxId = 0;
let indicatorTemplate = null;
let profileWrapper = null;


export default class ProfileLoader extends Observable {
    constructor(_config, _api, _profileId) {
        super();

        this.api = _api;
        this.profileId = _profileId;
    }

    loadProfile = (dataBundle) => {
        //todo - make this constructor
        const profile = dataBundle.profile;
        const geometries = dataBundle.geometries;
        const geography = profile.geography;

        this.prepareDomElements();
        this.loadCategories(profile);
        this.updateGeography(profile);

        let profileHeader = new Profile_header(profile.parents, geometries, this.api, this.profileId, geography);
        profileHeader.on('profile.breadcrumbs.selected', parent => this.triggerEvent('profile.breadcrumbs.selected', parent));
    }

    prepareDomElements = () => {
        //get the objects first, them remove defaults
        indicatorTemplate = $(indicatorClass)[0].cloneNode(true);
        profileWrapper = $(profileWrapperClass);

        //remove
        $(navWrapperClass).find(navItemClass).remove();
    }

    updateGeography = (profile) => {
        $('.location__title h1').text(profile.geography.name);
        $('.sticky-header__current-location .truncate', profileWrapper).text(profile.geography.name);
    }

    loadCategories = (profile) => {
        let removePrevCategories = true;
        const categories = profile.profileData;

        this.createNavItem('top', 'Summary');
        for (const [category, detail] of Object.entries(categories)) {
            const id = this.getNewId();
            this.createNavItem(id, category);
            let c = new Category(category, detail, profileWrapper, id, removePrevCategories);

            removePrevCategories = false;
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