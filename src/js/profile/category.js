import {Subcategory} from "./subcategory";

let categoryTemplate = null;
let profileHeader = null;
let indicatorTemplate = null;
let tooltipClone = null;

const categoryHeaderTitleClass = '.data-category__header h2';
const categoryHeaderDescriptionClass = '.data-category__header_description p';
const subcategoryClass = '.data-category__indicator';

export class Category {
    constructor(category, detail, _categoryTemplate, _profileHeader, _indicatorTemplate, _tooltipClone) {
        categoryTemplate = _categoryTemplate;
        profileHeader = _profileHeader;
        indicatorTemplate = _indicatorTemplate;
        tooltipClone = _tooltipClone;

        this.setDomElements();
        this.addCategory(category, detail);
    }

    setDomElements = () => {
        $(subcategoryClass, categoryTemplate).remove();
    }

    addCategory = (category, detail) => {
        const newCategorySection = categoryTemplate.cloneNode(true);
        const wrapper = newCategorySection;

        $(categoryHeaderTitleClass, newCategorySection).text(category);
        $(categoryHeaderDescriptionClass, newCategorySection).text(detail.description);

        profileHeader.append(newCategorySection);
        this.loadSubcategories(wrapper, detail);
    }

    loadSubcategories = (wrapper, detail) => {
        for (const [subcategory, detail] of Object.entries(detail.subcategories)) {
            let sc = new Subcategory(wrapper, subcategory, detail, indicatorTemplate, tooltipClone);
        }
    }
}