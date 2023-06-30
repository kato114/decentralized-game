import React, { useContext, useEffect } from 'react';
import Screen from '../../../components/blogdetail/screen';
import { GlobalContext } from '@/store';
import { Segment } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import ButterCMS from '../../../common/ButterCMS';

const BlogDetail = () => {
  const router = useRouter();
  const [state, dispatch] = useContext(GlobalContext);
  const slug = router.query.id;
  const currentPage = state.pages.data.find(page => page.slug === slug);
  const category = currentPage ? currentPage.categories[0].name : '';

  const filteredPages = state.pages.data.filter(page => page.categories[0].name === category && page.slug !== currentPage.slug);

  const unfilteredPages = state.pages.data.filter(page => page.categories[0].name !== category);

  useEffect(() => {
    const getPages = async () => {
      const { data } = await ButterCMS.post.list({ page_size: 70 });
      dispatch({
        type: 'update_pages',
        data
      });
    };
    getPages();
  }, []);

  return (
    <Segment vertical style={{ top: '180px' }}>
      {currentPage && (
        <Screen
          slug={currentPage.slug}
          image={currentPage.featured_image}
          created={currentPage.created}
          category={currentPage.categories[0]}
          title={currentPage.title}
          summary={currentPage.summary}
          author={currentPage.author}
          body={currentPage.body}
          filteredPages={filteredPages}
          unfilteredPages={unfilteredPages}
        />
      )}
    </Segment>
  );
};

BlogDetail.getInitialProps = async ({ query }) => {
  const slug = query.id;
  const { data } = await Butter.instance.post.list({ page_size: 70 });
  const currentPage = data.data.find(page => page.slug === slug);
  let currentPage_title = currentPage.title;
  currentPage_title = currentPage_title.replace(': ', ':');
  currentPage_title = currentPage_title.replace(' - ', '-');
  return {
    page_title: currentPage_title,
    featured_image: currentPage.featured_image,
    page_summary: currentPage.summary
  };
};

export default BlogDetail;
