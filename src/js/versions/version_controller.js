import {Component} from "../utils";
import {ChildrenIndicator, ChildrenIndicators, DataBundle} from "../dataobjects";
import {Version} from "./version";
import {loadMenu} from "../elements/menu";

export class VersionController extends Component {
    static EVENTS = {
        updated: 'version.active.updated',
        ready: 'versions.all.loaded',
        profileLoaded: 'profile.loaded',
        indicatorsReady: 'versions.indicators.ready'
    }

    constructor(parent, areaCode, callRegisterFunction) {
        super(parent);

        this.areaCode = areaCode;
        this.callRegisterFunction = callRegisterFunction;

        this._versions = [];
        this._allVersionsBundle = null;
        this._allVersionsIndicatorData = null;
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

    get allVersionsIndicatorData() {
        return this._allVersionsIndicatorData;
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
        this.parent.on('hashChange', (payload) => {
            this.getChildrenIndicators(payload);
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

    getChildrenIndicators(payload) {
        const profileId = payload.state.profileId;
        const areaCode = payload.payload.areaCode;
        let indicatorPromises = [];

        this.versions.forEach((version, index) => {
            const promise = this.api.getChildrenIndicators(profileId, areaCode, version.model.name)
                .then((data) => {
                    const childrenIndicators = new ChildrenIndicators(data);

                    this.setVersionData(childrenIndicators.data, version);
                    if (this._allVersionsIndicatorData === null) {
                        this._allVersionsIndicatorData = childrenIndicators.data;
                    } else {
                        this.appendProfileData(childrenIndicators.data, version, this.allVersionsIndicatorData);
                    }
                })

            indicatorPromises.push(promise);
        })

        Promise.all(indicatorPromises).then(() => {
            this.parent.triggerEvent(VersionController.EVENTS.indicatorsReady, this.allVersionsIndicatorData);
        });
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

        this.setVersionData(dataBundle.profile.profileData, version);
        if (this._allVersionsBundle === null) {
            this._allVersionsBundle = dataBundle;
        } else {
            this.appendProfileData(dataBundle.profile.profileData, version, this.allVersionsBundle.profile.profileData);
        }
    }

    setVersionData(dataBundle, version) {
        for (const [category, categoryDetail] of Object.entries(dataBundle)) {
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

    appendProfileData(dataBundle, version, appendObj) {
        for (const [category, categoryDetail] of Object.entries(dataBundle)) {
            let allVersionsBundleCategory = appendObj[category];
            if (allVersionsBundleCategory === undefined || $.isEmptyObject(allVersionsBundleCategory)) {
                appendObj[category] = categoryDetail;
            }

            for (const [subcategory, subcategoryDetail] of Object.entries(categoryDetail.subcategories)) {
                let allVersionsBundleSubcategory = appendObj[category].subcategories[subcategory];
                if (allVersionsBundleSubcategory === undefined || $.isEmptyObject(allVersionsBundleSubcategory)) {
                    appendObj[category].subcategories[subcategory] = subcategoryDetail;
                } else {
                    subcategoryDetail.key_metrics.forEach((km) => {
                        km.version_data = version;
                    })
                    allVersionsBundleSubcategory.key_metrics = allVersionsBundleSubcategory.key_metrics.concat(subcategoryDetail.key_metrics);
                }

                for (const [indicator, indicatorDetail] of Object.entries(subcategoryDetail.indicators)) {
                    let allVersionsBundleIndicator = appendObj[category].subcategories[subcategory].indicators[indicator];
                    if (allVersionsBundleIndicator === undefined || $.isEmptyObject(allVersionsBundleIndicator) || version.model.isActive) {
                        appendObj[category].subcategories[subcategory].indicators[indicator] = indicatorDetail;
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
