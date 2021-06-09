import {Server} from "miragejs";

export function makeServer({environment = "development"} = {}) {
    let server = new Server({
        environment,

        seeds(server) {
            server.db.loadData({
                themes: [],
                boundaries: [],
                groups: [
                              {
                                  subindicators: ["male", "female"],
                                  dataset: 1,
                                  name: "gender",
                                  can_filter: true,
                                  can_aggregate: true
                              },
                              {
                                subindicators: ["isiXhosa", "female"],
                                dataset: 1,
                                name: "language",
                                can_filter: true,
                                can_aggregate: true
                            }],
                indicators: [
                    { data:
                            [{
                                "Gender": "Male",
                                "count": 56.0752646,
                                "Age Group": "0-4",
                                "population group": "Black african",
                                "province of birth": "Western cape",
                                "summation options": "Person Weight"
                            },
                                {
                                    "Gender": "Male",
                                    "count": 396.4119609,
                                    "Age Group": "0-4",
                                    "population group": "Black african",
                                    "province of birth": "Eastern cape",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "Gender": "Male",
                                    "count": 20.5116377,
                                    "Age Group": "0-4",
                                    "population group": "Black african",
                                    "province of birth": "Northern cape",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "Gender": "Male",
                                    "count": 32.0746688,
                                    "Age Group": "0-4",
                                    "population group": "Black african",
                                    "province of birth": "Free state",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "Gender": "Male",
                                    "count": 5000.0746688,
                                    "Age Group": "10-14",
                                    "population group": "Black african",
                                    "province of birth": "Free state",
                                    "summation options": "Person Weight"
                                }
                            ],
                    }
                ]
            });
        },

        //API needs to send the data for the children of the current geo only.

        routes() {
            this.urlPrefix = 'https://staging.wazimap-ng.openup.org.za/';
            this.namespace = "api/v1";
            this.timing = 750;

            this.get("/all_details/profile/:profile/geography/:geo", (schema, request) => {
               return {
                   "themes": [],
                   "boundary": {
                     "type": "Feature",
                     "geometry": { "type": "Point", "coordinates": [1,2] },
                     "properties": {
                       "level": "country",
                       "code": "ZA"
                     }
                   },
                 "children":{
                   "province": {
                     "type": "FeatureCollection",
                     "features": [
                     {
                       "type": "Feature",
                       "geometry": { "type": "Point", "coordinates": [1,2] },
                       "properties": {
                         "code": "GA",
                         "parent": "ZA",
                       }
                     }
                     ]
                   }
                 },
                   "parent_layers": [],
                   "profile": {
                     "logo": { "image": "", "url": "/" },
                     "highlights": [ ],
                     "overview": {
                       "name": "Youth Explorer",
                       "description": ""
                     },
                       "geography": { "name": "South Africa", "code": "ZA", "level": "country", "version": "2011 Boundaries", "parents": [] },
                       "profile_data": {
                         "Demographics": {
                           "description": "Age, race, language, citizenship, & migration",
                           "subcategories": {
                             "Population": { "description": "Age and race details of the youth population",
                               "indicators": {
                                 "Population by age group": {
                                   "description": "",
                                   "choropleth_method": "subindicator",
                                   "data": data.data,
                                   "metadata": {
                                     "source": "StatsSA Census 2011", 
                                     "description": "", "url": null,
                                     "licence": { "name": null, "url": null },
                                     "primary_group": "gender",
                                     "groups": schema.db.groups,
                                   },
                                   "chart_configuration": { "defaultType": "Value", "types": { "Value": { "formatting": ",.0f" }, "Percentage": { "maxX": 1, "minX": 0 } } },
                                    child_data: { "GA": data.data },
                                 }
                               }
                             }
                           }
                         }
                       }
                     }
                   }
              });

              this.get("/profile/:profile_id/geography/:geography_code/indicator/:profile_indicator_id/", (schema, request) => {
                  let id = request.params.profile_indicator_id

                  let data = schema.db.indicators.find(id);
                  let groups = schema.db.groups;
                  return {
                      metadata: {
                          primary_group: "gender",
                          groups: groups,
                    },
                    child_data: { "FS": data.data },
                }
            });

            this.passthrough()
        }
    });
    window.server = server;
    return server;
}
