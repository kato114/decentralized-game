import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Container } from 'semantic-ui-react';
import Images from '../../common/Images';

const PostPreview = ({ title, summary, categories, created, featuredImage, slug }) => {
  return (
    <Link href="/blog/[id]" as={`/blog/${slug}`}>
      <a className="post">
        <Container className="post-container">
          <div className="post-image">
            <img src={featuredImage || Images.SOCIAL_SHARE} alt="" />
          </div>
          <div className="post-info">
            <div className="top">
              <div className="date">
                <span>
                  {new Date(created).toLocaleDateString('en-DE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="category" style={{ color: 'rgb(97, 97, 97)' }}>
                <span>{categories && categories[0] && categories[0].name}</span>
              </div>
            </div>
            <div className="bottom">
              <div className="blog-title">
                <h4 style={{ paddingBottom: '9px' }}>{title}</h4>
                <p style={{ color: 'rgb(97, 97, 97)' }}>{summary.split('.', 1)[0]}</p>
              </div>
            </div>
          </div>
        </Container>
      </a>
    </Link>
  );
};

export default PostPreview;
