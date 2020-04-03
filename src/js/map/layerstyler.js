const defaultStyles = {
    hoverOnly: {
        over: {
            fillColor: "green",
        },
        out: {
            fillColor: "#ffffff",
            stroke: false,
        }
    },
    selected: {
        over: {
            color: "green",
            opacity: 1,
        },
        out: {
            color: "#999999",
            opacity: 1,
            weight: 1
        }
    }
}

export class LayerStyler {
    constructor(styles) {
        this.styles = styles || defaultStyles;
    }

    setLayerStyle(layer, styles) {
        layer.resetStyle(layer);
        layer.eachLayer((feature) => {
            feature.setStyle(styles.out);

            feature
                .off("mouseover mouseout")
                .on("mouseover", (el) => {
                    feature.setStyle(styles.over);
                })
                .on("mouseout", (el) => {
                    feature.setStyle(styles.out);
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
