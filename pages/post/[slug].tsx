import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';
import { sanityClient } from '../../sanity';
import { Post } from '../../typings';

interface SinglePostProps {
  posts: Post[];
  post: Post;
}

function SinglePost({ posts, post }: SinglePostProps) {
  console.log(post);

  return (
    <Header />
  );
}

export default SinglePost;

// Statically Pre-renders all the dynamic paths
export const getStaticPaths: GetStaticPaths = async () => {
  const query = `
    *[_type == 'post'] {
      _id,
      slug {
        current
      }
    }
  `;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,

    // Prevent showing 404 page for pages that do exist
    fallback: 'blocking',
  };
};
