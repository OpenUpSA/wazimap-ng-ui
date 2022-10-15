import {Component} from "../utils";
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


export default class ProfileLoader extends Component {
    constructor(parent, formattingConfig, _api, _profileId, _config) {
        super(parent);

        this.api = _api;
        this.profileId = _profileId;
        this.formattingConfig = formattingConfig;
        this.config = _config;
        this.profileHeader = null;
    }

    loadProfile = (dataBundle, activeVersion) => {
        const profile = dataBundle.profile;
        const geometries = dataBundle.geometries;
        const geography = profile.geography;

        this.prepareDomElements();
        this.loadCategories(profile);
        this.updateGeography(profile);

        this.profileHeader = new Profile_header(this, profile.parents, geometries, this.api, this.profileId, geography, this.config, activeVersion);
        this.profileHeader.on('profile.breadcrumbs.selected', parent => this.triggerEvent('profile.breadcrumbs.selected', parent));

        this.prepareEvents()
    }

    prepareDomElements = () => {
        indicatorTemplate = $(indicatorClass)[0].cloneNode(true);
        profileWrapper = $(profileWrapperClass);

        $(navWrapperClass).find(navItemClass).remove();
    }

    prepareEvents = () => {
        this.bindPageScroll();
    }

    updateGeography = (profile) => {
        if ($('.location__title h1').length <= 0) {
            let h1 = document.createElement('h1');
            $(h1).addClass('cc-clear');
            $('.location__title').append(h1);
        }
        $('.location__title h1').text(profile.geography.name);
        $('.location__title .loading').addClass('hidden');
        $('.sticky-header__current-location .truncate', profileWrapper).text(profile.geography.name);
        $('.sticky-header__current-location .loading__icon', profileWrapper).addClass('hidden');
    }

    loadCategories = (profile) => {
        let removePrevCategories = true;
        const categories = profile.profileData;
        let isFirst = true;

        this.createNavItem('top', 'Summary');
        for (const [category, detail] of Object.entries(categories)) {
            const id = this.getNewId();
            let c = new Category(this, this.formattingConfig, category, detail, profileWrapper, id, removePrevCategories, isFirst, profile.geography, this.config);
            c.isVisible = c.subCategories.length > 0;
            if (c.isVisible) {
                this.createNavItem(id, category);
                isFirst = false;    //set to false only when there is a visible item
            }
            this.bubbleEvents(c, [
                'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
                'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
                'point_tray.subindicator_filter.filter'
            ]);

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
        $('.rich-data-nav__item-text .truncate', navItem)
            .text(category)
            .click(e => {
                this.triggerEvent('profile.nav.clicked', category);
            })

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

    bindPageScroll = () => {
        let lastId;
        let topMenuHeight = $('.nav').outerHeight();
        let menuItems = $(navWrapperClass).find(navItemClass);
        let scrollItems = menuItems.map(function () {
            let item = $($(this).attr('href'));
            if (item.length) {
                return item;
            }
        });

        $(window).on('scroll', function () {
            let fromTop = $(this).scrollTop() + topMenuHeight;
            let currentItem = scrollItems.map(function () {
                if ($(this).offset().top < fromTop && $(this).offset().top > 0)
                    return this;
            });

            currentItem = currentItem[currentItem.length - 1];
            let id = currentItem && currentItem.length ? currentItem[0].id : ''

            if (lastId !== id) {
                lastId = id;
                // Set/remove active class
                menuItems.removeClass(activeNavClass);
                menuItems.filter("[href='#" + id + "']").addClass(activeNavClass);
            }
        })
    }

    updateActiveVersion = (activeVersion) => {
        this.triggerEvent('version.updated', activeVersion);
    }
}