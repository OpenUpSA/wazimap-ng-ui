import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import ComparisonIndicators from '../../src/js/tabular_comparison/comparison-indicators';
import all_details_ec from "./data/all_details_ec.json";


const renderComponent = ({
  selectedGeographies=[],
  indicators=[],
  indicatorObjs=[],
  apiDetails={},
  mockSetIndicators=jest.fn(),
  mockSetIndicatorObjs=jest.fn()
} = {}) => {
  render(
      <ComparisonIndicators
        cardHeight={76.5}
        selectedGeographies={selectedGeographies}
        indicators={indicators}
        setIndicatorObjs={mockSetIndicatorObjs}
        setIndicators={mockSetIndicators}
        indicatorObjs={indicatorObjs}
        api={apiDetails}
      />
  );
}

const selectAutocompleteResult = (indicatorPanel, type, searchVar) => {
  const autocomplete = within(indicatorPanel).getByTestId(`${type}-autocomplete`);
  const input = within(autocomplete).getByRole("combobox");
  autocomplete.focus()
  fireEvent.change(input, { target: { value: searchVar } });
  fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
  fireEvent.keyDown(autocomplete, { key: 'Enter' });
  return input
}

describe('Test Empty state for comparison indicator', () => {
    let apiDetails, selectedGeographies;

    beforeAll(() => {
      selectedGeographies = [{"name": "Eastern Cape", "code": "EC"}];
      apiDetails = {
        getProfileWithoutVersion: jest.fn().mockResolvedValue(all_details_ec)
      }
    })

    test('Empty state text is shown when there is no geography selected', () => {
      renderComponent();
      const emptyStateDiv = screen.getByText(/Indicators can only be selected once a geography is chosen!/i);
      expect(emptyStateDiv).toBeInTheDocument();
    })

    test('Add indicator button is disabled when no geography is selected', () => {
      renderComponent()
      const addIndicatorButton = screen.getByTestId("add-indicator");
      expect(addIndicatorButton).toBeInTheDocument();
      expect(addIndicatorButton.disabled).toBe(true);
    })

    test('Empty state text is shown when there is geography selected but no indicators', () => {
      renderComponent({selectedGeographies, apiDetails});
      const emptyStateDiv = screen.getByText(/Great! Now select an indicator for your chosen geography!/i);
      expect(emptyStateDiv).toBeInTheDocument();
    })
})

describe('Test add indictor to compare button', () => {
    let mockSetIndicatorObjs, apiDetails, selectedGeographies;

    beforeAll(() => {
      selectedGeographies = [{"name": "Eastern Cape", "code": "EC"}];
      apiDetails = {
        getProfileWithoutVersion: jest.fn().mockResolvedValue(all_details_ec)
      }
    })

    beforeEach(()=>{
      mockSetIndicatorObjs = jest.fn();
    })

    test('Panel is added when indictor to compare button is clicked', () => {
      renderComponent({ selectedGeographies, mockSetIndicatorObjs, apiDetails });

      const addIndicatorButton = screen.getByTestId("add-indicator");
      fireEvent.click(addIndicatorButton);
      expect(mockSetIndicatorObjs).toHaveBeenCalledTimes(1)
      expect(mockSetIndicatorObjs).toHaveBeenCalledWith([{ index: 1, indicator: '', category: '', filters: [] }])
    })
})

describe('Test indicator panel actions', () => {
    let mockSetIndicatorObjs, mockSetIndicators, apiDetails, selectedGeographies, indicatorObjs, indicators;

    beforeAll(() => {
      selectedGeographies = [{"name": "Eastern Cape", "code": "EC"}];
      indicatorObjs = [{ index: 1, indicator: '', category: '' }];
      apiDetails = {
        getProfileWithoutVersion: jest.fn().mockResolvedValue(all_details_ec)
      };
      indicators = [{
        geo: 'EC',
        indicator: 'Employment status',
        indicatorDetail: {
          metadata: {
            groups: [{
              name: "race",
              subindicators: ['Black African', 'Coloured', 'White', 'Other', 'Indian or Asian']
            }],
            primary_group: "race"
          }
        }
      }];
    })

    beforeEach(()=>{
      mockSetIndicatorObjs = jest.fn();
      mockSetIndicators = jest.fn();
    })

    test('Panels are rendered accoridng to indicator objs preset', () => {
      renderComponent({selectedGeographies, indicatorObjs, apiDetails})
      const indicatorPanel = screen.getByTestId('indicator-panel-1');
      expect(indicatorPanel).toBeInTheDocument();
    })

    test('Indicator value can be searced and selected', () => {
      renderComponent({
        selectedGeographies, indicators, indicatorObjs, apiDetails, mockSetIndicatorObjs
      });

      const indicatorPanel = screen.getByTestId('indicator-panel-1');
      expect(indicatorPanel).toBeInTheDocument();
      let input = selectAutocompleteResult(indicatorPanel, "indicator", "Employment")
      expect(input.value).toBe("Employment status");
      expect(mockSetIndicatorObjs).toHaveBeenCalledTimes(1);
      expect(mockSetIndicatorObjs).toHaveBeenCalledWith([{ index: 1, indicator: 'Employment status', category: ''}])
    })

    test('Category value can be searched and selected', () => {
      renderComponent({
        selectedGeographies, indicators, apiDetails, mockSetIndicatorObjs,
        indicatorObjs: [{ index: 1, indicator: 'Employment status', category: '' }]
      });
      const indicatorPanel = screen.getByTestId('indicator-panel-1');
      let indcatorInput = selectAutocompleteResult(indicatorPanel, "indicator", "Employment")
      expect(indcatorInput.value).toBe("Employment status");

      let categoryInput = selectAutocompleteResult(indicatorPanel, "category", "Black")
      expect(categoryInput.value).toBe("Black African");
      expect(mockSetIndicatorObjs).toHaveBeenCalledTimes(2);
      expect(mockSetIndicatorObjs).toHaveBeenCalledWith([{ index: 1, indicator: 'Employment status', category: 'Black African' }])
    })

    test('Comparison indicator panel can be removed by clicking on remove panel button', () => {
      renderComponent({
        selectedGeographies, indicatorObjs, apiDetails, mockSetIndicatorObjs
      });
      const indicatorPanel = screen.getByTestId('indicator-panel-1');
      expect(indicatorPanel).toBeInTheDocument();
      const removePanelButton = screen.getByTestId('remove-panel-1');
      fireEvent.click(removePanelButton);
      // expect(indicatorPanel). toBeInTheDocument();
      expect(mockSetIndicatorObjs).toHaveBeenCalledTimes(1);
      expect(mockSetIndicatorObjs).toHaveBeenCalledWith([])
    })
})
