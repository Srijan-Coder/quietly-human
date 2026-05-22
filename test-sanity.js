const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'oqoqrg7e',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function test() {
  const query = `*[_type == "ebook" && slug.current == "putting-heavy-things-down"][0] {
    _id,
    title,
    "slug": slug.current,
    author,
    coverImage {
      ...,
      "alt": alt
    },
    "fileUrl": ebookFile.asset->url,
    notionUrl,
    chapters
  }`;
  try {
    const book = await client.fetch(query);
    console.log(JSON.stringify(book, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
