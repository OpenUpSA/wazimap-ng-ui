import { Server  } from "miragejs";

export function makeServer({ environment = "development"  } = {}) {
  let server = new Server({
        environment,

    seeds(server) {
      server.db.loadData({
        themes: [
        ],
        boundaries: [

        ],
        indicators: [
          { data: [
            {"age":"15-19","race":"Black african","count":"3599.3753699998","gender":"Female","language":"Afrikaans"},
            {"age":"15-19","race":"Black african","count":"8665.81757999899","gender":"Female","language":"English"},
            {"age":"15-19","race":"Black african","count":"689.044740000004","gender":"Female","language":"Isindebele"},
            {"age":"15-19","race":"Black african","count":"288126.247378975","gender":"Female","language":"Isixhosa"},
            {"age":"15-19","race":"Black african","count":"1580.03236000003","gender":"Female","language":"Isizulu"},
            {"age":"15-19","race":"Black african","count":"481.094529999998","gender":"Female","language":"Other"},
            {"age":"15-19","race":"Black african","count":"852.672980000009","gender":"Female","language":"Sepedi"},
            {"age":"15-19","race":"Black african","count":"9004.21762999894","gender":"Female","language":"Sesotho"},
            {"age":"15-19","race":"Black african","count":"497.376719999998","gender":"Female","language":"Setswana"},
            {"age":"15-19","race":"Black african","count":"2371.97078","gender":"Female","language":"Sign language"},
            {"age":"15-19","race":"Black african","count":"74.68626","gender":"Female","language":"Siswati"},
            {"age":"15-19","race":"Black african","count":"136.13609","gender":"Female","language":"Tshivenda"},
            {"age":"15-19","race":"Black african","count":"74.79752","gender":"Female","language":"Xitsonga"},
            { "age": "15-24 (Intl)", "race": "Indian or asian", "count": "344.09527", "gender": "Male", "language": "Sepedi" },
            { "age": "15-24 (Intl)", "race": "Indian or asian", "count": "481.354600000001", "gender": "Male", "language": "Sesotho" },
            { "age": "15-24 (Intl)", "race": "Indian or asian", "count": "509.12947", "gender": "Male", "language": "Setswana" },
            { "age": "15-24 (Intl)", "race": "Indian or asian", "count": "350.68013", "gender": "Male", "language": "Sign language" }
          ]
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
              { subindicators: ["male", "female"],
                dataset: 1,
                name: "gender",
                can_filter: True,
                can_aggregate: True
              },
              { subindicators: ["isiXhosa", "female"],
                dataset: 1,
                name: "language",
                can_filter: True,
                can_aggregate: True
              }
            ]
          },
          data: data.data,
        }
      });

      this.passthrough()
    }
  });
  window.server = server;
  return server;
}
