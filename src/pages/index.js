import React from "react"

import {graphql, Link} from 'gatsby'
import Img from 'gatsby-image'

import Layout from "../components/layout"
import SEO from "../components/seo"

import {formatPrice} from '../utils/format'
import {fromProductSlugToUrl} from '../utils/products'

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    <h2>Shop</h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridGap: '20px'
    }}>
      {data.allStrapiProduct.nodes.map(product => (
        <Link
          style={{
            color: '#000000',
            textDecoration: 'none'
          }}
          to={fromProductSlugToUrl(product.slug)}
        >
          <div>
            <div>
              <Img fixed={product.thumbnail.childImageSharp.fixed} />
            </div>
            <h3 style={{marginBottom: 0}}>{product.name}</h3>
            {formatPrice(product.price_in_cent)}
          </div>
        </Link>
      ))}
    </div>
  </Layout>
)

export default IndexPage

export const pageQuery = graphql`
  query MyQuery {
    allStrapiProduct {
      nodes {
        id
        description
        created_at
        name
        price_in_cent
        strapiId
        slug
        thumbnail {
          childImageSharp {
            fixed(width: 200, height: 200) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`
