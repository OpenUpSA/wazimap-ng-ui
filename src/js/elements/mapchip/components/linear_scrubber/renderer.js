import React from 'react';
import { createRoot } from 'react-dom/client';
import Scrubber from './scrubber';
import {Component} from "../../../../utils";
import {Tooltip} from "../../../../ui_components/tooltip";

export class LinearScrubberRenderer extends Component {
    constructor(parent, container) {
        super(parent);
        this.root = createRoot(container);
        this.changeSubindicator = parent.changeSubindicator;
        this.tooltip = new Tooltip();
    }

    render(props){

      if (props.enableLinearScrubber){
        this.root.render(
          <Scrubber
            primaryGroup={props.primaryGroup}
            groups={props.groups}
            indicatorTitle={props.indicatorTitle}
            selectedSubindicator={props.selectedSubindicator}
            onSubIndicatorChange={this.changeSubindicator}
            tooltip={this.tooltip}
          />
        );
      } else {
        this.root.render(<div></div>);
      }

    }
}
