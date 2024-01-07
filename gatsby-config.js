/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
    siteMetadata: {
        title: `Driver's license test Buenos Aires`,
        siteUrl: `https://driver.bogomolov.tech`
    },
    plugins: [
        "gatsby-plugin-postcss",
        "gatsby-plugin-image",
        {
            resolve: "gatsby-plugin-google-gtag",
            options: {
                trackingIds: [
                    "G-J494BF3XT3"
                ],
            },
        }, {
            resolve: 'gatsby-plugin-manifest',
            options: {
                "icon": "src/images/icon.png"
            }
        },
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                "name": "images",
                "path": "./src/images/"
            },
            __key: "images"
        },
    ]
};
