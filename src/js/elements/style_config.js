export class StyleConfig {
    constructor(styleConfig) {
        this.styleConfig = styleConfig;
    }

    insertStyleRules = () => {
        if (typeof this.styleConfig === 'undefined') {
            return;
        }

        let style = document.createElement('style');
        document.head.appendChild(style);
        let styleSheet = style.sheet;

        for (const [className, props] of Object.entries(this.styleConfig)) {
            for (let i = 0; i < props.length; i++) {
                styleSheet.insertRule(`.${className}{ ${props[i].key}: ${props[i].value} }`, i);
            }
        }
    }
}