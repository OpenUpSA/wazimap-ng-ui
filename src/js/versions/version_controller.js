import {Component} from "../utils";
import {DataBundle} from "../dataobjects";
import {Version} from "./version";

export class VersionController extends Component {
    static EVENTS = {
        updated: 'version.active.updated',
        ready: 'versions.all.loaded',
        profileLoaded: 'profile.loaded'
    }

    constructor(parent, areaCode, callRegisterFunction) {
        super(parent);

        this.areaCode = areaCode;
        this.callRegisterFunction = callRegisterFunction;

        this._versions = [];
        this._allVersionsBundle = null;
        this._versionGeometries = {};
        this._versionBundles = {};
        this._activeVersion = null;
        this._promises = [];
        this._initEvents = {
            'versions.all.loaded': false,
            'point_tray.tray.themes_loaded': false
        };

        this.prepareEvents();
    }

    get api() {
        return this.parent.api;
    }

    get state() {
        return this.parent.state;
    }

    get profileId() {
        return this.parent.profileId;
    }

    get allVersionsBundle() {
        return this._allVersionsBundle;
    }

    get versions() {
        return this._versions;
    }

    set versions(value) {
        this._versions = value;
    }

    set activeVersion(version) {
        if (!version.model.isActive) {
            this.versions.forEach((v) => {
                v.model.isActive = false;
            })

            version.model.isActive = true;

            this._activeVersion = version;

            const payload = {
                profile: this.parent.state.profile.profile,
                geometries: this.versionGeometries[version.model.name]
            }

            if (payload.geometries !== undefined) {
                //while navigating to another geo, versionGeometries is empty
                this.parent.triggerEvent(VersionController.EVENTS.updated, payload);
            }
        }
    }

    get activeVersion() {
        return this._activeVersion;
    }

    get versionGeometries() {
        return this._versionGeometries;
    }

    get versionBundles() {
        return this._versionBundles;
    }

    get initEvents() {
        return this._initEvents;
    }

    prepareEvents() {
        this.parent.on('versions.all.loaded', () => {
            this._initEvents['versions.all.loaded'] = true;
            this.checkAndInitWebflow();
        })
        this.parent.on('point_tray.tray.themes_loaded', () => {
            this._initEvents['point_tray.tray.themes_loaded'] = true;
            this.checkAndInitWebflow();
        })
    }

    checkAndInitWebflow() {
        let allTriggered = true;
        for (const key in this.initEvents) {
            if (!this.initEvents[key]) {
                allTriggered = false;
            }
        }

        if (allTriggered) {
            Webflow.require('ix2').init();
        }
    }

    reInit(areaCode) {
        this.areaCode = areaCode;
        this._allVersionsBundle = null;
        this._versionGeometries = {};
        this._versionBundles = {};
    }

    loadAllVersions(versions) {
        let self = this;
        self.versions = versions;
        if (self._activeVersion !== null) {
            this.setActiveVersionByName(self._activeVersion.model.name);
        } else {
            self._activeVersion = self.versions.filter((v) => {
                return v.model.isDefault
            })[0];
        }

        self.versions.forEach((version) => {
            self.getAllDetails(version);
        })

        Promise.all(this._promises).then(() => {
            //populate rich data, data mapper..
            this._promises = [];
            this.parent.triggerEvent(VersionController.EVENTS.ready, this.allVersionsBundle);
        });
    }

    getAllDetails(version) {
        const promise = this.api.getProfile(this.profileId, this.areaCode, version.model.name).then(js => {
            version.exists = true;
            if (version.model.isActive) {
                this.setUpMainVersion(js);
            }

            this.appendAllBundles(js, version);
        }).catch((response) => {
            if (response.status === 404) {
                //version does not exist for this geo
                version.exists = false;
            } else {
                throw(response);
            }
        })

        this._promises.push(promise);
    }

    setUpMainVersion(rawData) {
        const dataBundle = new DataBundle(rawData);
        this.state.profile = dataBundle;

        this.parent.triggerEvent(VersionController.EVENTS.profileLoaded, dataBundle);

        document.title = dataBundle.overview.name;
    }

    appendAllBundles(rawData, version) {
        let dataBundle = new DataBundle(rawData);

        this.addVersionGeometry(version, dataBundle.geometries);
        this.addVersionBundle(version, dataBundle);

        this.setVersionData(dataBundle, version);
        if (this._allVersionsBundle === null) {
            this._allVersionsBundle = dataBundle;
        } else {
            this.appendProfileData(dataBundle, version);
        }
    }

    setVersionData(dataBundle, version) {
        for (const [category, categoryDetail] of Object.entries(dataBundle.profile.profileData)) {
            for (const [subcategory, subcategoryDetail] of Object.entries(categoryDetail.subcategories)) {
                subcategoryDetail.version_data = version;
                subcategoryDetail.key_metrics.forEach((km) => {
                    //if version_data is not undefined, it means it has already been set in appendProfileData
                    if (km.version_data === undefined) {
                        km.version_data = version;
                    }
                })
                for (const [indicator, indicatorDetail] of Object.entries(subcategoryDetail.indicators)) {
                    indicatorDetail.version_data = version;
                }
            }
        }
    }

    appendProfileData(dataBundle, version) {
        for (const [category, categoryDetail] of Object.entries(dataBundle.profile.profileData)) {
            let categoryAdded = false;
            let allVersionsBundleCategory = this.allVersionsBundle.profile.profileData[category];
            if (allVersionsBundleCategory === undefined || $.isEmptyObject(allVersionsBundleCategory)) {
                categoryAdded = true;
                this.allVersionsBundle.profile.profileData[category] = categoryDetail;
            }

            for (const [subcategory, subcategoryDetail] of Object.entries(categoryDetail.subcategories)) {
                let allVersionsBundleSubcategory = this.allVersionsBundle.profile.profileData[category].subcategories[subcategory];
                if (allVersionsBundleSubcategory === undefined || $.isEmptyObject(allVersionsBundleSubcategory)) {
                    this.allVersionsBundle.profile.profileData[category].subcategories[subcategory] = subcategoryDetail;
                } else {
                    if (!categoryAdded) {
                        //key metrics are already added when category is added into allVersionsBundleCategory
                        subcategoryDetail.key_metrics.forEach((km) => {
                            km.version_data = version;
                        })
                        allVersionsBundleSubcategory.key_metrics = allVersionsBundleSubcategory.key_metrics.concat(subcategoryDetail.key_metrics);
                    }
                }

                for (const [indicator, indicatorDetail] of Object.entries(subcategoryDetail.indicators)) {
                    let allVersionsBundleIndicator = this.allVersionsBundle.profile.profileData[category].subcategories[subcategory].indicators[indicator];
                    if (allVersionsBundleIndicator === undefined || $.isEmptyObject(allVersionsBundleIndicator) || version.model.isActive) {
                        this.allVersionsBundle.profile.profileData[category].subcategories[subcategory].indicators[indicator] = indicatorDetail;
                    }
                }
            }
        }
    }

    addVersionGeometry(version, geometries) {
        this._versionGeometries[version.model.name] = geometries;
    }

    addVersionBundle(version, dataBundle) {
        this._versionBundles[version.model.name] = dataBundle;
    }

    setActiveVersionByName(versionName) {
        let version = this.versions.filter((v) => {
            return v.model.name === versionName
        })[0];

        if (version === null || version === undefined) {
            console.error(`Version does not exist : ${versionName}`)
        } else {
            this.activeVersion = version;
        }
    }
}
