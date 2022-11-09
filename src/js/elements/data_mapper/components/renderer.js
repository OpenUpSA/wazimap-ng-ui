import React from 'react';
import {createRoot} from 'react-dom/client';
import {Component} from "../../../utils";
import RichDataPanelLink from './richDataPanelLink';
import {isEmpty, some} from 'lodash';

const richDataPanelLinkClsName = 'data-mapper-content__rich-data-panel-link';
const dataMapperContentClsName = 'data-mapper-content';
const dataMapperContentListClsName = 'data-mapper-content__list';


export class RichDataLinkRendrer extends Component {

    constructor(parent) {
        super(parent);
        this._container = this.createRootContainer();
        this.root = createRoot(this._container);
        this._showLink = false;
    }

    get showLink(){
      return this._showLink;
    }

    set showLink(payload){
      if (!isEmpty(payload)) {
        let hasFacility = this.hasFacilities(payload.payload);
        let hasIndicator = this.hasIndicators(payload.state.profile.profile?.profileData || []);
        this._showLink = hasFacility || hasIndicator;
      } else {
        this._showLink = false;
      }
    }

    hasFacilities(facilities){
      return some( facilities, function( el ) {
        return el.subthemes.length > 0;
      })
    }

    hasIndicators(profileData){
      return some( profileData, function( data ) {
        return some(data.subcategories, function(el){
          return !isEmpty(el.indicators);
        })
      })
    }

    hideLink(){
      this._showLink = false;
      this.render();
    }

    createRootContainer() {
        $(`.${richDataPanelLinkClsName}`).remove();
        this._container = document.createElement('div');
        this._container.setAttribute("class", richDataPanelLinkClsName);
        $(this._container).insertAfter(`.${dataMapperContentClsName} .${dataMapperContentListClsName}`);
        return this._container
    }

    render() {
        if (this.showLink){
          this.root.render(<RichDataPanelLink parent={this}/>);
        } else {
          this.root.render(<div></div>);
        }
    }
}
