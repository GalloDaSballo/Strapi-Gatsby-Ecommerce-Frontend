/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path')

const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
    resolve(
        graphql(request).then(result => {
            if(result.errors){
                reject(result.errors)
            }

            return result
        })
    )
})

exports.createPages = ({actions, graphql}) => {
    const {createPage} = actions

    const generateProductPages = makeRequest(graphql, `
        {
            allStrapiProduct {
                edges {
                    node {
                        id
                        slug
                    }
                }
            }
        }
    `).then(result => {
        result.data.allStrapiProduct.edges.forEach(({node}) => {
            createPage({
                path: `/products/${node.slug}`,
                component: path.resolve(`src/templates/product.js`),
                context: {
                    id: node.id
                }
            })
        })
    })

    return Promise.all([generateProductPages])
}