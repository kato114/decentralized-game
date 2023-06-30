import BlogPages from './blogPages';
import Layout from '../../../components/Layout.js';
import Header from '../../../components/Header';
import ButterCMS from '../../../common/ButterCMS';

const Index = ({ page_title, featured_image, page_summary }) => {
  return (
    <Layout>
      <Header
        title={page_title}
        description={page_summary}
        image={featured_image}
      />

      <BlogPages />
    </Layout>
  );
};

Index.getInitialProps = async ({ query }) => {
  const slug = query.id;
  const { data } = await ButterCMS.post.list({ page_size: 70 });
  const currentPage = data.data.find((page) => page.slug === slug);

  let currentPage_title = currentPage.title;
  currentPage_title = currentPage_title.replace(': ', ':');
  currentPage_title = currentPage_title.replace(' - ', '-');

  return {
    page_title: currentPage_title,
    featured_image: currentPage.featured_image,
    page_summary: currentPage.summary,
  };
};

export default Index;
