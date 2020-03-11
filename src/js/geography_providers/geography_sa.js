export const geography_config = {
    rootGeography: 'ZA',
    preferredChildren: {
        country: ['province'],
        province: ['district', 'municipality'],
        district: ['municipality'],
        municipality: ['mainplace','planning_region'],
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
    individualMarkerLevels: ['mainplace', 'subplace', 'ward']
}
