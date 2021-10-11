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
    }

    get api() {
        return this.parent.api;
    }

    get state() {
        return this.parent.state;
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
        //todo: make this a promise
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

    reInit(areaCode) {
        this.areaCode = areaCode;
        this._allVersionsBundle = null;
        this._versionGeometries = {};
        this._versionBundles = {};
    }

    loadAllVersions() {
        let self = this;
        self.versions = self.getVersions();
        if (self._activeVersion !== null) {
            this.setActiveVersionByName(self._activeVersion.model.name);
        } else {
            self._activeVersion = self.versions.filter((v) => {
                return v.model.isDefault
            })[0];
        }

        self.versions.forEach((version, index) => {
            const isLast = index === self.versions.length - 1;
            self.getAllDetails(version, isLast);
        })
    }

    getVersions() {
        //todo:get versions from the profile_by_url endpoint
        const versions = [
            new Version('2016 with wards', false),
            new Version('2011 Boundaries', true)];

        return versions;
    }

    getAllDetails(version, isLast) {
        this.api.getProfile(28/*this.profileId*/, this.areaCode, version.model.name).then(js => {
            if (version.model.isActive) {
                this.setUpMainVersion(js);
            }

            this.appendAllBundles(js, version);

            if (isLast) {
                //populate rich data, data mapper..
                this.parent.triggerEvent(VersionController.EVENTS.ready, this.allVersionsBundle);
            }
        })
    }

    setUpMainVersion(rawData) {
        const dataBundle = new DataBundle(rawData);
        this.state.profile = dataBundle;

        this.parent.triggerEvent(VersionController.EVENTS.profileLoaded, dataBundle);

        setTimeout(() => {
            if (this.callRegisterFunction) {
                Webflow.require('ix2').init();
            }
        }, 600)
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
                for (const [indicator, indicatorDetail] of Object.entries(subcategoryDetail.indicators)) {
                    indicatorDetail.version_data = version;
                }
            }
        }
    }

    appendProfileData(dataBundle, version) {
        for (const [category, categoryDetail] of Object.entries(dataBundle.profile.profileData)) {
            let allVersionsBundleCategory = this.allVersionsBundle.profile.profileData[category];
            if (allVersionsBundleCategory === undefined || $.isEmptyObject(allVersionsBundleCategory)) {
                this.allVersionsBundle.profile.profileData[category] = categoryDetail;
            }

            for (const [subcategory, subcategoryDetail] of Object.entries(categoryDetail.subcategories)) {
                let allVersionsBundleSubcategory = this.allVersionsBundle.profile.profileData[category].subcategories[subcategory];
                if (allVersionsBundleSubcategory === undefined || $.isEmptyObject(allVersionsBundleSubcategory)) {
                    this.allVersionsBundle.profile.profileData[category].subcategories[subcategory] = subcategoryDetail;
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