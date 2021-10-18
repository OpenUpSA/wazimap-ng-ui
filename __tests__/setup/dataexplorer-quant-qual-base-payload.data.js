export default {
  geometries: {
    children: {
      "province": {
        "type": "FeatureCollection",
        "features": []
      }
    }
  },
  profile: {
    profileData: {
      "Demo category": {
        "description": "",
        "subcategories": {
          "Demo subcategory": {
            "description": "",
            "indicators": {
              "Qualitative indicator": {
                "id": 1,
                "description": "",
                "choropleth_method": "subindicator",
                "metadata": {
                  "source": null,
                  "description": null,
                  "url": null,
                  "licence": {
                    "name": null,
                    "url": null
                  },
                  "primary_group": "content",
                  "groups": [
                    {
                      "subindicators": [
                        "Qualitative test EC",
                        "Qualitative test ZA"
                      ],
                      "dataset": 1,
                      "name": "content",
                      "can_aggregate": true,
                      "can_filter": true
                    }
                  ]
                },
                //"content_type": "indicator",
                //"dataset_content_type": "quantitative",
                "content_type": "html",
                "dataset_content_type": "qualitative",
                "data": [
                  {
                    "content": "Qualitative test ZA"
                  }
                ],
                "child_data": {
                  "EC": [
                    {
                      "content": "Qualitative test EC"
                    }
                  ]
                },
                "type": "indicator",
                "groups": []
              }
            }
          }
        }
      }
    }
  }
};
