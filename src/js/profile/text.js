import {Component} from "../utils";

export class Text extends Component {
    constructor(
        parent,
        data,
    ) {
        super(parent);
        this.data = data;
        
        this.addRawText(data);
    }

    addRawText = (data) => {
        $(".bar-chart", this.container).remove();
        $(".profile-indicator__filters-wrapper", this.container).remove();
        
        // Display data
    };
}
