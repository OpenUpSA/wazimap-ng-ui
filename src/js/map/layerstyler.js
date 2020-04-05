const defaultStyles = {
    hoverOnly: {
        over: {
            fillColor: "#3BAD84",
        },
        out: {
            fillColor: "#ffffff",
            stroke: false,
        }
    },
    selected: {
        over: {
            color: "#666666",
            fillColor: "#3BAD84",
            opacity: 1,
        },
        out: {
            color: "#666666",
            fillColor: "#cccccc",

            opacity: 0.5,
            fillOpacity: 0.5,

            weight: 1,
        }
    }
}

export class LayerStyler {
    constructor(styles) {
        this.styles = styles || defaultStyles;
    }

    setLayerStyle(layer, styles) {
        let layers = null;

        if (layer._layers != undefined)
            layers = Object.values(layer._layers)
        else
            layers = [layer];

        // layer.resetStyle(layer);
        layers.forEach(layer => {
            layer.setStyle(styles.out);

            layer
                .off("mouseover mouseout")
                .on("mouseover", el => {
                    layer.setStyle(styles.over);
                })
                .on("mouseout", el => {
                    layer.setStyle(styles.out);
                })
        })
    };

    setLayerToHoverOnly(layer) {
        this.setLayerStyle(layer, this.styles.hoverOnly);
    };

    setLayerToSelected(layer) {
        this.setLayerStyle(layer, this.styles.selected);
    };
}
