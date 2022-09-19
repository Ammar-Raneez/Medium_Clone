import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '../sanity';
import { Post } from '../typings';

interface HomePostProps {
  posts: Post[];
}

function HomePost({ posts }: HomePostProps) {
  return (
    <div
      className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6"
    >
      {posts.map((post) => (
        <Link passHref key={post._id} href={`/post/${post.slug.current}`}>
          <div
            className="group border rounded-lg shadow-md cursor-pointer overflow-hidden"
          >
            <Image
              className=" w-full h-60 object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
              src={urlFor(post && post.mainImage).url()!}
              alt="post"
              width={1000}
              height={400}
            />
            <div className="flex justify-between p-5  bg-white">
              <div>
                <p className="text-lg font-bold">{post.title}</p>
                <p className="text-sm">
                  {post.description} by{" "}
                  <span className="font-medium uppercase">
                    {post.author.name}
                  </span>
                </p>
              </div>
              <Image
                className="h-12 ml-6 rounded-full"
                src={urlFor(post && post.author.image).url()!}
                alt="author"
                width={100}
                height={10}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default HomePost;
