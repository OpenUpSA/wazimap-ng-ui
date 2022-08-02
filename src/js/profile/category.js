import {Subcategory} from "./subcategory";
import {checkIfSubCategoryHasChildren, Component} from "../utils";


let categoryTemplate = null;
let profileWrapper = null;
let removePrevCategories = false;

const categoryClass = 'div.section';
const categoryTitleClass = '.category-header__text h2';
const descriptionTextClass = '.category-header__description p';
const descriptionClass = '.category-header__description';

//category > subcategory > indicator > chart

export class Category extends Component {
    constructor(parent, formattingConfig, category, detail, _profileWrapper, _id, _removePrevCategories, isFirst, geography, profileConfig) {
        super(parent);

        categoryTemplate = $(categoryClass)[0].cloneNode(true);
        profileWrapper = _profileWrapper;
        removePrevCategories = _removePrevCategories;

        this.id = _id;
        this.formattingConfig = formattingConfig;
        this.geography = geography;
        this.profileConfig = profileConfig;
        this._subCategories = [];
        this._isVisible = true;
        this._uiElements = [];

        this.prepareDomElements();
        this.prepareEvents();
        this.addCategory(category, detail, isFirst);
    }

    get subCategories() {
        return this._subCategories;
    }

    get isVisible() {
        return this._isVisible;
    }

    set isVisible(value) {
        if (value) {
            this.uiElements.forEach((ele) => {
                $(ele).show();
            })
        } else {
            this.uiElements.forEach((ele) => {
                $(ele).hide();
            })
        }

        this._isVisible = value;
    }

    get uiElements() {
        return this._uiElements;
    }

    prepareDomElements = () => {
        if (removePrevCategories) {
            profileWrapper.find(categoryClass).remove();
        }
    }

    prepareEvents = () => {
        this.parent.on('version.updated', (activeVersion) => {
            this.triggerEvent('version.updated', activeVersion);
        });
    }

    addCategory = (category, detail, isFirst) => {
        const newCategorySection = categoryTemplate.cloneNode(true);
        const sectionHeader = $('.category-header')[0].cloneNode(true);
        const indicatorHeader = $('.sub-category-header')[0].cloneNode(true);

        $(newCategorySection).html('');
        $(newCategorySection).append(this.getSectionLink());
        $(newCategorySection).append(sectionHeader);
        $(newCategorySection).append(indicatorHeader);

        $(categoryTitleClass, newCategorySection).text(category);
        $(descriptionTextClass, newCategorySection).html(detail.description);

        if (detail.description === '') {
            $(descriptionClass, newCategorySection).addClass('hidden');
        } else {
            $(descriptionClass, newCategorySection).removeClass('hidden');
        }

        if (!isFirst) {
            $(newCategorySection).addClass('page-break-before');
        }

        this.loadSubcategories(newCategorySection, detail);

        this.uiElements.push(newCategorySection);

        profileWrapper.append(newCategorySection);
    }

    getSectionLink = () => {
        const sectionLink = $('.section-link')[0].cloneNode(true);
        $(sectionLink).attr('id', this.id);

        return sectionLink;
    }

    loadSubcategories = (wrapper, detail) => {
        let index = 0;
        for (const [subcategory, detail] of Object.entries(detail.subcategories)) {
            let isFirst = index === 0;
            let sc = new Subcategory(this, this.formattingConfig, wrapper, subcategory, detail, isFirst, this.geography, this.profileConfig);
            sc.isVisible = sc.indicators.length > 0;
            if (sc.isVisible) {
                this.subCategories.push(sc);
            }

            this.bubbleEvents(sc, [
                'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
                'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
                'point_tray.subindicator_filter.filter'
            ]);
            index++;
        }
    }
}
