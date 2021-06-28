import { Component } from '../../utils';

export class ContentBlock extends Component {
    static BLOCK_TYPES = {Indicator: 'indicator', HTMLBlock: 'html_block'};

    constructor(parent, title, isLast) {
        super(parent);
        self._title = title;
        self._isLast = isLast;
    }

    get title() {
        return self._title;
    }

    get isLast() {
        return self._isLast;
    }
}
