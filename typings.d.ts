export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  author: Author;
  comments: Comment[];
  mainImage: {
    asset: {
      url: string;
    },
  },
  slug: {
    current: string;
  },
  body: object[];
}

interface Author {
  name: string;
  image: string;
}

export interface Comment {
  _id: string;
  comment: string;
  email: string;
  name: string;
}
