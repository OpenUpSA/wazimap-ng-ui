import {Component} from "../utils";

export class Text extends Component {
    constructor(
        parent,
        data,
    ) {
        super(parent);
        this._data = data;

        this.addRawHtml(this._data);
    }

    get html() {
        return this._data;
    }

    addRawHtml = (data) => {
        $(".bar-chart").remove();
        $(".profile-indicator__filters-wrapper").remove();
        
        $(".indicator__chart").append("<p>placeholder</p>");
    };
}
