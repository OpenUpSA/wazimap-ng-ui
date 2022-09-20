import {loadMenu, DataMapperMenu} from "../../../src/js/elements/data_mapper/menu.js";
import {Component} from '../../../src/js/utils';

import html from '../../../src/index.html';


describe('Check data mapper menu order', () => {
    let dataMapperMenu;

    beforeEach(() => {
        document.body.innerHTML = html;
        let component = new Component();
        dataMapperMenu = new DataMapperMenu(component);
    });

    test('Check if categories are rendered according to order field in data', () => {
      let data = {
        "Demographics": {"order": 5, "name": 'Demographics', "subcategories": {}},
        "Education": {"order": 1, "name": 'Education', "subcategories": {}},
        "Youth Poverty": {"order": 3, "name": 'Youth Poverty', "subcategories": {}},
      }

      loadMenu(dataMapperMenu, data);
      let categoryDivs = document.querySelectorAll('.data-category--v2 .data-category__h1_title');
      expect($(categoryDivs[0]).text().trim()).toBe("Education");
      expect($(categoryDivs[1]).text().trim()).toBe("Youth Poverty");
      expect($(categoryDivs[2]).text().trim()).toBe("Demographics");
    });

    test('Check if subcategories are rendered according to order field in data', () => {
      let data = {
        "Demographics": {
            "order": 5, "name": 'Demographics', "subcategories": {
              "Language": {"name": "Language", "order": 2, "indicators": {}},
              "Migration": {"name": "Migration", "order": 3, "indicators": {}},
              "Population": {"name": "Population", "order": 1, "indicators": {}},
            }
        },
      }

      loadMenu(dataMapperMenu, data);
      let subCategoryDivs = document.querySelectorAll('.data-category--v2 .data-category__h2_trigger--v2');
      expect($(subCategoryDivs[0]).text().trim()).toBe("Population");
      expect($(subCategoryDivs[1]).text().trim()).toBe("Language");
      expect($(subCategoryDivs[2]).text().trim()).toBe("Migration");
    });

    test('Check if indicators are rendered according to order field in data', () => {
      let data = {
          "Economic Opportunities": {
            "order": 5, "name": 'Economic Opportunities', "subcategories": {
              "Employment": {"name": "Employment", "order": 2, "indicators": {
                "Employment status": {
                  "order": 1, "label": "Employment status", "metadata": {"primary_group": "", "groups": []}
                },
                "Unemployment - Expanded": {
                  "order": 3, "label": "Unemployment - Expanded", "metadata": {"primary_group": "", "groups": []}
                },
                "Unemployment - Official": {
                  "order": 2, "label": "Unemployment - Official", "metadata": {"primary_group": "", "groups": []}
                },
              }
            }
          }
        }
      }
      loadMenu(dataMapperMenu, data);
      let indicatorDivs = document.querySelectorAll('.data-category--v2 .data-category__h3_trigger--v2');
      expect($(indicatorDivs[0]).text().trim()).toBe("Employment status");
      expect($(indicatorDivs[1]).text().trim()).toBe("Unemployment - Official");
      expect($(indicatorDivs[2]).text().trim()).toBe("Unemployment - Expanded");
    });
})
