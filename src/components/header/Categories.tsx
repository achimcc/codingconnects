import { graphql, Link, StaticQuery } from 'gatsby';
import React from 'react';
import { css } from '@emotion/react';
import { FixedObject } from 'gatsby-image';

import config from '../../website-config';

export const Categories = () => {
  const menuLinks = ['one', 'two', 'three'];
  return (
    <ul css={CategoryStyles}>
      <li css={CategoryDropdownStyles} key="Categories">
        <a css={CategoryLink} href={`/categories/`} aria-haspopup={menuLinks?.length > 0}>
          Categories
        </a>
        {menuLinks && menuLinks.length > 0 ? (
          <ul css={CategoryListStyles} aria-label="submenu">
            {menuLinks.map(link => (
              <li css={CategoryMenuLink} key={link}>
                <a css={CategoryMenuText} href={link}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </li>
    </ul>
  );
};

const CategoryStyles = css`
  z-index: 500;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const CategoryDropdownStyles = css`
  z-index: 500;
  color: white;
  display: block;
  float: left;
  padding: 1rem;
  position: relative;
  transition-duration: 0.5s;
  :hover {
    cursor: pointer;
  }
  :hover > ul {
    visibility: visible;
    opacity: 1;
    display: block;
  }
`;

const CategoryLink = css`
  z-index: 500;
  color: white;
  text-decoration: none;
`;

const CategoryListStyles = css`
  z-index: 500;
  list-style: none;
  visibility: hidden;
  opacity: 0;
  display: none;
  min-width: 8rem;
  position: absolute;
  transition: all 0.5s ease;
  margin-top: 0;
  left: 0;
  :hover {
    visibility: visible;
    opacity: 1;
    display: block;
  }
`;

const CategoryMenuLink = css`
  z-index: 500;
  clear: both;
  width: 100%;
  padding: 1rem;
  :hover {
  }
`;

const CategoryMenuText = css`
  z-index: 500;
  color: white;
  text-decoration: none;
`;
