import React from 'react';
import { css } from '@emotion/react';
import { darken } from 'polished';
import { colors } from '../../styles/colors';

export interface MenuItem {
  title: string;
  path: string;
}

export interface DropDownProps {
  menuItems: Array<MenuItem>;
}

export const DropDown: React.FC<DropDownProps> = ({ menuItems }) => (
  <ul css={CategoryStyles}>
    <li css={CategoryDropdownStyles} key="Categories">
      <a css={CategoryLink} aria-haspopup={menuItems?.length > 0}>
        Categories
      </a>
      {menuItems && menuItems.length > 0 ? (
        <ul css={CategoryListStyles} aria-label="submenu">
          {menuItems.map(item => (
            <li css={CategoryMenuLink} key={item.title}>
              <a css={CategoryMenuText} href={item.path}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  </ul>
);

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
  background: ${darken('0.05', colors.darkgrey)};
  opacity: 0;
  display: none;
  min-width: 14rem;
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
