import {Component} from "../utils";

const chartContainerClass = ".indicator__chart";

export class Text extends Component {
    constructor(
        parent,
        data,
    ) {
        super(parent);
        this._data = data;

        const chartContainer = $(chartContainerClass);
        this.container = chartContainer[0];
        this.containerParent = $(this.container).closest('.profile-indicator');

        this.addRawHtml(this._data);
    }

    get html() {
        return this._data;
    }

    addRawHtml = (data) => {
        $(".bar-chart").remove();
        $(".profile-indicator__filters-wrapper").remove();

        this.containerParent.find('.indicator__chart').remove();

        this.rawHtml = document.createElement('div');
        $(this.rawHtml).addClass('profile-indicator__html');
        $(this.rawHtml).append(data.html);

        this.containerParent.append(this.rawHtml);
    };
}
