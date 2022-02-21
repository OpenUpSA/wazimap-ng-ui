import {configureBarchart, configureBarchartDownload} from '../../../src/js/profile/charts/barChart.js';
import {screen, fireEvent, getByText} from '@testing-library/dom'
import {parse, View} from 'vega';
import html from '../../../src/index.html';
import {Chart} from '../../../src/js/profile/chart.js';
import {Component} from '../../../src/js/utils.js'

function renderVegaHeadless(spec) {
    const runtime = parse(spec)

    return new View(runtime);
}

describe('configureBarchart', () => {
    document.body.innerHTML = html;

    let data, metadata, config;
    beforeEach(() => {
        metadata = {
            primary_group: "age",
            groups: [{name: "age"}]
        },
            data = [
                {age: 15, gender: 'male', count: 1},
                {age: 12, gender: 'female', count: 3},
                {age: 14, gender: 'male', count: 2}
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

                expect(view.scale("xscale").domain()).toStrictEqual([0, 3])
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

                expect(view.scale("xscale").domain()).toStrictEqual([0, 1])
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
        it('axis has tickCount from config', async () => {
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
            groups: [{name: "age"}]
        },
            data = [
                {age: 15, gender: 'male', count: 1},
                {age: 12, gender: 'female', count: 3},
                {age: 14, gender: 'male', count: 2}
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
        let annotations = {
            'title': 'Population',
            'geography': 'South Africa',
            'filters': 'Gender: female',
            'attribution': 'Profile config attribution',
            'graphValueType': 'Percentage'
        }
        let vegaDownloadSpec = configureBarchartDownload(data, metadata, config, annotations);
        let view = renderVegaHeadless(vegaDownloadSpec);
        await view.runAsync()

        expect(view.signal('title')).toBe('Population');
        expect(view.signal('source')).toBe('Source : Census 2021');
        expect(view.signal('geography')).toBe('South Africa');
        expect(view.signal('filters')).toBe('Gender: female');
        expect(view.signal('attribution').toString()).toBe('Profile config attribution');
    });

    test('Check spec for source if value does not exists', async () => {
        let annotations = {
            'title': 'Population',
            'geography': 'South Africa',
            'filters': 'Gender: female',
            'attribution': 'Profile config attribution',
            'graphValueType': 'Percentage'
        }
        metadata["source"] = '';
        let vegaDownloadSpec = configureBarchartDownload(data, metadata, config, annotations);
        let view = renderVegaHeadless(vegaDownloadSpec);
        await view.runAsync()
        expect(view.signal('source').toString()).toBe('');
    });

    test('Check change in bar chart scale', async () => {
        let parent = new Component();
        let newdata = {
            data: data,
            metadata: metadata,
            chartConfiguration: {
                filter: {
                    defaults: []
                }
            }
        }
        const node = document.querySelector('.profile-indicator');
        $(node).find(".hover-menu__content_list a[data-id='Percentage'] div")
            .text('Percentage test')
            .closest('a')
            .attr('data-testid', 'percentage-btn');

        let chart = new Chart(parent, config, newdata, [], node, "TEST", "this is chart attribution");

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(chart.vegaDownloadView.signal('Units')).toBe('value');

        let valueLink = screen.getByTestId('percentage-btn');
        fireEvent.click(valueLink);

        expect(chart.vegaDownloadView.signal('Units')).toBe('percentage');
    });

    test('Check change in bar chart filters', async () => {
        let parent = new Component();
        let metadata = {
            source: "Census 2021",
            primary_group: "gender",
            groups: [
              {name: "gender", subindicators: ["male", "female"]},
              {name: "age", subindicators: [12, 14, 15]}
          ]
        }
        let newdata = {
            data: data,
            child_data: {"ZA": data},
            metadata: metadata,
            chartConfiguration: {
                filter: {
                    defaults: []
                }
            }
        }
        const node = document.querySelector('.profile-indicator');
        let chart = new Chart(parent, config, newdata, [], node, "TEST", "this is chart attribution");
        await new Promise(resolve => setTimeout(resolve, 1000));
        // set up filter for gender
        chart.applyFilter({"ZA": data}, {"gender": "male"});
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect(chart.vegaView.signal('genderFilter')).toBe(true);
        expect(chart.vegaView.signal('genderFilterValue')).toBe("male");
        expect(chart.vegaView.signal('ageFilter')).toBe(false);
        expect(chart.vegaDownloadView.signal('filters')).toBe('Gender: male, ');

        // change filter from gender to age to check if spec change
        await new Promise(resolve => setTimeout(resolve, 1000));
        chart.applyFilter({"ZA": data}, {"age": 15});
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect(chart.vegaView.signal('ageFilter')).toBe(true);
        expect(chart.vegaView.signal('ageFilterValue')).toBe(15);
        expect(chart.vegaView.signal('genderFilter')).toBe(false);
        expect(chart.vegaDownloadView.signal('filters')).toBe('Age: 15, ');
    });

    test('Test to check if empty chart can be downloaded', async () => {
      let annotations = {
          'title': 'Population',
          'geography': 'South Africa',
          'attribution': 'Profile config attribution',
          'graphValueType': 'Percentage'
      }
      let vegaDownloadSpec = configureBarchartDownload([], metadata, config, annotations);
      let view = renderVegaHeadless(vegaDownloadSpec);
      await view.runAsync()

      expect(view.signal('title')).toBe('Population');
      expect(view.signal('source')).toBe('Source : Census 2021');
      expect(view.signal('geography')).toBe('South Africa');
      expect(view.signal('attribution').toString()).toBe('Profile config attribution');
    });

    test('Test to check null metadata source', async () => {
      let annotations = {
          'title': 'Population',
          'geography': 'South Africa',
          'attribution': 'Profile config attribution',
          'graphValueType': 'Percentage'
      }
      metadata["source"] = null;
      let vegaDownloadSpec = configureBarchartDownload([], metadata, config, annotations);
      let view = renderVegaHeadless(vegaDownloadSpec);
      await view.runAsync()
      expect(view.signal('source')).toBe('');
    });

    test('Test to check undefined metadata source', async () => {
      let annotations = {
          'title': 'Population',
          'geography': 'South Africa',
          'attribution': 'Profile config attribution',
          'graphValueType': 'Percentage'
      }
      metadata["source"] = undefined;
      let vegaDownloadSpec = configureBarchartDownload([], metadata, config, annotations);
      let view = renderVegaHeadless(vegaDownloadSpec);
      await view.runAsync()
      expect(view.signal('source')).toBe('');
    });

    test('Test to check valid metadata source', async () => {
      let annotations = {
          'title': 'Population',
          'geography': 'South Africa',
          'attribution': 'Profile config attribution',
          'graphValueType': 'Percentage'
      }
      let metadata = {
        source: "test",
        primary_group: 'age',
        groups: [ { name: 'age' } ]
      }
      let vegaDownloadSpec = configureBarchartDownload([], metadata, config, annotations);
      let view = renderVegaHeadless(vegaDownloadSpec);
      await view.runAsync()
      expect(view.signal('source')).toBe('Source : test');
    });
});
