import Head from "next/head"
import Header from "../../components/Header.js"
import prisma from "../../lib/prisma";
import Link from "next/link";

export async function getStaticProps() {
  const posts = await prisma.post.findMany({
    where: {
      published: true
    },
    orderBy: {
      id: 'desc'
    },
    include: {
      author: {
        select: { name: true, email: true}
      }
    }
  });

  // stringify DateTime
  const dateStripped = array => {
    for (var i = 0; i < array.length; i++) {
      var post = array[i];
      post.createdAt = JSON.stringify(post.createdAt);
    }
    return array;
  }

  return {
    props: {posts: dateStripped(posts)},
    revalidate: 10
  }
}

export default function Posts({ posts }) {
  let feed = posts.map((post) => (
    <div key={post.id} className="preview-post">
      <div key={post.id} className="preview-post">
        <li>
          <Link href={"/posts/"+post.id}>
            <a className="link-to-post" href={"/posts/"+post.id}>{post.createdAt.substring(1, post.createdAt.length-15)}: {post.title}</a>
          </Link>
        </li>
      </div>
    </div>
  ));
  if (posts.length == 0) {
    feed = (<p>There are no posts published by Huy right now. Thank you so much for visiting though :D</p>)
  }
  return (
    <div>
      <Head>
        <title>HMP_Blog - Posts</title>
        <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section>
        <h1>Posts</h1>
        <ul>
          {feed}
        </ul>
      </section>
    </div>
  )
}
