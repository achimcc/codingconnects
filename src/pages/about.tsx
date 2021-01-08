import React from 'react';
import { Helmet } from 'react-helmet';

import { css } from '@emotion/react';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { PostFullContent } from '../components/PostContent';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import {
  inner,
  outer,
  SiteArchiveHeader,
  SiteHeader,
  SiteMain,
  SiteNavMain,
} from '../styles/shared';
import { NoImage, PostFull, PostFullHeader, PostFullTitle } from '../templates/post';
import { colors } from '../styles/colors';
import Achim from './img/achim-siurana.jpg';

const PageTemplate = css`
  .site-main {
    margin-top: 64px;
    padding-bottom: 4vw;
    background: #fff;
  }

  .photo {
    max-width: 100%;
    margin-bottom: 0.3vw;
  }

  @media (prefers-color-scheme: dark) {
    .site-main {
      /* background: var(--darkmode); */
      background: ${colors.darkmode};
    }
  }
`;

const About: React.FC = () => (
  <IndexLayout>
    <Helmet>
      <title>About</title>
    </Helmet>
    <Wrapper css={PageTemplate}>
      <header className="site-archive-header no-image" css={[SiteHeader, SiteArchiveHeader]}>
        <div css={[outer, SiteNavMain]}>
          <div css={inner}>
            <SiteNav isHome={false} />
          </div>
        </div>
      </header>
      <main id="site-main" className="site-main" css={[SiteMain, outer]}>
        <div css={inner}>
          <article className="post page" css={[PostFull, NoImage]}>
            <PostFullHeader className="post-full-header">
              <PostFullTitle className="post-full-title">About Me</PostFullTitle>
            </PostFullHeader>

            <PostFullContent className="post-full-content">
              <div className="post-content">
                <p>
                  I’m Achim Schneider, a Software Developer and tech enthusiast from Berlin. I’m
                  interested in how technology interacts with society. And how it affects society
                  towards the future. I try to improve on Blockchain, IOT and AI/Machine Learning
                  Applications of tech.
                </p>
                <p>
                  <figure>
                    <img src={Achim} className="photo" />
                    <figcaption>Me, on climbing vacation in Siurana, Spain.</figcaption>
                  </figure>
                </p>
                <p>
                  I created this Blog because I enjoy coding and I’m always keen about learning new
                  things. I programmed it in TypeScript with Gatsby. A begun with a{' '}
                  <a href="https://github.com/scttcper/gatsby-casper">Gatsby Starter</a>
                  &nbsp; and I am gradually transforming it into something which fits my custom
                  needs and ideas.
                </p>
                <p>
                  I named it Coding Connects which relates to my talent of finding connections
                  between different technologies. And applications of tech to fields that other
                  persons haven’t seen before me. It is in a very early stage in which I try to work
                  out my path towards what I believe is a good architecture for
                  JavaScript/TypeScript Applications. I use concepts of functional and reactive
                  programming to do this.
                </p>
                <p>
                  For the future, I plan to discuss connections and applications to my other
                  interests. I might also pick up on political and environmental topics here. Hence,
                  I will sort my posts in fundamental categories, where coding relates to the
                  technical posts.
                </p>
                <p>
                  I’m working as a JavaScript/TypeScript Fullstack Developer with a focus on
                  Frontend development. Before this, I worked as an OutSystems Low-Code Developer.
                  Here I contributed to many rapid prototyping and POC use cases. And I’ve one year
                  of experience working as a IT Consultant.
                </p>
                <p>
                  I hold a diploma in mathematical physics in Algebraic Quantum Field Theory, and I
                  got a PhD in Mathematics while doing research on pseudo-differential equations on
                  singular spaces.
                </p>
              </div>
            </PostFullContent>
          </article>
        </div>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default About;
