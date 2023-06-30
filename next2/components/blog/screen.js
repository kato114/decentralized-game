import React, { useContext, useState } from 'react';
import { Container, Menu } from 'semantic-ui-react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { Image, Divider, Grid, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { GlobalContext } from '@/store';

const Screen = ({ pages, category, handleClickButton, match, history }) => {
  const filteredPages = category === 'All' ? pages : pages.filter(page => (page.categories.length > 0 ? page.categories[0].name === category : false));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');
  const [state, dispatch] = useContext(GlobalContext);
  const blogs = state.pages.data.map(blog => ({
    title: blog.title,
    image: blog.featured_image,
    slug: blog.slug
  }));

  const handleResultSelect = (e, { result }) => {
    setValue('');
    history.push(`/blog/${result.slug}`);
  };

  const handleSearchChange = (e, { value }) => {
    setLoading(true);
    setValue(value);

    setTimeout(() => {
      if (value.length < 1) {
        setLoading(false);
        setResults([]);
        setValue('');
      }

      const re = new RegExp(_.escapeRegExp(value), 'i');
      const isMatch = result => re.test(result.title);

      setLoading(false);
      setResults(_.filter(blogs, isMatch));
    }, 300);
  };

  return (
    <Segment vertical>
      <div className="blog-page">
        <Container className="featured-blog-container">
          <Container>
            <Menu borderless style={{ border: 'none', boxShadow: 'none' }} className="blog-nav-menu">
              <Link href="/">
                <Menu.Item header style={{ marginLeft: '-15px' }}>
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1588362125/authorize_title_fx3yxd.webp"
                    style={{ width: '42px', marginTop: '1.5em' }}
                  />
                </Menu.Item>
              </Link>
              <Link href="/">
                <Menu.Item position="right" header style={{ marginRight: '-15px' }}>
                  <Breadcrumb
                    style={{
                      borderRadius: '4px',
                      color: 'rgb(97, 97, 97)',
                      paddingTop: '20px',
                      fontWeight: 'normal'
                    }}
                  >
                    {' '}
                    Go to Decentral Games <Icon style={{ fontSize: '10px', color: 'rgb(97, 97, 97)' }} name="arrow right" />{' '}
                  </Breadcrumb>
                </Menu.Item>
              </Link>
            </Menu>
          </Container>
          <Container style={{ marginTop: '-27px' }}>
            {/* <Fade bottom distance="20px"> */}
            <h3 className="main-blog-h3"> Decentral Games</h3>
            {/* </Fade> */}
            {/* <Fade bottom distance="10px" duration={600} delay={200}> */}
            <h5 className="blog-hero"> Check back here regularly for updates on our technology, tutorials, and Decentral Games news. </h5>
            {/* </Fade> */}

            <div className="mobile-featured-container">
              {/* <Fade bottom distance="20px" duration={600} delay={400}> */}
              <p style={{ color: 'rgb(97, 97, 97)' }}> Featured Post</p>
              <Divider style={{ opacity: '0.5', paddingBottom: '15px' }} />
              <Link href="/blog/[id]" as="/blog/tominoya-casino-nft-sale">
                <a>
                  <Grid style={{ paddingBottom: '120px' }} className="featured-post-padding">
                    <Grid.Row>
                      <Grid.Column computer={11} tablet={16} mobile={16}>
                        <Image
                          src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1588364844/tominoya_feature_lcfdm6.png"
                          className="featured-image"
                        />
                      </Grid.Column>
                      <Grid.Column computer={5} tablet={16} mobile={16}>
                        <div className="post-info">
                          <div className="top">
                            <div>
                              <span className="preview-date">19 APR 2020</span>
                              <span className="preview-category">Announcements</span>
                            </div>
                          </div>
                          <div className="bottom">
                            <div className="blog-title">
                              <h4
                                style={{
                                  paddingBottom: '9px',
                                  paddingTop: '8px',
                                  color: 'black'
                                }}
                              >
                                Tominoya Casino NFT Sale
                              </h4>
                              <p style={{ color: 'rgb(97, 97, 97)' }}>
                                Tominoya is a 3D virtual casino built by Decentral Games on 52 LAND parcels within Decentraland's Vegas City district.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </a>
              </Link>
              {/* </Fade> */}
            </div>
          </Container>

          <div style={{ zIndex: 2 }}>
            <div className="dcl navbar menu-site" role="navigation">
              <div className="ui container">
                <div className="dcl navbar-menu">
                  <div className="ui secondary stackable menu">
                    <a className="dcl navbar-logo" href="https://decentraland.org">
                      <i className="dcl logo"></i>
                    </a>
                    <a aria-current="page" className="item active" id="All" onClick={() => selectCategory('All')}>
                      All Articles
                    </a>
                    <a className="item" id="Announcements" onClick={() => selectCategory('Announcements')}>
                      Announcements
                    </a>
                    <a className="item" id="Tutorials" onClick={() => selectCategory('Tutorials')}>
                      Tutorials
                    </a>
                    <a className="item" id="Technology" onClick={() => selectCategory('Technology')}>
                      Technology
                    </a>
                  </div>
                </div>
                <div className="dcl navbar-account">
                  <div style={{ marginTop: '15px' }}>
                    <a href="mailto:hello@decentral.games" className="blog-link-a">
                      <i aria-hidden="true" className="mail icon"></i>
                    </a>
                    <a href="https://twitter.com/decentralgames/" className="blog-link-a">
                      <i aria-hidden="true" className="twitter icon"></i>
                    </a>
                    <a href="https://decentral.games/discord/" className="blog-link-a">
                      <i aria-hidden="true" className="discord icon"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="dcl navbar menu-mobile" role="navigation">
              <div className="mobile-menu">
                <div className="ui container">
                  <div className="dcl navbar-menu">
                    <div className="dcl navbar-mobile-menu">
                      <a className="dcl navbar-logo" href="https://decentraland.org">
                        <i className="dcl logo"></i>
                      </a>
                      <div className="ui small header dcl active-page caret-down" style={{ color: 'black' }} onClick={() => subMenu()}></div>
                    </div>
                  </div>
                </div>
                <div className="mobile-menu-items menu-hide">
                  <a aria-current="page" className="item active" onClick={() => selectCategory('All')} id="mobile-All">
                    All Articles
                  </a>
                  <a className="item" id="mobile-Announcements" onClick={() => selectCategory('Announcements')}>
                    Announcements
                  </a>
                  <a className="item" id="mobile-Tutorials" onClick={() => selectCategory('Tutorials')}>
                    Tutorials
                  </a>
                  <a className="item" id="mobile-Technology" onClick={() => selectCategory('Technology')}>
                    Technology
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div style={{ marginBottom: '30px' }}>
          <Divider />
        </div>
        <Container className="outter-blog-container" style={{ paddingBottom: '60px' }}>
          <div className="posts">
            {filteredPages.map(page => (
              <Link href="/blog/[id]" key={page.created} as={`/blog/${page.slug}`}>
                <a className="post">
                  <Container className="post-container">
                    <div className="post-image">
                      <img src={page.featured_image || page.banner} alt="" />
                    </div>
                    <div className="post-info">
                      <div className="top">
                        <div className="date">
                          <span>
                            {new Date(page.created).toLocaleDateString('en-DE', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="category" style={{ color: 'rgb(97, 97, 97)' }}>
                          <span>{page.categories && page.categories[0] && page.categories[0].name}</span>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="blog-title">
                          <h4 style={{ paddingBottom: '9px' }}>{page.title}</h4>
                          <p
                            style={{
                              color: 'rgb(97, 97, 97)',
                              fontSize: '18px'
                            }}
                          >
                            {page.summary.split('.', 1)[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Container>
                </a>
              </Link>
            ))}
          </div>
        </Container>

        <Divider />
      </div>

      <Container className="outter-blog-container">
        <div className="blog-footer-container">
          <p className="small-footer-p">
            {' '}
            © 2020{' '}
            <a id="a-footer-small" href="/">
              {' '}
              Decentral Games{' '}
            </a>
          </p>
          <p className="small-footer-p">
            {' '}
            Follow{' '}
            <a id="a-footer-small" href="https://twitter.com/decentralgames">
              {' '}
              Twitter{' '}
            </a>{' '}
            & Join{' '}
            <a id="a-footer-small" href="https://decentral.games/discord/">
              {' '}
              Discord{' '}
            </a>{' '}
            |{' '}
            <a id="a-footer-small" href="/disclaimer">
              {' '}
              Disclaimer{' '}
            </a>
          </p>
        </div>
      </Container>
    </Segment>
  );
};

export default withRouter(Screen);
