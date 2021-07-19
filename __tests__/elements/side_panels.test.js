import { screen, fireEvent, getByText } from '@testing-library/dom'

import { SidePanels } from "../../src/js/elements/side_panels.js";
import {Component} from '../../src/js/utils';

describe('SidePanels', () => {
  let sp;
  let triggerEvent;
  let showPanels = { 'rich_data': true, 'point_data': true, 'data_explorer': true }
  beforeEach(() => {
    document.body.innerHTML = `
    <div class="rich-data-toggles">
      <div class="panel-toggle" data-testid="rich-data-rich"></div>
      <div class="panel-toggle" data-testid="rich-data-point"></div>
      <div class="panel-toggle" data-testid="rich-data-map"></div>
    </div>
    <div class="point-mapper-toggles">
      <div class="panel-toggle" data-testid="point-mapper-rich"></div>
      <div class="panel-toggle" data-testid="point-mapper-point"></div>
      <div class="panel-toggle" data-testid="point-mapper-map"></div>
    </div>
    <div class="data-mapper-toggles">
      <div class="panel-toggle" data-testid="data-mapper-rich"></div>
      <div class="panel-toggle" data-testid="data-mapper-point"></div>
      <div class="panel-toggle" data-testid="data-mapper-map"></div>
    </div>
    <div class="panel-toggles">
      <div class="panel-toggle" data-testid="empty-rich"></div>
      <div class="panel-toggle" data-testid="empty-point"></div>
      <div class="panel-toggle" data-testid="empty-map"></div>
    </div>
    `;
  })
  describe('click interactions', () => {
    describe('just close the panel', () => {
      test('calls close event', () => {
        let component = new Component();
        sp = new SidePanels(component, showPanels)
        triggerEvent = jest.spyOn(sp, 'triggerEvent')

        fireEvent.click(screen.getByTestId('rich-data-rich'));

        expect(triggerEvent).toBeCalledTimes(1);
        expect(triggerEvent).toHaveBeenNthCalledWith(1, 'panel.rich_data.closed');
      });
      })
    describe('open a new panel', () => {
      test('call close and open event', () => {
        let component = new Component();
        sp = new SidePanels(component, showPanels)
        triggerEvent = jest.spyOn(sp, 'triggerEvent')

        fireEvent.click(screen.getByTestId('rich-data-point'));

        expect(triggerEvent).toBeCalledTimes(2);
        expect(triggerEvent).toHaveBeenNthCalledWith(1, 'panel.rich_data.closed');
        expect(triggerEvent).toHaveBeenNthCalledWith(2, 'panel.point_mapper.opened');
      });
    });

  })
})

