import {Component} from "../../utils";
import {FilterController} from "./filter_controller";
import {DataFilterModel} from "../../models/data_filter_model";

export class PointFilter extends Component {
    constructor(parent) {
        super(parent);

        this._isVisible = false;
        this._activePoints = [];
        this._filterCallback = null;
        this._filterController = null;

        this.prepareEvents();
        this.prepareDomElements();
    }

    get filterCallback() {
        return this._filterCallback;
    }

    set filterCallback(value) {
        this._filterCallback = value;
    }

    get activePoints() {
        return this._activePoints;
    }

    set activePoints(value) {
        this._activePoints = value;
        if (this._filterController !== null) {
            let dataFilterModel = new DataFilterModel(this.groups, {}, null, '', this.activePoints, DataFilterModel.FILTER_TYPE.points);
            this._filterController.updateDataFilterModel(dataFilterModel);
        }
    }

    get isVisible() {
        return this._isVisible;
    }

    get groups() {
        let groups = [];
        this.activePoints.forEach((ap) => {
            const filterableFields = ap.category.filterableFields;
            ap.point.data.forEach((d) => {
                if (groups.filter(g => g.name === d.key).length <= 0) {
                    if (filterableFields.indexOf(d.key) >= 0) {
                        groups.push({
                            name: d.key,
                            values: [d.value]
                        });
                    }
                } else {
                    let group = groups.filter(g => g.name === d.key)[0];
                    if (group.values.filter(v => v === d.value).length <= 0) {
                        group.values.push(d.value);
                    }
                }
            })
        })

        return groups
    }

    set isVisible(value) {
        if (!this.isVisible && value) {
            this._filterController = new FilterController(this);
            let dataFilterModel = new DataFilterModel(this.groups, {}, null, '', this.activePoints, DataFilterModel.FILTER_TYPE.points);
            if (this._filterController.filterCallback === null) {
                this._filterController.filterCallback = this.filterCallback;
            }
            this._filterController.setDataFilterModel(dataFilterModel);

            $('.point-filters').removeClass('hidden');
        } else if (!value) {
            $('.point-filters').addClass('hidden');
        }
        this._isVisible = value;
    }

    get filterController() {
        return this._filterController;
    }

    prepareEvents() {
        $('.point-filters__header-close').on('click', () => this.isVisible = false);
    }

    prepareDomElements() {
        this.setTitleElement();
        this.setCloseButton();
    }

    setTitleElement() {
        let titleEle = document.createElement('div');
        $(titleEle).attr('data-i18n', 'Point Filter');
        $(titleEle).addClass('i18n');

        $('.filters__header_name .truncate').html(titleEle);
    }

    setCloseButton() {
        $('.point-filters__header-close').on('click', () => {
            this.parent.unSelectAllCategories();
        })
    }
}