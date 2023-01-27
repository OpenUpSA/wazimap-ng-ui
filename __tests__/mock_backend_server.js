/* Mock backend server so that the server-side get_profile_by_url can be satisfied
  with a mock rather than production API request. The client-side part of the GUI
  tests are mocked within cypress. */

const express = require('express');
var morgan = require('morgan');

const app = express();

app.use(morgan('short')); // Basic HTTP request logging

function profile_by_url(req, res, next) {
  res.json({
    "id": 123,
    "name": "Mock Backend Profile",
    "permission_type": "public",
    "requires_authentication": false,
    "geography_hierarchy": {
      "id": 1,
      "name": "2011 and 2016 SA Boundaries with hexagons",
      "root_geography": {
        "name": "South Africa",
        "code": "ZA",
        "level": "country"
      },
      "description": "",
      "configuration": {
        "versions": [
          "2011 Boundaries",
        ],
        "default_version": "2011 Boundaries"
      }
    },
    "description": "",
    "configuration": {
      "urls": [
        "localhost",
      ],
      "preferred_children": {
        "country": [
          "province"
        ],
        "district": [
          "municipality",
          "mainplace",
          "ward",
          "equal area hexagon"
        ],
        "province": [
          "district",
          "municipality"
        ],
        "mainplace": [
          "subplace"
        ],
        "municipality": [
          "mainplace",
          "ward"
        ]
      }
    }
  });
};

app.get('/api/v1/profile_by_url/', profile_by_url);

app.listen(4321);
