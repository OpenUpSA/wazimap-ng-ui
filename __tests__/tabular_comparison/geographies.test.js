import * as React from 'react';
import { act } from "react-dom/test-utils";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { within } from '@testing-library/dom';
import Geographies from '../../src/js/tabular_comparison/geographies';


const renderComponent = ({
  selectedGeographies=[],
  apiDetails={},
  mockedSetSelectedGeographies=jest.fn()
} = {}) => {
  render(
    <Geographies
      selectedGeographies={selectedGeographies}
      api={apiDetails}
      setSelectedGeographies={mockedSetSelectedGeographies}
    />
  );
}

describe('Test Empty state for geography section', () => {
    test('Empty state text is shown when there is no geography selected', () => {
      renderComponent();
      const emptyStateDiv = screen.getByText(/Choose a geography to get started!/i);
      expect(emptyStateDiv).toBeInTheDocument();
    })

    test('Empty is not shown when there is atleast one selected geography', () => {

      const emptyStateDiv = screen.queryByText(/Choose a geography to get started!/i);
      expect(emptyStateDiv).not.toBeInTheDocument();
    })
})

describe('Test geography chips', () => {
    let mockedSetSelectedGeographies;
    beforeEach(() => {
      const selectedGeographies = [
          {"name": "Eastern Cape", "code": "EC"},
          {"name": "Western Cape", "code": "WC"}
      ];
      mockedSetSelectedGeographies = jest.fn();
      renderComponent({selectedGeographies, mockedSetSelectedGeographies});
    })

    test('Geography chips are rendered for selected geographies', () => {
      const geographyPanel = screen.getByTestId('selected-geographies');
      const chips = within(geographyPanel).getAllByRole("button");
      expect(chips).toHaveLength(2);
      expect(chips[0].textContent).toBe("Eastern Cape");
      expect(chips[1].textContent).toBe('Western Cape');
    })

    test('Clicking on cancel icon updates selected geography state', () => {
      const geographyPanel = screen.getByTestId('selected-geographies');
      const chips = within(geographyPanel).getAllByRole("button");
      expect(chips).toHaveLength(2);
      const chipParentPanel = screen.getByText(/Eastern Cape/i).parentElement;
      const cancelIcon = within(chipParentPanel).getByTestId('CancelIcon');
      fireEvent.click(cancelIcon);
      expect(mockedSetSelectedGeographies).toHaveBeenCalledTimes(1)
      expect(mockedSetSelectedGeographies).toHaveBeenCalledWith([
        {"name": "Western Cape", "code": "WC"}
      ])
    })
})

describe('Test searching and selecting geographies', () => {
    let mockedSetSelectedGeographies;

    beforeEach(() => {
      mockedSetSelectedGeographies = jest.fn();
      renderComponent({
        mockedSetSelectedGeographies,
        apiDetails: {
          "search": jest.fn().mockResolvedValue([{"name": "Eastern Cape", "code": "EC"}])
        }
      });
    })

    test('Geography can be searched and selected', async () => {
      const autocomplete = screen.getByTestId('geography-autocomplete');
      const input = within(autocomplete).getByRole("combobox");
      autocomplete.focus()
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Eastern' } });
      });
      fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
      fireEvent.keyDown(autocomplete, { key: 'Enter' });
      expect(mockedSetSelectedGeographies).toHaveBeenCalledTimes(1)
      expect(mockedSetSelectedGeographies).toHaveBeenCalledWith([
        {"name": "Eastern Cape", "code": "EC"}
      ])
    })
})
