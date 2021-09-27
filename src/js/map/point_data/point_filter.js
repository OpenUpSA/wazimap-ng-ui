import {Component} from "../../utils";
import {FilterController} from "./filter_controller";
import {DataFilterModel} from "../../models/data_filter_model";

export class PointFilter extends Component {
    constructor(parent) {
        super(parent);

        this._isVisible = false;

        this.prepareEvents();
    }

    prepareEvents() {
        $('.point-filters__header-close').on('click', () => this.isVisible = false);
    }

    get isVisible() {
        return this._isVisible;
    }

    get groups() {
        return [{
            name: 'test 1',
            subindicators: ['aa', 'bb']
        }, {
            name: 'test 2',
            subindicators: ['cc', 'dd']
        }]
    }

    set isVisible(value) {
        if (!this.isVisible && value) {
            this._filterController = new FilterController(this);
            let dataFilterModel = new DataFilterModel(this.groups, {}, null, '', [], DataFilterModel.FILTER_TYPE.points);
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
}