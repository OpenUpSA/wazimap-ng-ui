import {Component, setPopupStyle} from '../../utils';

const POPUP_OFFSET = [20, 0];

export class Cluster extends Component {
    constructor(parent, map) {
        super(parent);

        this.map = map;
        this.initClustering();
    }

    initClustering() {
        this.markers = L.markerClusterGroup({
            iconCreateFunction: (cluster) => this.createClusterIcon(cluster)
        }).on('clustermouseover', (e) => {
            this.showPopup(e.layer);
        });
    }

    isClusteringEnabled() {
        //todo:get this from config when the BE is ready
        return true;
    }

    createClusterIcon(cluster) {
        const markers = cluster.getAllChildMarkers();
        const markerCount = cluster.getChildCount();
        let colors = [];
        for (let i = 0; i < markerCount; i++) {
            let m = markers[i];
            let color = m.options.color;
            let existingObj = colors.filter((c) => {
                return c.color === color;
            })[0];

            if (existingObj !== null && existingObj !== undefined) {
                existingObj.count += 1;
            } else {
                colors.push({
                    color: color,
                    count: 1
                })
            }
        }

        let circles = '';
        let total = 0;
        colors.forEach((c, i) => {
            const calc = (markerCount - total) / markerCount * 100;
            circles += `<circle stroke-dasharray="${calc} 100" style="stroke: ${c.color}"></circle>`;
            total += c.count;
        })


        const html = `<svg class="marker-svg" viewBox="0 0 32 32">
                            ${circles}
                            <text x="25%" y="-50%" alignment-baseline="middle" fill="#fff">${markers.length}</text>
                        </svg>`;

        return L.divIcon({
            html: html,
            className: "leaflet-data-marker", iconSize: L.point(32, 32)
        });
    }

    showPopup(cluster) {
        const latlng = cluster.getLatLng();
        this.map.closePopup();
        let popup = L.popup({
            autoPan: false,
            autoClose: true,
            offset: POPUP_OFFSET,
            closeButton: false
        })

        popup
            .setLatLng(latlng)
            .setContent('popupContent')
            .openOn(this.map);

        setPopupStyle('facility-tooltip');
    }
}