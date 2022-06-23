import {Component} from "../../../utils";


export class DescriptionInfoIcon extends Component {
    constructor(parent) {
        super(parent);

        this._tooltip = parent._tooltip;
        this._filterHeaderToggleContainer = parent._filterHeaderToggleContainer;
        this._container = parent._container;
        this.prepareDomElements();
    }

    getDescriptionIconHTML (){
      let html = "<div class='filters__header_info' title='Show Description'>";
      html += "<i class='fa fa-info-circle'></i>";
      html += "</div>";
      return html;
    }

    prepareDomElements() {
        const descriptionIconHTML = this.getDescriptionIconHTML();
        this._filterHeaderToggleContainer.before(descriptionIconHTML);
        this._descriptionInfoIconContainer = $(this._container).find(".filters__header_info");
        this._tooltip.enableTooltip(this._descriptionInfoIconContainer);
    }

    setDescriptionInfoIconVisibility(isVisible) {
      if (isVisible){
        $(this._descriptionInfoIconContainer).removeClass('hidden');
      } else {
        $(this._descriptionInfoIconContainer).addClass('hidden');
      }
    }
}
