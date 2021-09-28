import {Component} from "../utils";
import {FacilityController} from "./facilities/facility_controller";

let breadcrumbsContainer = null;
let breadcrumbTemplate = null;

let parents = null;

const FACILITY_DOWNLOADS = 'facility-downloads';

const breadcrumbClass = '.breadcrumb';
const locationDescriptionClass = '.location__description';

const downloadAllFacilities = '.location__facilities_download-all';

export class Profile_header extends Component {
    constructor(parent, _parents, geometries, _api, _profileId, _geography, _config) {
        super(parent);

        this.api = _api;
        this.profileId = _profileId;
        this.config = _config;
        this.isDownloadsDisabled = false;

        parents = _parents;
        this._geometries = geometries
        this.geography = _geography;

        breadcrumbsContainer = $('.location__breadcrumbs');
        breadcrumbTemplate = $('.styles').find(breadcrumbClass)[0];

        $('.rich-data__print').off('click').on('click', () => {
            window.print();
        });

        this.checkIfDownloadsDisabled();
        this.setPointSource();
        this.addBreadCrumbs();
        this.setLocationDescription();

        this.facilityController = new FacilityController(this);
        this.facilityController.getAndAddFacilities();
        $(downloadAllFacilities).off('click').on('click', () => this.facilityController.downloadAllFacilities());
    }

    get geometries() {
        return this._geometries;
    }

    checkIfDownloadsDisabled = () => {
        if ('richdata' in this.config && 'hide' in this.config['richdata']) {
            this.isDownloadsDisabled = this.config['richdata']['hide'].includes(FACILITY_DOWNLOADS);
        }
    }

    addBreadCrumbs = () => {
        let self = this;
        $(breadcrumbClass, breadcrumbsContainer).remove();

        if (parents !== null && parents.length > 0) {
            parents.forEach(parent => {
                let breadcrumb = breadcrumbTemplate.cloneNode(true);
                $(".truncate", breadcrumb).text(parent.name);
                $(breadcrumb).on('click', () => {
                    self.triggerEvent('profile.breadcrumbs.selected', parent);
                    $(breadcrumb).off("click")
                })

                breadcrumbsContainer.append(breadcrumb);
            })
            $(breadcrumbsContainer).removeClass('hidden');
        } else {
            $(breadcrumbsContainer).addClass('hidden');
        }
    }

    setPointSource = () => {
        //todo:change this when the API is ready
        $('.location__sources_loading').addClass('hidden');
        $('.location__sources').addClass('hidden');
        $('.location__sources_no-data').removeClass('hidden');
    }

    setLocationDescription = () => {
        if (parents !== null && parents.length > 0) {
            $(locationDescriptionClass).find('.location-type').text(this.geography.level);
            $(locationDescriptionClass).find('.parent-geography').text(parents[parents.length - 1].name);
            $(locationDescriptionClass).removeClass('hidden');
        } else {
            $(locationDescriptionClass).addClass('hidden');
        }
    }
}
