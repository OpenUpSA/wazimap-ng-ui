import {loadMenu} from "../../src/js/elements/menu";
import {screen} from "@testing-library/dom";

let menuData = {
    Demographics: {
        subcategories: {
            Language: {
                indicators: {
                    'Language most spoken at home': {
                        data: [{
                            race: "Black African",
                            count: "122",
                            gender: "Male",
                            language: "Afrikaans",
                            'age group': "15-19"
                        },
                            {
                                race: "Black African",
                                count: "60",
                                gender: "Male",
                                language: "English",
                                'age group': "15-19"
                            }],
                        metadata: {
                            primary_group: "race",
                            groups: [{
                                can_aggregate: true,
                                can_filter: true,
                                dataset: 94,
                                name: "race",
                                subindicators: ["Black African", "Coloured", "Indian or Asian", "White", "Other"]
                            }]
                        }
                    }
                }
            }
        }
    }
}

describe('data mapper ', () => {
    beforeEach(() => {
        document.body.innerHTML = mainDocument;
        document.getElementsByClassName('no-choropleth-data')[0].setAttribute('data-testid', 'no-data-chip');
    })

    test('is created correctly', () => {
        loadMenu(menuData, null);
    })

    test('does not have data to show', () => {
        loadMenu(menuData, null);

        let noDataChip = screen.getByTestId('no-data-chip');
        expect(noDataChip.classList.contains('hidden')).toBe(false);
    })

    test('is available', () => {
        menuData['Demographics']['subcategories']['Language']['indicators']['Language most spoken at home']['child_data'] = {};

        loadMenu(menuData, null);

        let noDataChip = screen.getByTestId('no-data-chip');
        expect(noDataChip).toHaveClass('hidden');
    })
})