import React, { useState, useEffect } from 'react';
import { Divider, Icon, Button } from 'semantic-ui-react';
import HtmlParser from './HtmlParser';
import Images from '../../common/Images';

const Screen = ({
  slug,
  featured_image,
  image,
  created,
  categories,
  title,
  summary,
  author: { first_name = '', last_name = '', profile_image = '' },
  body,
  filteredPages,
  unfilteredPages,
  category: { name = '' }
}) => {
  const [randomfilteredPages, setFilteredPages] = useState();

  useEffect(() => {
    // Random Function
    let currentIndex = filteredPages.length;
    let otherIndex = unfilteredPages.length;
    let temporaryValue = 0;
    let randomIndex = 0;

    function shuffle(array) {
      let count = 0;
      let addcount = 0;
      const array1 = unfilteredPages;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        count += 1;

        if (count >= 2) {
          count = filteredPages.length - 2;
          array.splice(0, count);

          return array;
        }
      }

      currentIndex = filteredPages.length;

      if (currentIndex < 2) {
        addcount = 2 - currentIndex;
      }

      while (0 !== addcount) {
        randomIndex = Math.floor(Math.random() * otherIndex);
        otherIndex -= 1;
        addcount -= 1;
        temporaryValue = array1[otherIndex];
        array[currentIndex + addcount] = temporaryValue;
        array1[otherIndex] = array1[otherIndex];
        array1[otherIndex] = temporaryValue;
      }

      return array;
    }

    setFilteredPages(shuffle(filteredPages));
  }, []);

  return (
    <div>
      <div
        className="blog-share-div"
        style={{
          maxWidth: '1400px',
          paddingLeft: '27px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            marginTop: '14px'
          }}
        >
          <a className="twitter-share-button" href={`https://twitter.com/share?url=https://decentral.games/blog/${slug}`} target="_blank" rel="noreferrer">
            <Icon className="share-icon" style={{ fontSize: '34px' }} name="twitter square" />
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=https://decentral.games/blog/${slug}`}>
            <Icon
              className="share-icon"
              style={{
                fontSize: '34px',
                margin: '15px 0px 15px 0px'
              }}
              name="facebook"
            />
          </a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://decentral.games/blog/${slug}`}>
            <Icon className="share-icon" style={{ fontSize: '34px' }} name="linkedin" />
          </a>
        </span>
      </div>

      <div className="blogdetail-page-container">
        <div className="blogdetails">
          <div className="bloginfo">
            <p>
              {' '}
              <a style={{ color: '#2085f4', position: 'relative', zIndex: '10' }} href="/blog/">
                Blog
              </a>{' '}
              » <a style={{ color: '#2085f4', position: 'relative', zIndex: '10' }} href={`/blog/category/${name.toLowerCase()}/`}>{`${name}`}</a> » {title}{' '}
            </p>
            <div className="title">
              <h1>{title}</h1>
            </div>

            <div className="info">
              <div className="post-author" style={{ marginBottom: '90px' }}>
                <span style={{ display: 'flex', marginTop: '45px' }}>
                  <div className="post-date-blogdetail" style={{ marginRight: '13px' }}>
                    <span>
                      {new Date(created).toLocaleDateString('en-DE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="post-date-blogdetail">
                    <span>{Math.ceil(body.split(' ').length / 300)} min read</span>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>

        <span
          style={{
            marginTop: '-60px',
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          <div className="coverimg">
            <div className="image main-image">
              <img className="blog-hero-img" src={image || Images.SOCIAL_SHARE} alt="" />
            </div>
          </div>
        </span>

        <div style={{ marginTop: '45px' }}>
          <div>
            <div className="post__content">{HtmlParser(body)}</div>

            <div className="read-next-div">
              {randomfilteredPages &&
                randomfilteredPages.map(page => (
                  <Button className="read-next-button" href={page.slug}>
                    {page.title}
                  </Button>
                ))}
            </div>

            <Divider style={{ color: 'rgb(241, 241, 241)', marginTop: '60px' }} />
            <div style={{ marginBottom: '150px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen;
