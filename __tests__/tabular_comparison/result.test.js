import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {within} from '@testing-library/dom';
import Result from '../../src/js/tabular_comparison/result.js';
import ec_indicators from "./data/ec_indicators.json";
import wc_indicators from "./data/wc_indicators.json";



const renderComponent = ({
  indicators=[],
  indicatorObjs=[],
  selectedGeographies=[]
} = {}) => {
  render(
      <Result
        indicators={indicators}
        indicatorObjs={indicatorObjs}
        selectedGeographies={selectedGeographies}
      />
  );
}

describe('Test resulting comparison empty states', () => {

    test('Check empty state when no geography is selected', () => {
      renderComponent();
      const emptyStateDiv = screen.getByText(/We can’t wait to show you some data! Choose a geography to get started!/i);
      expect(emptyStateDiv).toBeInTheDocument();
    })

    test('Check empty state when geography is selected but no indicator objs', () => {
      renderComponent({selectedGeographies: [{"code": "EC", "name": "Eastern Cape"}]});
      const emptyStateDiv = screen.getByText(/You’ve chosen a geography, now select an indicator!/i);
      expect(emptyStateDiv).toBeInTheDocument();
    })

    test('Check empty state when geography is selected and indicator obj is added', () => {
      renderComponent({
          selectedGeographies: [{"code": "EC", "name": "Eastern Cape"}],
          indicatorObjs: [{"index": 1, "indicator": "", "category": ""}]
      });
      const geographyTableHeader = screen.getByText(/Geography/i);
      expect(geographyTableHeader).toBeInTheDocument();

      const selectedGeo = screen.getByText(/Eastern Cape/i);
      expect(selectedGeo).toBeInTheDocument();
    })
})

describe('Test resulting comparison', () => {

    test('Check results table when one indicator and one geo is selected', () => {
      renderComponent({
          selectedGeographies: [{"name": "Eastern Cape", "code": "EC"}],
          indicatorObjs: [{ index: 1, indicator: 'Region of birth', category: 'Male' }],
          indicators: ec_indicators
      });

      // assert headers
      expect(screen.getByTestId('table-header-0')).toHaveTextContent('Geography');
      expect(screen.getByTestId('table-header-1')).toHaveTextContent('Region of birth : Male');

      // assert table rows
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('2,757,773');

    })

    test('Check results table when one indicator and two geos are selected without indicators for second geo', () => {
      renderComponent({
          selectedGeographies: [
            {"name": "Eastern Cape", "code": "EC"},
            {"name": "Western Cape", "code": "WC"}
          ],
          indicatorObjs: [{ index: 1, indicator: 'Region of birth', category: 'Male' }],
          indicators: ec_indicators
      });

      // assert headers
      expect(screen.getByTestId('table-header-0')).toHaveTextContent('Geography');
      expect(screen.getByTestId('table-header-1')).toHaveTextContent('Region of birth : Male');

      // assert table rows
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('2,757,773');

      expect(screen.getByTestId('table-row-1-cell-0')).toHaveTextContent('Western Cape');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveTextContent('');

    })

    test('Check results table when one indicator and two geos are selected with valid data', () => {
      let indicators = []
      renderComponent({
          selectedGeographies: [
            {"name": "Eastern Cape", "code": "EC"},
            {"name": "Western Cape", "code": "WC"}
          ],
          indicatorObjs: [{ index: 1, indicator: 'Region of birth', category: 'Male' }],
          indicators: indicators.concat(ec_indicators, wc_indicators)
      });

      // assert headers
      expect(screen.getByTestId('table-header-0')).toHaveTextContent('Geography');
      expect(screen.getByTestId('table-header-1')).toHaveTextContent('Region of birth : Male');

      // assert table rows
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('2,757,773');

      expect(screen.getByTestId('table-row-1-cell-0')).toHaveTextContent('Western Cape');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveTextContent('2,602,049');

    })

    test('Check results table when two indicators and two geos with color coding', () => {
      let indicators = []
      renderComponent({
          selectedGeographies: [
            {"name": "Eastern Cape", "code": "EC"},
            {"name": "Western Cape", "code": "WC"}
          ],
          indicatorObjs: [
            { index: 1, indicator: 'Region of birth', category: 'Male' },
            { index: 2, indicator: 'Total population by age group', category: '25-29' },
          ],
          indicators: indicators.concat(ec_indicators, wc_indicators)
      });

      // assert headers
      expect(screen.getByTestId('table-header-0')).toHaveTextContent('Geography');
      expect(screen.getByTestId('table-header-1')).toHaveTextContent('Region of birth : Male');
      expect(screen.getByTestId('table-header-2')).toHaveTextContent('Total population by age group : 25-29');

      // assert table rows
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('2,757,773');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveStyle('background-color: rgb(186, 186, 186)');
      expect(screen.getByTestId('table-row-0-cell-2')).toHaveTextContent('456,183');
      expect(screen.getByTestId('table-row-0-cell-2')).toHaveStyle('background-color: rgb(255, 255, 255)');


      expect(screen.getByTestId('table-row-1-cell-0')).toHaveTextContent('Western Cape');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveTextContent('2,602,049');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveStyle('background-color: rgb(255, 255, 255)');
      expect(screen.getByTestId('table-row-1-cell-2')).toHaveTextContent('564,243');
      expect(screen.getByTestId('table-row-1-cell-2')).toHaveStyle('background-color: rgb(186, 186, 186)');

    })

    test('Check results table data formatting', () => {
      let indicators = []
      renderComponent({
          selectedGeographies: [
            {"name": "Eastern Cape", "code": "EC"},
            {"name": "Western Cape", "code": "WC"}
          ],
          indicatorObjs: [
            { index: 1, indicator: 'Citizenship', category: 'Yes' },
            { index: 2, indicator: 'Citizenship', category: 'No' },
          ],
          indicators: indicators.concat(ec_indicators, wc_indicators)
      });

      // assert table rows
      // ,.2f formatting set in fixture Citizenship indicator of EC
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('5,488,393.50');
      expect(screen.getByTestId('table-row-0-cell-2')).toHaveTextContent('82,910.31');

      // No formatting set in fixture Citizenship indicator of WC (Should pick up default)
      expect(screen.getByTestId('table-row-1-cell-0')).toHaveTextContent('Western Cape');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveTextContent('4.99764M');
      expect(screen.getByTestId('table-row-1-cell-2')).toHaveTextContent('237.696k');

    })
})
