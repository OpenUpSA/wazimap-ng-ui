import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { within } from '@testing-library/dom'
import IndicatorAutoComplete from '../../src/js/tabular_comparison/indicator-auto-complete'


const mockedHandleIndicatorSelection = jest.fn();

describe('Yest indicator autocomplete', () => {
    const indicatorOptions = [
        'Language most spoken at home',
        'Region of birth',
        'Total population by age group'
    ];

    test('Should be able to search and select indicator from list', () => {
      const { getByTestId} = render(
          <IndicatorAutoComplete
            disabled={false}
            options={indicatorOptions}
            handleIndicatorSelection={mockedHandleIndicatorSelection}
          />
      );

      const autocomplete = getByTestId('indicator-autocomplete');
      const input = within(autocomplete).getByRole("combobox");
      autocomplete.focus()
      fireEvent.change(input, { target: { value: 'language' } });
      fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
      fireEvent.keyDown(autocomplete, { key: 'Enter' });
      expect(input.value).toBe("Language most spoken at home");
    })
})
