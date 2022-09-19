export interface Post {
  _id: string;
  createdAt: string;
  title: string;
  description: string;
  author: Author;
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