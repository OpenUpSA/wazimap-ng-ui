import {Subcategory} from "./subcategory";

let categoryTemplate = null;
let profileWrapper = null;

const categoryClass = 'div.section';
const categoryTitleClass = '.section-header__text h2';

export class Category {
    constructor(category, detail, _profileWrapper, _id) {
        categoryTemplate = $(categoryClass)[0].cloneNode(true);
        profileWrapper = _profileWrapper;

        this.id = _id;

        this.setDomElements();
        this.addCategory(category, detail);
    }

    setDomElements = () => {
        //profileWrapper.find(categoryClass).remove();
    }

    addCategory = (category, detail) => {
        const newCategorySection = categoryTemplate.cloneNode(true);
        const sectionHeader = $('.section-header')[0].cloneNode(true);
        const indicatorHeader = $('.indicator-header')[0].cloneNode(true);

        $(newCategorySection).html('');
        $(newCategorySection).append(this.getSectionLink());
        $(newCategorySection).append(sectionHeader);
        $(newCategorySection).append(indicatorHeader);

        $(categoryTitleClass, newCategorySection).text(category);

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
            let isLast = index === lastIndex;
            let sc = new Subcategory(wrapper, subcategory, detail, isLast);
            index++;
        }
    }
}