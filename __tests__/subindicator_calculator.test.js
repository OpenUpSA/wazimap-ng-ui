import SubindicatorCalculator from '../src/js/map/choropleth/subindicator_calculator';

describe('SubindicatorCalculator', () => {

  describe('#calculate', () => {
    describe('all geography codes in both', () => {
      it('calculates percentage', () => {
        let expectedResult = [{ code: "code", val: 0.2 }];
        let data = { code: 1 }
        let subindicatorArr = [ { children: { code: 1 }}, { children: { code: 4 } }]
        let bt = new SubindicatorCalculator();

        let result = bt.calculate({ data, subindicatorArr })

        expect(result).toEqual(expectedResult)

      });
    });
    describe('geography code not in children', () => {
      it('calculates percentage', () => {
        let expectedPercentage = 0.2
        let expectedResult = [{ code: "code", val: expectedPercentage }];
        let data = { code: 1 }
        let subindicatorArr = [ { children: { code2: 1 }}, { children: { code: 5 } }]
        let bt = new SubindicatorCalculator();

        let result = bt.calculate({ data, subindicatorArr })

        expect(result).toEqual(expectedResult)

      });
    });
  });
});

