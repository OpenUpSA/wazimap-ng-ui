import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";

Given('I am on the Wazimap Homepage', () => {
    cy.visit("/")

    cy.intercept('/api/v1/profile_by_url/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: profile,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile/8/points/themes/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: themes,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile/8/points/category/379/points/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: points,
            forceNetworkError: false // default
        })
    })
})

const profile = {
    "id": 8,
    "name": "Profile name",
    "permission_type": "public",
    "requires_authentication": false,
    "geography_hierarchy": {
        "id": 1,
        "name": "2011 SA Boundaries",
        "root_geography": {
            "name": "South Africa",
            "code": "ZA",
            "level": "country",
            "version": "2011 Boundaries"
        },
        "description": ""
    },
    "description": "",
    "configuration": {
        "urls": [
            "example.com"
        ],
        "default_panel": "point_data",
        "tutorial": [
            {
                "body": "body A",
                "image": "https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-1.png",
                "title": "Title A:"
            },
            {
                "body": "Body B",
                "image": "https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-2.png",
                "title": "Title B:"
            },
            {
                "body": "Body C",
                "image": "https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-3.png",
                "title": "Title C:"
            },
            {
                "body": "body d",
                "image": "https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-4.png",
                "title": "title d"
            },
            {
                "body": "body e",
                "image": "https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-5.png",
                "title": "title e:"
            },
            {
                "body": "body f",
                "image": "https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-6.png",
                "title": "title f"
            },
            {
                "body": "body g",
                "image": "https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-7.png",
                "title": "title g"
            },
            {
                "body": "body h",
                "image": "https://wazimap-ng.s3-eu-west-1.amazonaws.com/africa-data-hub/wazi-tut-8.png",
                "title": "title h"
            }
        ]
    }
}

