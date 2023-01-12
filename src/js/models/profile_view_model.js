import {Observable} from "../utils";
import {isEmpty} from "lodash";


export class ProfileViewModel extends Observable {

    constructor(controller, viewData, isDefault=false, isSelected=false, setDefaultData=false) {
        super()
        if (isEmpty(viewData) && setDefaultData){
          viewData = {
            "name": "Default View",
            "description": "Default Description"
          }
        }
        this.controller = controller;
        this._defaultConfig = viewData;
        this._updatedConfig = viewData;
        this._isSelected = isSelected;
        this._isDefault = isDefault || viewData.is_default;
    }

    get defaultConfig() {
        return this._defaultConfig;
    }

    get config() {
      return this._updatedConfig;
    }

    get name() {
      return this._updatedConfig.name;
    }

    get description() {
      return this._updatedConfig.description;
    }

    get filters() {
      return this._updatedConfig.filters;
    }

    get isSelected() {
        return this._isSelected;
    }

    set isSelected(value) {
        this._isSelected = value;
    }

    selectView() {
        console.log("In HRE -->>>");
        let profileViews = this.controller.profileViews;
        profileViews.map(view => view.isSelected = false);
        this.isSelected = true;
        this.controller.triggerEvent('my_view.filteredIndicators.updated', []);
    }
}
