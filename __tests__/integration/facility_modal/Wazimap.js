import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";

Then('I wait until map is ready', () => {
    cy.get('.location-tag .location-tag__name .truncate', {timeout: 20000}).should('contain', 'South Africa')
})

When('I click on a theme', () => {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1').first().click();
})

Then('categories should be displayed', () => {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1 .point-mapper__h1_content').should('be.visible');
})

When('I click on a category', () => {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1 .point-mapper__h1_content .point-mapper__h2_wrapper .point-mapper__h2').first().click();

    cy.intercept('/api/v1/profile/8/points/category/379/points/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: points,
            forceNetworkError: false // default
        })
    })
})

Then('I wait for 2s', () => {
    cy.wait(2000);
})

When('I click on a marker', () => {
   
})

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