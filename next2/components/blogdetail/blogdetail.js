import React, { useContext, useEffect } from 'react';
import Screen from './screen';
import { GlobalContext } from '@/store';
import { Segment } from 'semantic-ui-react';
import ScrollToTop from '../Scroll';
import ButterCMS from '../../common/ButterCMS';

const BlogDetail = ({ match }) => {
  const [state, dispatch] = useContext(GlobalContext);
  const slug = match.path.split(/[/]/);
  const currentPage = state.pages.data.find(page => page.slug === slug[slug.length - 1]);

  const index = state.pages.data.indexOf(currentPage);
  const nextPage = state.pages.data[index + 1] ? state.pages.data[index + 1] : null;
  const prevPage = state.pages.data[index - 1] ? state.pages.data[index - 1] : null;

  const category = currentPage.categories[0].name;

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
    <ScrollToTop>
      <Segment vertical>
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
            next={nextPage}
            prev={prevPage}
            filteredPages={filteredPages}
            unfilteredPages={unfilteredPages}
          />
        )}
      </Segment>
    </ScrollToTop>
  );
};

export default BlogDetail;
