import {Subcategory} from "./subcategory";
import {Observable} from "../utils";


let categoryTemplate = null;
let profileWrapper = null;
let removePrevCategories = false;

const categoryClass = 'div.section';
const categoryTitleClass = '.category-header__text h2';
const descriptionTextClass = '.category-header__description p';
const descriptionClass = '.category-header__description';

//category > subcategory > indicator > chart

export class Category extends Observable{
    constructor(category, detail, _profileWrapper, _id, _removePrevCategories) {
        super();

        categoryTemplate = $(categoryClass)[0].cloneNode(true);
        profileWrapper = _profileWrapper;
        removePrevCategories = _removePrevCategories;

        this.id = _id;

        this.prepareDomElements();
        this.addCategory(category, detail);
    }

    prepareDomElements = () => {
        if (removePrevCategories) {
            profileWrapper.find(categoryClass).remove();
        }
    }

    addCategory = (category, detail) => {
        const newCategorySection = categoryTemplate.cloneNode(true);
        const sectionHeader = $('.category-header')[0].cloneNode(true);
        const indicatorHeader = $('.sub-category-header')[0].cloneNode(true);

        $(newCategorySection).html('');
        $(newCategorySection).append(this.getSectionLink());
        $(newCategorySection).append(sectionHeader);
        $(newCategorySection).append(indicatorHeader);

        $(categoryTitleClass, newCategorySection).text(category);
        $(descriptionTextClass, newCategorySection).text(detail.description);

        if (detail.description === '') {
            $(descriptionClass, newCategorySection).addClass('hidden');
        }

        this.loadSubcategories(newCategorySection, detail);

        profileWrapper.append(newCategorySection);
    }

    getSectionLink = () => {
        const sectionLink = $('.section-link')[0].cloneNode(true);
        $(sectionLink).attr('id', this.id);

        return sectionLink;
    }

    loadSubcategories = (wrapper, detail) => {
        let index = 0;
        let lastIndex = Object.entries(detail.subcategories).length - 1;
        for (const [subcategory, detail] of Object.entries(detail.subcategories)) {
        let isFirst = index === 0;
            let sc = new Subcategory(wrapper, subcategory, detail, isFirst);
            this.bubbleEvents(sc, [
                'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
                'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml'
            ]);
            index++;
        }
    }
}