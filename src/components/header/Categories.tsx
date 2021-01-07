import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { DropDown, MenuItem } from './DropDown';

import _ from 'lodash';

export const Categories: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(filter: { frontmatter: { category: { ne: null } } }) {
        edges {
          node {
            frontmatter {
              category
            }
          }
        }
      }
    }
  `);
  const categories = _.uniq(
    _.flatten(
      data?.allMdx?.edges.map((edge: any) => {
        return _.castArray(_.get(edge, 'node.frontmatter.category', ''));
      }),
    ),
  );
  const menuItems: Array<MenuItem> = categories.map(category => ({
    title: category as string,
    path: `/categories/${_.kebabCase(category as string)}/`,
  }));
  return <DropDown menuItems={menuItems} />;
};
