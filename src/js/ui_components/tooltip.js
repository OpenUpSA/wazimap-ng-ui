import {Component} from "../utils";


export class Tooltip extends Component {

    enableTooltip(element, content = undefined, myPosition = 'center bottom-20', atPosition = 'center top') {

      if (element !== undefined){
        element.attr("title", content)
      }

      element.tooltip({
        position: {
          my: myPosition,
          at: atPosition,
          using: function( position, feedback ) {
            $( this ).css( position );
            $( "<div>" )
              .addClass( "arrow" )
              .addClass( feedback.vertical )
              .addClass( feedback.horizontal )
              .appendTo( this );
          }
        },
      })
    }
}
