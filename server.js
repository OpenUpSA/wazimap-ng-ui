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
                                "sex": "Male",
                                "count": 56.0752646,
                                "age group": "00-04",
                                "population group": "Black african",
                                "province of birth": "Western cape",
                                "summation options": "Person Weight"
                            },
                                {
                                    "sex": "Male",
                                    "count": 396.4119609,
                                    "age group": "00-04",
                                    "population group": "Black african",
                                    "province of birth": "Eastern cape",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "sex": "Male",
                                    "count": 20.5116377,
                                    "age group": "00-04",
                                    "population group": "Black african",
                                    "province of birth": "Northern cape",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "sex": "Male",
                                    "count": 32.0746688,
                                    "age group": "00-04",
                                    "population group": "Black african",
                                    "province of birth": "Free state",
                                    "summation options": "Person Weight"
                                },
                                {
                                    "sex": "Male",
                                    "count": 5000.0746688,
                                    "age group": "10-14",
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
