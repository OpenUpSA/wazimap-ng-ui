import {Server} from "miragejs";

export function makeServer({environment = "development"} = {}) {
    let server = new Server({
        environment,

        seeds(server) {
            server.db.loadData({
                themes: [],
                boundaries: [],
                indicators: [
                    {
                        data: {
                            "GT": [{
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
                            "FS": [{
                                "Gender": "Male",
                                "count": 12.0752646,
                                "Age Group": "0-4",
                                "population group": "Black african",
                                "province of birth": "Western cape",
                                "summation options": "Person Weight"
                            },
                                {
                                    "Gender": "Male",
                                    "count": 112.4119609,
                                    "Age Group": "0-4",
                                    "population group": "Black african",
                                    "province of birth": "Eastern cape",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "Gender": "Male",
                                    "count": 20.5116377,
                                    "Age Group": "10-14",
                                    "population group": "Black african",
                                    "province of birth": "Northern cape",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "Gender": "Male",
                                    "count": 48.0746688,
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
                            "NW": [{
                                "Gender": "Male",
                                "count": 172.0752646,
                                "Age Group": "0-4",
                                "population group": "Black african",
                                "province of birth": "Western cape",
                                "summation options": "Person Weight"
                            },
                                {
                                    "Gender": "Female",
                                    "count": 32.4119609,
                                    "Age Group": "0-4",
                                    "population group": "Black african",
                                    "province of birth": "Eastern cape",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "Gender": "Male",
                                    "count": 20.5116377,
                                    "Age Group": "10-14",
                                    "population group": "Black african",
                                    "province of birth": "Northern cape",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "Gender": "Male",
                                    "count": 87.0746688,
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
                            ]
                        }
                    }
                ]
            });
        },

        //API needs to send the data for the children of the current geo only.

        routes() {
            this.urlPrefix = 'https://staging.wazimap-ng.openup.org.za/';
            this.namespace = "api/v1";
            this.timing = 750;

            this.get("/profile/:profile_id/geography/:geography_code/indicator/:profile_indicator_id/", (schema, request) => {
                let id = request.params.profile_indicator_id

                let data = schema.db.indicators.find(id);
                return {
                    metadata: {
                        primary_group: "age",
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
                            }
                        ]
                    },
                    child_data: data.data,
                }
            });

            this.passthrough()
        }
    });
    window.server = server;
    return server;
}
