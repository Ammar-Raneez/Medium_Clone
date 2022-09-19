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

// Static Site Generation - fetch static data on build time & cache
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const querySingle = `
    *[_type=='post' && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      author -> {
        name,
        bio,
        last,
        image,
        'imageUrl': image.asset->url
      },
      'comments': *[
        _type == 'comment' && 
        post._ref == ^._id  && approved == true
      ] {
        name,
        last,
        comment
        ,
        _createdAt
        ,
        userImage
      },
      description,
      mainImage,
      title,
      slug,
      body
    }
  `;

  const queryAll = `
    *[_type=='post'] {
      _id,
      title,
      _createdAt,
        author -> {
        name,
        image
      },
      description,
      mainImage,
      body,
      slug
    }
  `;

  const posts = await sanityClient.fetch(queryAll);
  const post = await sanityClient.fetch(querySingle, {
    slug: params?.slug,
  });

  if (!post) {
    // If no post is found, return 404 page
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      posts,
    },

    // Incremental Static Regeneration - refetch/update after 60s & cache
    revalidate: 60,
  };
};
