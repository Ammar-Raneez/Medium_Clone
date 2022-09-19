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

  const onSubmit = async () => {

  }

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
              h1: (props) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }) => (
                <a href={href} className="text-blue-500">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />
      <form
        className="mx-auto mb-10 flex max-w-2xl flex-col p-5 "
      >
        <h3 className="text-sm text-yellow-500">Enjoyed this article ? </h3>
        <h4 className="text-3xl font-bold">Leave a comment below !</h4>
        <label className="mb-5 block">
          <span className="text-gray-700">Name</span>
          <input
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-0 ring-yellow-500 focus:ring"
            placeholder="Enter your name"
            type="text"
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Email</span>
          <input
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-0 ring-yellow-500 focus:ring"
            placeholder="Enter your email"
            type="EMAIL"
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Comment</span>
          <textarea
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-0 ring-yellow-500 focus:ring"
            placeholder="Enter comment"
            rows={8}
          />
        </label>

        <input
          type="submit"
          className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white hover:bg-yellow-400 focus:outline-none"
        />
      </form>
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
