export default {
    "Demo category": {
        "description": "",
        "order": 1,
        "id": 1,
        "subcategories": {
            "Demo subcategory": {
                "description": "",
                "order": 1,
                "id": 1,
                "indicators": {
                    "Qualitative indicator": {
                        "id": 1,
                        "order": 1,
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
                        "content_type": "html",
                        "dataset_content_type": "qualitative",
                        "data": {
                            "EC": [
                                {
                                    "content": "Qualitative test EC"
                                }
                            ]
                        },
                        "type": "indicator",
                        "groups": []
                    },
                    "Quantitative indicator": {
                      "id": 1010,
                      "order": 2,
                      "label": "Quantitative indicator",
                      "description": "",
                      "choropleth_method": "subindicator",
                      "metadata": {
                        "source": "IEC",
                        "description": "",
                        "licence": {
                          "name": "other",
                          "url": null
                        },
                        "primary_group": "age category",
                        "groups": [
                          {
                            "subindicators": [
                              "18-19",
                              "20-29",
                              "30-39",
                              "40-49",
                              "50-59",
                              "60-69",
                              "70-79",
                              "80+"
                            ],
                            "dataset": 1209,
                            "name": "age category",
                            "can_aggregate": true,
                            "can_filter": true
                          },
                          {
                            "subindicators": [
                              "Female",
                              "Male"
                            ],
                            "dataset": 1209,
                            "name": "gender",
                            "can_aggregate": true,
                            "can_filter": true
                          }
                        ]
                      },
                      "content_type": "indicator",
                      "dataset_content_type": "quantitative",
                      "version": "2016 demarcation",
                      "chart_configuration": {
                        "types": {
                          "Value": {
                            "formatting": ","
                          }
                        }
                      }
                    },
                }
            }
        }
    }
};
