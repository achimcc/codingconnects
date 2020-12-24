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
                  I'm Achim, a Software Developer from Berlin. I’ve a passion for technical ideas
                  and innovation. My current interest ranges from Blockchain, over IOT to AI/Machine
                  Learning Applications. I'm interested in how technology interacts with society and
                  how it affects society towards the future.
                </p>
                <p>
                  <figure>
                    <img src={Achim} className="photo" />
                    <figcaption>Me, on climbing vacation in Siurana, Spain.</figcaption>
                  </figure>
                </p>
                <p>
                  I enjoy finding and drawing connections between unrelated fields, which was one
                  motivation to choose the name Coding Connects for my current blog. It is still in
                  a very early stage in which I try to work out my path towards what I believe is a
                  good architecture for JavaScript/Typescript Applications, following concepts of
                  functional and reactive programming. For the future I want to discuss here
                  connections and applications to my other interests, and political and
                  environmental topics. Hence, I will sort my posts in fundamental categories, where
                  coding relates to the technical posts.
                </p>
                <p>
                  I’m currently working as a JavaScript/Typescript Fullstack Developer with a focus
                  on Frontend development. I've worked as a Low-Code Developer, which involved
                  working for many rapid prototyping and POC use cases. I hold a diploma in
                  mathematical physics in Algebraic Quantum Field Theory and I got a PhD in
                  Mathematics while doing research on pseudodifferential equations on singular
                  spaces.
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
