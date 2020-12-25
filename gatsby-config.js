/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: 'Coding Connects',
    description: 'A Blog about Coding in TypeScript and the life in Berlin',
    siteUrl: 'https://codingconnects.com', // full path to blog - no ending slash
  },
  mapping: {
    'Mdx.frontmatter.author': 'AuthorYaml',
  },
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaultQuality: 100,
        stripMetadata: true,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: path.join(__dirname, 'src', 'content'),
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 800,
              height: 400
            }
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem',
            },
          },
          'gatsby-remark-copy-linked-files',
          // 'gatsby-remark-abbr', removed, didn't work together with mdx plugin!
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-mermaid',
            options: {
              language: 'mermaid',
              theme: 'neutral',
              viewport: {
                  width: 200,
                  height: 200
              },
              mermaidOptions: {
                  themeCSS: ""
              }
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 2000,
              quality: 100,
            },
          },
          'gatsby-remark-prismjs',
        ],
      },
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://codingconnects.com',
      },
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-emotion',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-plugin-feed-mdx',
      options: {
        query: `
          {
            site {
              siteMetadata {
                site_url: url
                title
                description: subtitle
              }
            }
          }
        `,
        feeds: [{
          serialize: ({ query: { site, allMdx } }) => (
            allMdx.edges.map((edge) => ({
              ...edge.node.frontmatter,
              excerpt: edge.node.frontmatter.excerpt,
              date: edge.node.frontmatter.date,
              url: site.siteMetadata.site_url + '/' + edge.node.fields.slug,
              guid: site.siteMetadata.site_url + '/' + edge.node.fields.slug,
              custom_elements: [{ 'content:encoded': edge.node.body }]
            }))
          ),
          query: `
              {
                allMdx(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      body
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        layout
                        draft
                        excerpt
                      }
                    }
                  }
                }
              }
            `,
          output: '/rss.xml',
          title: 'Coding Connects'
        }]
      }
    },
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [require('postcss-color-function'), require('cssnano')()],
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'G-G0GMTN0BVG',
        // Puts tracking script in the head instead of the body
        head: true,
        // IP anonymization for GDPR compliance
        anonymize: true,
        // Disable analytics for users with `Do Not Track` enabled
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ['/preview/**'],
        // Specifies what percentage of users should be tracked
        sampleRate: 100,
        // Determines how often site speed tracking beacons will be sent
        siteSpeedSampleRate: 10,
      },
    },
    'gatsby-plugin-cname',
  ],
};
