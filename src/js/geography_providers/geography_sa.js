export const geography_config = {
    rootGeography: 'ZA',
    preferredChildren: {
        country: 'province',
        province: 'district',
        district: 'municipality',
        municipality: 'mainplace',
        mainplace: 'subplace'
    },
}
