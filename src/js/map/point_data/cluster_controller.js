import {Component, setPopupStyle} from '../../utils';

const POPUP_OFFSET = [20, 0];

export class ClusterController extends Component {
    constructor(parent, map, config) {
        super(parent);

        this.map = map;
        this.tooltipItem = $('.facility-tooltip.is--cluster')[0].cloneNode(true);
        this.config = config;
    }

    initClustering() {
        this.markers = L.markerClusterGroup({
            iconCreateFunction: (cluster) => this.createClusterIcon(cluster),
            clusterPane: 'clusters'
        }).on('clustermouseover', (e) => {
            this.showPopup(e.layer);
        });
    }

    isClusteringEnabled() {
        let enabled = false;
        let pmConfig = this.config.config.point_markers;

        if (pmConfig !== undefined && pmConfig.clustering !== undefined && pmConfig.clustering.enabled !== undefined) {
            enabled = pmConfig.clustering.enabled;
        }

        return enabled;
    }

    createClusterIcon(cluster) {
        const markerCount = cluster.getChildCount();
        let colors = this.groupChildrenMarkers(cluster, true);

        let circles = '';
        let total = 0;
        colors.forEach((c, i) => {
            const calc = (markerCount - total) / markerCount * 100;
            circles += `<circle
                            stroke-dasharray="${calc} 100"
                            r="16"
                            cx="16"
                            cy="16"
                            stroke="${c.color}"
                            fill="none"
                            stroke-width="35"></circle>`;
            total += c.count;
        })

        const html = `<svg
                        width="35px"
                        style="border-radius:50%; background:#3f51b5;"
                        viewBox="0 0 35 35">
                            ${circles}
                            <text
                                x="50%"
                                y="50%"
                                alignment-baseline="middle"
                                text-anchor="middle"
                                dominant-baseline="middle"
                                fill="#fff"
                                font-size="10px"
                                font-weight="bold"
                            >${markerCount}</text>
                        </svg>`;

        return L.divIcon({
            html: html,
            className: "leaflet-data-marker", iconSize: L.point(32, 32)
        });
    }

    groupChildrenMarkers(cluster, groupByTheme = true) {
        const markers = cluster.getAllChildMarkers();
        const markerCount = cluster.getChildCount();
        let children = [];
        for (let i = 0; i < markerCount; i++) {
            let m = markers[i];
            let color = m.options.color;
            let categoryName = m.options.categoryName;
            let existingObj;
            if (groupByTheme) {
                existingObj = children.filter((c) => {
                    return c.color === color;
                })[0];
            } else {
                //group by category
                existingObj = children.filter((c) => {
                    return c.categoryName === categoryName;
                })[0];
            }

            if (existingObj !== null && existingObj !== undefined) {
                existingObj.count += 1;
            } else {
                children.push({
                    color: color,
                    count: 1,
                    categoryName: m.options.categoryName
                })
            }
        }

        return children;
    }

    showPopup(cluster) {
        const latlng = cluster.getLatLng();
        const popupContent = this.createPopupContent(cluster);
        this.map.closePopup();
        let popup = L.popup({
            autoPan: false,
            autoClose: true,
            offset: POPUP_OFFSET,
            closeButton: false
        })

        popup
            .setLatLng(latlng)
            .setContent(popupContent)
            .openOn(this.map);

        setPopupStyle();
    }

    createPopupContent(cluster) {
        let item = this.tooltipItem.cloneNode(true);
        const clusterItemClass = '.tooltip__cluster-item';
        const clusterItem = $(clusterItemClass)[0].cloneNode(true);

        $(item).find('.tooltip__notch').remove();   //leafletjs already creates this

        $(item).find(clusterItemClass).remove();
        const groupedMarkers = this.groupChildrenMarkers(cluster, false);

        groupedMarkers.forEach((gm, index) => {
            let ci = clusterItem.cloneNode(true);
            $('.tooltip__cluster-title', ci).text(gm.categoryName);
            $('.tootlip__cluster-facet', ci).text(gm.count);
            $('.tooltip__cluster-icon', ci).css('background-color', gm.color);

            if (index === groupedMarkers.length - 1) {
                $(ci).addClass('is--last');
            }

            $('.facility-tooltip__cluster', item).append(ci);
        })

        return item;
    }
}
