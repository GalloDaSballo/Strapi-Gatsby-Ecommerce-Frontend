import { useStaticQuery, graphql } from "gatsby"
const data = useStaticQuery(graphql`
query SiteApiUrlQuery {
  site {
    siteMetadata {
      apiUrl
    }
  }
}
`)
export const API_URL = data.site.siteMetadata.apiUrl