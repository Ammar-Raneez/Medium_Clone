import { GetStaticPaths, GetStaticProps } from 'next';
import PortableText from 'react-portable-text';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../typings';

interface SinglePostProps {
  posts: Post[];
  post: Post;
}

function SinglePost({ posts, post }: SinglePostProps) {
  console.log(post);

  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="cover"
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>
        <div className="flex items-center space-x-2 py-3 ">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div>
          {/* Specifically tailored for sanity */}
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NODE_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
    </main>
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
