import { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
}
const client = sanityClient(config);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Get data on form submit
  const { name, email, comment, _id } = JSON.parse(req.body)

  // Programmatically create a new comment
  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    })
  } catch (err) {
    console.log('error on createComment', err);
    return res.status(500).json({ message: 'Couldn\'t submit comment' });
  }

  return res.status(200).json({ message: 'Comment created' });
}
