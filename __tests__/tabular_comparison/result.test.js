import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
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

    test('Empty state when no geography is selected', () => {
      renderComponent();
      const emptyStateDiv = screen.getByText(/We can’t wait to show you some data! Choose a geography to get started!/i);
      expect(emptyStateDiv).toBeInTheDocument();
    })

    test('Empty state when geography is selected but no indicator objs', () => {
      renderComponent({selectedGeographies: [{"code": "EC", "name": "Eastern Cape"}]});
      const emptyStateDiv = screen.getByText(/You’ve chosen a geography, now select an indicator!/i);
      expect(emptyStateDiv).toBeInTheDocument();
    })

    test('Empty state when geography is selected and indicator obj is added', () => {
      renderComponent({
          selectedGeographies: [{"code": "EC", "name": "Eastern Cape"}],
          indicatorObjs: [{"index": 1, "indicator": "", "category": "", "filters": []}]
      });
      const geographyTableHeader = screen.getByText(/Geography/i);
      expect(geographyTableHeader).toBeInTheDocument();

      const selectedGeo = screen.getByText(/Eastern Cape/i);
      expect(selectedGeo).toBeInTheDocument();
    })
})

describe('Test resulting comparison', () => {

    test('Results table when one indicator and one geo is selected', () => {
      renderComponent({
          selectedGeographies: [{"name": "Eastern Cape", "code": "EC"}],
          indicatorObjs: [{ index: 1, indicator: 'Region of birth', category: 'Male', filters: [] }],
          indicators: ec_indicators
      });

      // assert headers
      expect(screen.getByTestId('table-header-0')).toHaveTextContent('Geography');
      expect(screen.getByTestId('table-header-1')).toHaveTextContent('Region of birth');

      // assert table rows
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('2,757,773');

    })

    test('Results table when one indicator and two geos are selected without indicators for second geo', () => {
      renderComponent({
          selectedGeographies: [
            {"name": "Eastern Cape", "code": "EC"},
            {"name": "Western Cape", "code": "WC"}
          ],
          indicatorObjs: [{ index: 1, indicator: 'Region of birth', category: 'Male', filters: [] }],
          indicators: ec_indicators
      });

      // assert headers
      expect(screen.getByTestId('table-header-0')).toHaveTextContent('Geography');
      expect(screen.getByTestId('table-header-1')).toHaveTextContent('Region of birth');

      // assert table rows
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('2,757,773');

      expect(screen.getByTestId('table-row-1-cell-0')).toHaveTextContent('Western Cape');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveTextContent('');

    })

    test('Results table when one indicator and two geos are selected with valid data for both geo', () => {
      let indicators = []
      renderComponent({
          selectedGeographies: [
            {"name": "Eastern Cape", "code": "EC"},
            {"name": "Western Cape", "code": "WC"}
          ],
          indicatorObjs: [{ index: 1, indicator: 'Region of birth', category: 'Male', filters: [] }],
          indicators: indicators.concat(ec_indicators, wc_indicators)
      });

      // assert headers
      expect(screen.getByTestId('table-header-0')).toHaveTextContent('Geography');
      expect(screen.getByTestId('table-header-1')).toHaveTextContent('Region of birth');

      // assert table rows
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('2,757,773');

      expect(screen.getByTestId('table-row-1-cell-0')).toHaveTextContent('Western Cape');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveTextContent('2,602,049');

    })

    test('Results table when two indicators and two geos with color coding', () => {
      let indicators = []
      renderComponent({
          selectedGeographies: [
            {"name": "Eastern Cape", "code": "EC"},
            {"name": "Western Cape", "code": "WC"}
          ],
          indicatorObjs: [
            { index: 1, indicator: 'Region of birth', category: 'Male', filters: [] },
            { index: 2, indicator: 'Total population by age group', category: '25-29', filters: [] },
          ],
          indicators: indicators.concat(ec_indicators, wc_indicators)
      });

      // assert headers
      expect(screen.getByTestId('table-header-0')).toHaveTextContent('Geography');
      expect(screen.getByTestId('table-header-1')).toHaveTextContent('Region of birth');
      expect(screen.getByTestId('table-header-2')).toHaveTextContent('Total population by age group');

      // assert table rows
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('2,757,773');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveStyle('background-color: rgb(8, 81, 156)');
      expect(screen.getByTestId('table-row-0-cell-2')).toHaveTextContent('456,183');
      expect(screen.getByTestId('table-row-0-cell-2')).toHaveStyle('background-color: rgb(239, 243, 255)');


      expect(screen.getByTestId('table-row-1-cell-0')).toHaveTextContent('Western Cape');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveTextContent('2,602,049');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveStyle('background-color: rgb(239, 243, 255)');
      expect(screen.getByTestId('table-row-1-cell-2')).toHaveTextContent('564,243');
      expect(screen.getByTestId('table-row-1-cell-2')).toHaveStyle('background-color: rgb(8, 81, 156)');

    })

    test('test results table data formatting', () => {
      let indicators = []
      renderComponent({
          selectedGeographies: [
            {"name": "Eastern Cape", "code": "EC"},
            {"name": "Western Cape", "code": "WC"}
          ],
          indicatorObjs: [
            { index: 1, indicator: 'Citizenship', category: 'Yes', filters: [] },
            { index: 2, indicator: 'Citizenship', category: 'No', filters: [] },
          ],
          indicators: indicators.concat(ec_indicators, wc_indicators)
      });

      // assert table rows
      // .2% formatting set in fixture Citizenship indicator of EC
      expect(screen.getByTestId('table-row-0-cell-0')).toHaveTextContent('Eastern Cape');
      expect(screen.getByTestId('table-row-0-cell-1')).toHaveTextContent('98.06%');
      expect(screen.getByTestId('table-row-0-cell-2')).toHaveTextContent('1.48%');

      // No formatting set in fixture Citizenship indicator of WC (Should pick up default)
      expect(screen.getByTestId('table-row-1-cell-0')).toHaveTextContent('Western Cape');
      expect(screen.getByTestId('table-row-1-cell-1')).toHaveTextContent('4.99764M');
      expect(screen.getByTestId('table-row-1-cell-2')).toHaveTextContent('237.696k');

    })
})
