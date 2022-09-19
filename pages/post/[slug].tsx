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
