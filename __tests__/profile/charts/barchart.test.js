import { configureBarchart, configureBarchartDownload } from '../../../src/js/profile/charts/barChart.js';
import { screen, fireEvent, getByText } from '@testing-library/dom'
import { parse, View }from 'vega';

function renderVegaHeadless(spec) {
  const runtime = parse(spec)

  return new View(runtime);
}

describe('configureBarchart', () => {
  let data, metadata, config;
  beforeEach(() => {
    metadata = {
      primary_group: "age",
      groups: [{ name: "age" }]
      },
    data = [
      { age: 15, gender: 'male', count: 1 },
      { age: 12, gender: 'female', count: 3 },
      { age: 14, gender: 'male', count: 2 }
    ]
    config = {
      types: {
        Value: {
          formatting: ",.0f",
          minX: "default",
          maxX: "default"
        },
        Percentage: {
          formatting: ".0%",
          minX: "default",
          maxX: "default"
        }
      },
      disableToggle: false,
      defaultType: "Value",
      xTicks: null
    }
  });

  describe('evaluated vega', () => {
    describe('only default values', () => {
      let config, view;
      beforeEach(() => {
        config = {
          types: {
            Value: {
              formatting: ",.0f",
              minX: "default",
              maxX: "default"
            },
            Percentage: {
              formatting: ".0%",
              minX: "default",
              maxX: "default"
            }
          },
          disableToggle: false,
          defaultType: "Value",
          xTicks: null
        }
        let vegaSpec = configureBarchart(data, metadata, config);
        view = renderVegaHeadless(vegaSpec)
      })
      it('scale domain will use the data extent', async () => {
        await view.runAsync()

        expect(view.scale("xscale").domain()).toStrictEqual([0,3])
      });
      it('domainMin and domainMax signals will be undefined', async () => {
        await view.runAsync()

        expect(view.signal("domainMin")).toBe(undefined)
        expect(view.signal("domainMax")).toBe(undefined)
      });
    });
    describe('percentage set', () => {
      let config, view;
      beforeEach(() => {
        config = {
          types: {
            Value: {
              formatting: ",.0f",
              minX: "default",
              maxX: "default"
            },
            Percentage: {
              formatting: ".0%",
              minX: "default",
              maxX: 1
            }
          },
          disableToggle: false,
          defaultType: "Percentage",
          xTicks: null
        }
      })
      it('domain max from percentage config', async () => {
        let vegaSpec = configureBarchart(data, metadata, config);
        view = renderVegaHeadless(vegaSpec)
        await view.runAsync()

        expect(view.scale("xscale").domain()).toStrictEqual([0,1])
        expect(view.signal("domainMax")).toBe(1)
        expect(view.signal("percentageMaxX")).toBe(1)
      });
    });
    describe('value default type', () => {
      let config;
      beforeEach(() => {
        config = {
          types: {
            Value: {
              formatting: ",.0f",
              minX: "default",
              maxX: 1000
            },
            Percentage: {
              formatting: ".0%",
              minX: "default",
              maxX: "default"
            }
          },
          disableToggle: false,
          defaultType: "Value",
          xTicks: null
        }
      })
      it('xscale has domain max from value config', async () => {
        let vegaSpec = configureBarchart(data, metadata, config);
        let view = renderVegaHeadless(vegaSpec)
        await view.runAsync()

        expect(view.scale("xscale").domain()).toStrictEqual([0, 1000])
        expect(view.signal("valueMaxX")).toBe(1000)
        expect(view.signal("valueMinX")).toBe(undefined)
      });
    });
  });
  describe('xTicks', () => {
    let config;
    beforeEach(() => {
      config = {
        types: {
          Value: {
            formatting: ",.0f",
            minX: "default",
            maxX: "default"
          },
          Percentage: {
            formatting: ".0%",
            minX: "default",
            maxX: "default"
          }
        },
        disableToggle: false,
        defaultType: "Value",
        xTicks: 10
      }
    })
    it('axis has tickCount from config', async() => {
      let vegaSpec = configureBarchart(data, metadata, config);

      const [yAxis, xAxis] = vegaSpec.axes

      expect(xAxis).toHaveProperty('tickCount', 10)
    });
  });
});

describe('Test downloadable barchart', () => {
  let data, metadata, config;
  beforeEach(() => {
    metadata = {
      source: "Census 2021",
      primary_group: "age",
      groups: [{ name: "age" }]
      },
    data = [
      { age: 15, gender: 'male', count: 1 },
      { age: 12, gender: 'female', count: 3 },
      { age: 14, gender: 'male', count: 2 }
    ]
    config = {
      types: {
        Value: {
          formatting: ",.0f",
          minX: "default",
          maxX: "default"
        },
        Percentage: {
          formatting: ".0%",
          minX: "default",
          maxX: "default"
        }
      },
      disableToggle: false,
      defaultType: "Value",
      xTicks: null
    }
  });

  test('Configure spec for downloadable Vega chart', async () => {
    let annotations = {'title':'Population', 'geography':'South Africa', 'filters':'Gender: female', 'attribution':'Profile config attribution'}
    let vegaDownloadSpec = configureBarchartDownload(data, metadata, config, annotations);
    let view = renderVegaHeadless(vegaDownloadSpec);
    await view.runAsync()

    expect(view.signal('title')).toBe('Population');
    expect(view.signal('source')).toBe('Census 2021');
    expect(view.signal('geography')).toBe('South Africa');
    expect(view.signal('filters')).toBe('Gender: female');
    expect(view.signal('attribution').toString()).toBe('Profile config attribution');
  })
});
