import Controller from '../src/js/controller';

describe('Controller', () => {

  it('initialize successully', () => {
    let controller = new Controller({});
  });
  describe('Event loop', () => {
    it('adds the state to payload', () => {
      let controller = new Controller({});
      let result = null;
      let payload = "expected"
      controller.on('eventname', (e) => result = e)

      controller.triggerEvent('eventname', payload);

      expect(result).toHaveProperty('state')
      expect(result).toHaveProperty('payload')
    });
  });
});

