export const geography_config = {
    rootGeography: 'ZA',
    preferredChildren: {
        country: 'province',
        province: 'district',
        district: 'municipality',
        municipality: 'mainplace',
        mainplace: 'subplace'
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
