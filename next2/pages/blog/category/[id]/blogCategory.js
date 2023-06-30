import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ButterCMS from '../../../../common/ButterCMS';

function blogCategory() {
  const router = useRouter();
  const [state, dispatch] = useContext(GlobalContext);
  const [filteredPages, changeCategory] = useState(state.pages.data);
  const category = router.query.id;

  useEffect(() => {
    const getPages = async () => {
      const { data } = await ButterCMS.post.list({ page_size: 70 });
      dispatch({
        type: 'update_pages',
        data,
      });
      changeCategory(data.data);
    };
    getPages();
  }, []);

  return (
    <div className="blog-home-container">
      <div className="account-other-tabs" style={{ marginTop: '-50px' }}>
        <div style={{ marginLeft: '0px' }}>
          <span className="account-other-p" style={{ display: 'flex' }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span
                style={{
                  margin: '100px 0px 0px 0px',
                  fontSize: '24px',
                  fontFamily: 'Larsseit-ExtraBold',
                  color: 'white',
                  float: 'left'
                }}
              >
                {category}
              </span>
            </span>
          </span>
        </div>
      </div>

      <div className="posts">
        {filteredPages.map((page) =>
          page.categories[0].name.toLowerCase() === category ? (
            <Link
              href="/blog/[id]"
              key={page.created}
              as={`/blog/${page.slug}`}
            >
              <a className="post">
                <div className="post-div">
                  <div className="post-image">
                    <img src={page.featured_image || page.banner} alt="" />
                  </div>
                  <div className="post-info">
                    <span
                      className="bottom-info"
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <div
                        className="post-category"
                      >
                        <span>
                          {page.categories &&
                            page.categories[0] &&
                            page.categories[0].name}
                        </span>
                      </div>
                      <span style={{ paddingRight: '10px', marginLeft: '-12px', color: 'hsla(0, 0%, 100%, .75)', marginTop: '-1px' }} />
                      <div className="post-date">
                        <span>
                          {new Date(page.created).toLocaleDateString(
                            'en-DE',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </span>
                    <div className="bottom">
                      <div className="blog-title">
                        <h4
                          style={{
                            fontSize: '20px',
                            fontfamily: 'LarsseitBold',
                            marginTop: '10px',
                            textAlign: 'center'
                          }}
                        >
                          {page.title}
                        </h4>
                        <p
                          style={{
                            fontFamily: 'Larsseit-Regular',
                            fontSize: '15px',
                            paddingTop: '15px',
                            textAlign: 'center'
                          }}
                        >
                          {page.summary.split('.', 1)[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
}
export default blogCategory;
