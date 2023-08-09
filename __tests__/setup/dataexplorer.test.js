import html from '../../src/index.html';
import Controller from "../../src/js/controller";
import {Config as SAConfig} from "../../src/js/configurations/geography_sa";
import {DataMapperMenu} from "../../src/js/elements/data_mapper/menu";
import {configureDataExplorerEvents} from "../../src/js/setup/dataexplorer";
import {filterIndicatorData} from '../../src/js/elements/data_mapper/menu';
import quantQualBasePayload from './dataexplorer-quant-qual-base-payload.data.js';

describe('Data explorer', () => {
    beforeEach(() => {
        document.body.innerHTML = html;
    })

    test('Qualitative indicators are not shown', () => {
        const payload = JSON.parse(JSON.stringify(quantQualBasePayload));

        const data = filterIndicatorData(payload, []);
        const indictaor = data[0].subcategories[0].indicators[0];
        expect(indictaor.dataset_content_type).toBe("qualitative");
        expect(indictaor.isHidden).toBe(true);
    })

    test('Quantitative indicators are shown', () => {

      const payload = JSON.parse(JSON.stringify(quantQualBasePayload));

      const data = filterIndicatorData(payload, []);
      const indictaor = data[0].subcategories[0].indicators[1];
      expect(indictaor.dataset_content_type).toBe("quantitative");
      expect(indictaor.isHidden).toBe(false);
    })
})
