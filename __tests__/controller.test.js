import Controller from '../src/js/controller';
import {Component} from '../src/js/utils';

describe('Controller', () => {

  it('initialize successully', () => {
    let component = new Component();
    let controller = new Controller(component);
  });
  describe('Event loop', () => {
    it('adds the state to payload', () => {
      let component = new Component();
      let controller = new Controller(component);
      let result = null;
      let payload = "expected"
      controller.on('eventname', (e) => result = e)

      controller.triggerEvent('eventname', payload);

      expect(result).toHaveProperty('state')
      expect(result).toHaveProperty('payload')
    });
  });
});

