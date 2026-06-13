/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
    // Build pages as flat `/category-a.html` (no trailing slash) so they match the
    // slash-less internal <Link> targets. Otherwise Gatsby 5's default ("always")
    // builds `/category-a/` and the client router can't match `/category-a`, falling
    // back to a full-page reload on navigation.
    trailingSlash: "never",
    siteMetadata: {
        title: `Driver's license test Buenos Aires`,
        siteUrl: `https://driver.bogomolov.tech`
    },
    plugins: [
        "gatsby-plugin-postcss",
        "gatsby-plugin-image",
        "gatsby-plugin-sitemap",
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
