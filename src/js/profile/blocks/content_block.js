import {Component} from '../../utils';
import {isNull} from '../../utils';

const sourceClass = '.data-source';
const indicatorTitleClass = '.profile-indicator__title h4';
const chartDescClass = '.profile-indicator__chart_description p';
const chartFooterClass = '.profile-indicator__chart_footer';

export class ContentBlock extends Component {
    static BLOCK_TYPES = {Indicator: 'indicator', HTMLBlock: 'html'};

    constructor(parent, container, indicator, title, isLast, geography, hiddenIndicators) {
        super(parent);

        this._container = container;
        this._indicator = indicator;
        this._title = title;
        this._isLast = isLast;
        this._geography = geography;
        this._activeVersion = null;

        this.prepareEvents();
        this._isVisible = !hiddenIndicators.includes(indicator.id);
        if (!this._isVisible){
          $(this.container).hide();
        }
    }

    prepareEvents() {
        this.parent.on('version.updated', (activeVersion) => {
            this._activeVersion = activeVersion;
            this.createVersionData();
        });
    }

    get isVisible(){
      return this._isVisible;
    }

    set isVisible(value){
      if (!value){
        $(this.container).hide();
      } else {
        $(this.container).show();
      }
      this._isVisible = value;
      this.parent.updateVisibility();
    }

    get container() {
        return this._container;
    }

    get indicator() {
        return this._indicator;
    }

    get title() {
        return this._title;
    }

    get isLast() {
        return this._isLast;
    }

    get metadata() {
        return this.indicator.metadata;
    }

    get description() {
        return this.indicator.description;
    }

    get geography() {
        return this._geography;
    }

    get activeVersion() {
        return this._activeVersion;
    }

    createMetaData() {
        const isLink = !isNull(this.metadata.url);
        if (isLink) {
            let ele = $('<a></a>');
            $(ele).text(this.metadata.source);
            $(ele).attr('href', this.metadata.url);
            $(ele).attr('target', '_blank');
            $(sourceClass, this.container).html(ele);
        } else
            $(sourceClass, this.container).text(this.metadata.source);
    }

    createTitle() {
        $(indicatorTitleClass, this.container).text(this.title);
    }

    createDescription() {
        $(chartDescClass, this.container).html(this.description);
    }

    createVersionData() {
        $('.profile-indicator__version', this.container).remove();

        if (this.indicator.version_data.model.isActive || this.activeVersion === null) {
            return;
        }

        let ele = document.createElement('p');
        $(ele).addClass('profile-indicator__version');
        $(ele).html(`This indicator applies to
        <a href="#">
            <span class="version-link is--location no-link">${this.geography.name}</span>
        </a> in the
        <a href="#">
            <span class="version-link is--version no-link">${this.indicator.version_data.model.name}</span>
        </a>. The map currently shows the
        <a href="#">
            <span class="version-link is--current no-link">${this.activeVersion.model.name}</span>
        </a>.`);

        $(ele).find('a').css('text-decoration', 'none');
        $(ele).insertBefore($(chartFooterClass, this.container))
    }

    prepareDomElements() {
        this.createTitle();
        this.createMetaData();
        this.createDescription();
        this.createVersionData();

        if (!this.isLast) {
            $(this.container).removeClass('last');
        }

    }
}
