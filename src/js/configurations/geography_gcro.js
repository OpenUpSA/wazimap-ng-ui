// TODO temporary until we decide how to deal with configuration
export const geography_config = {
    rootGeography: 'GT',
    preferredChildren: {
        country: ['province'],
        province: ['district', 'municipality'],
        district: ['municipality'],
        municipality: ['mainplace', 'planning_region'],
        mainplace: ['subplace']
    },
    geoViewTypes: {
        mainplace: ['mainplace', 'subplace'],
        ward: ['ward']
    },
    geographyLevels: {
        country: 'Country',
        province: 'Province',
        district: 'District',
        municipality: 'Municipality',
        mainplace: 'Mainplace',
        subplace: 'Subplace',
        ward: 'Ward'
    },
    individualMarkerLevels: ['mainplace', 'subplace', 'ward'],
    map: {
        defaultCoordinates: {'lat': -26.0123951, 'long': 27.0061074, 'zoom': 10},
        tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoomControlEnabled: false,
        zoomEnabled: false,
        zoomPosition: 'bottomright',
        limitGeoViewSelections: false // TODO temporary until specific geographies are factored out of the code
    }
}
