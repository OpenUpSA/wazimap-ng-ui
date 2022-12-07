import {Choropleth} from "../../../src/js/map/choropleth/choropleth.js";
import Controller from "../../../src/js/controller";


describe('Check lower and upper bounds for legends', () => {
    let choropleth = new Choropleth();

    test("test bounds for positive values", () => {
      const values = [100, 200, 50, 334, 862];
      const bounds = choropleth.getBounds(values);
      expect(bounds.lower).toBe(50);
      expect(bounds.upper).toBe(862);
    });

    test("test bounds for negative values", () => {
      const values = [-100, -200, -50, -334, -862];
      const bounds = choropleth.getBounds(values);
      expect(bounds.lower).toBe(-862);
      expect(bounds.upper).toBe(-50);
    });

    test("test bounds for Mixed values", () => {
      const values = [100, 200, 50, -334, -862];
      const bounds = choropleth.getBounds(values);
      expect(bounds.lower).toBe(-862);
      expect(bounds.upper).toBe(862);
    });

})


describe('Check intervals for legends', () => {
    let choropleth = new Choropleth();

    test("test if middle value is always 0 for negative and positive bounds", () => {
      let intervals = choropleth.getIntervals([100, 200, -50, 334, 862]);
      expect(intervals).toMatchObject([ -862, -431, 0, 431, 862 ]);
      expect(intervals[2]).toBe(0);

      intervals = choropleth.getIntervals([-100, -200, 50, -334, -862]);
      expect(intervals).toMatchObject([ -862, -431, 0, 431, 862 ]);
      expect(intervals[2]).toBe(0);
    });
})