const themes = [
    {
        "id": 53,
        "categories": [
            {
                "id": 379,
                "name": "TVET colleges",
                "description": "Modi non dolorem sed velit ut amet. Amet ut porro voluptatem sed. Velit modi modi quaerat adipisci quaerat eius modi. Dolore tempora sed consectetur porro voluptatem tempora adipisci. Sed dolor est magnam etincidunt modi quiquia magnam.",
                "theme": {
                    "id": 53,
                    "name": "Higher Education",
                    "icon": "account_balance"
                },
                "metadata": {
                    "source": "",
                    "description": "Voluptatem dolorem eius voluptatem dolore dolorem numquam numquam. Dolor est ut non. Est porro voluptatem dolore. Numquam quaerat magnam dolor. Quaerat tempora dolore quisquam.",
                    "licence": null
                },
                "color": "",
                "visible_tooltip_attributes": []
            },
            {
                "id": 380,
                "name": "Universities of technology",
                "description": "Dolorem quaerat adipisci voluptatem ut modi. Labore porro dolore voluptatem. Numquam ut sed labore aliquam voluptatem tempora. Consectetur ut non sed quisquam sed. Aliquam numquam ut est. Numquam dolore aliquam magnam voluptatem labore quisquam. Magnam consectetur quiquia ut quaerat. Adipisci sed dolor consectetur magnam labore eius. Tempora magnam modi eius dolore labore quisquam dolore. Tempora etincidunt sed etincidunt.",
                "theme": {
                    "id": 53,
                    "name": "Higher Education",
                    "icon": "account_balance"
                },
                "metadata": {
                    "source": "",
                    "description": "Ut adipisci adipisci neque consectetur porro. Amet etincidunt quaerat dolor sed porro. Neque consectetur neque modi amet modi. Tempora neque aliquam etincidunt. Tempora amet ut dolor. Quaerat aliquam magnam sit dolor. Sed tempora amet dolor est. Non ipsum modi quaerat eius.",
                    "licence": null
                },
                "color": "",
                "visible_tooltip_attributes": []
            },
            {
                "id": 382,
                "name": "Universities",
                "description": "Labore ipsum magnam tempora. Aliquam velit quisquam tempora dolorem quiquia dolore magnam. Porro velit quaerat est dolorem porro ut. Modi dolor porro sit neque quisquam. Consectetur labore sed numquam dolorem adipisci. Labore amet velit adipisci. Etincidunt est quiquia eius velit. Porro ipsum porro ut. Etincidunt porro numquam eius dolorem neque dolorem tempora.",
                "theme": {
                    "id": 53,
                    "name": "Higher Education",
                    "icon": "account_balance"
                },
                "metadata": {
                    "source": "",
                    "description": "Dolore sit etincidunt eius adipisci voluptatem. Quaerat adipisci voluptatem sed non consectetur. Neque modi labore quaerat magnam. Ipsum amet sed etincidunt dolorem sed magnam numquam. Dolor consectetur dolor adipisci sit sit magnam sed. Modi non quaerat dolore modi dolor neque.",
                    "licence": null
                },
                "color": "",
                "visible_tooltip_attributes": []
            }
        ],
        "created": "2020-09-17T15:33:48+0000",
        "updated": "2021-06-01T15:35:14+0000",
        "name": "Higher Education",
        "icon": "account_balance",
        "order": 10,
        "profile": 8
    },
    {
        "id": 7,
        "categories": [
            {
                "id": 394,
                "name": "Additional DEL facilities (unverified)",
                "description": "Voluptatem quiquia quiquia est voluptatem quisquam quiquia. Quaerat etincidunt porro sed. Non modi sed quisquam est ut non ut. Non magnam neque voluptatem consectetur ipsum. Dolor numquam non quiquia velit dolorem sed quiquia. Sed etincidunt numquam aliquam dolor. Amet quiquia etincidunt adipisci. Magnam adipisci aliquam numquam ipsum eius consectetur.",
                "theme": {
                    "id": 7,
                    "name": "Labour",
                    "icon": "work"
                },
                "metadata": {
                    "source": "",
                    "description": "Neque amet non quiquia dolorem aliquam. Labore dolor dolor labore. Dolor sit etincidunt sed neque magnam non porro. Quaerat modi voluptatem etincidunt. Eius dolore tempora dolorem etincidunt modi porro dolore. Quaerat dolorem sed quiquia non aliquam. Etincidunt dolor amet ipsum quiquia modi porro. Porro dolorem sit magnam. Neque consectetur neque sit sed sit magnam velit.",
                    "licence": null
                },
                "color": "",
                "visible_tooltip_attributes": []
            },
            {
                "id": 384,
                "name": "Thusong centres (unverified)",
                "description": "Quisquam porro est labore. Etincidunt quisquam sit sit. Ipsum ut porro non velit consectetur dolore. Sed sit porro tempora quisquam est. Adipisci etincidunt voluptatem magnam neque adipisci porro. Neque voluptatem modi neque porro ut. Tempora voluptatem amet dolor labore dolore. Dolorem ut neque ipsum numquam. Quiquia adipisci eius tempora.",
                "theme": {
                    "id": 7,
                    "name": "Labour",
                    "icon": "work"
                },
                "metadata": {
                    "source": "",
                    "description": "Neque eius porro tempora etincidunt magnam etincidunt. Velit dolor dolorem etincidunt eius quiquia magnam quisquam. Ut sit dolor dolor. Quaerat sed amet eius est velit amet neque. Ut est dolore labore dolor tempora. Porro etincidunt quisquam etincidunt dolorem dolorem magnam. Est quisquam adipisci modi non tempora. Est amet velit quaerat. Sed ipsum neque labore non. Dolor tempora numquam consectetur velit neque.",
                    "licence": null
                },
                "color": "",
                "visible_tooltip_attributes": []
            },
            {
                "id": 566,
                "name": "Labour centres",
                "description": "Non quisquam porro magnam dolorem. Tempora consectetur quaerat dolore aliquam sit ut. Sit neque velit consectetur porro. Ut aliquam ut amet numquam dolore dolorem est. Neque est magnam neque amet numquam amet. Sed est est est magnam eius. Sit modi porro est ipsum consectetur adipisci. Quisquam dolorem ut quisquam neque dolor dolorem eius.",
                "theme": {
                    "id": 7,
                    "name": "Labour",
                    "icon": "work"
                },
                "metadata": {
                    "source": "",
                    "description": "",
                    "licence": null
                },
                "color": "",
                "visible_tooltip_attributes": []
            }
        ],
        "created": "2020-07-16T06:47:40+0000",
        "updated": "2021-06-01T15:35:14+0000",
        "name": "Labour",
        "icon": "work",
        "order": 14,
        "profile": 8
    },
]

const points = {
    "type":"FeatureCollection",
    "features":[
        {
            "id":441633,
            "type":"Feature",
            "geometry":{
                "type":"Point",
                "coordinates":[
                    31.647953,
                    -27.89883
                ]
            },
            "properties":{
                "data":[
                    {
                        "key":"campus",
                        "value":"Nongoma"
                    },
                    {
                        "key":"phone number",
                        "value":"0358310358"
                    },
                    {
                        "key":"email address",
                        "value":"campushead@nongoma.co.za"
                    },
                    {
                        "key":"institution type",
                        "value":"TVET"
                    },
                    {
                        "key":"physical address",
                        "value":"Nongoma Main Road Nongoma"
                    }
                ],
                "name":"Mthashana FET College (A)",
                "url":null,
                "image":null
            }
        },
        {
            "id":441479,
            "type":"Feature",
            "geometry":{
                "type":"Point",
                "coordinates":[
                    27.899702,
                    -33.000501
                ]
            },
            "properties":{
                "data":[
                    {
                        "key":"campus",
                        "value":"King Street Campus"
                    },
                    {
                        "key":"phone number",
                        "value":"0437049201"
                    },
                    {
                        "key":"email address",
                        "value":"ceo@bccollege.co.za"
                    },
                    {
                        "key":"institution type",
                        "value":"TVET"
                    },
                    {
                        "key":"physical address",
                        "value":"King Street Southernwood East London "
                    }
                ],
                "name":"Buffalo City FET College (C)",
                "url":null,
                "image":null
            }
        }
    ]
}