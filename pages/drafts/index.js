import Head from "next/head"
import Header from "../../components/Header.js"
import { useSession } from 'next-auth/react';
import Link from "next/link";
import { useRouter } from "next/router";
import prisma from "../../lib/prisma";

export async function getServerSideProps() {
  const publishedFeed = await prisma.post.findMany({
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

  const unpublishedFeed = await prisma.post.findMany({
    where: {
      published: false
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
    props: { publishedFeed: dateStripped(publishedFeed), unpublishedFeed: dateStripped(unpublishedFeed) }
  }
}

export default function Drafts(props) {
  const { data: session } = useSession();
  const router = useRouter();
  const isActive = (pathname) => router.pathname === pathname;

  if (!session) {
    return (
      <div>
        <Head>
          <title>HMP_Blog</title>
          <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </div>
    );
  }

  //TODO There is not any post data yet, so the front end will currently postpone.
  const publishedDrafts = props.publishedFeed.map((post) => (
    <div key={post.id} className="preview-post">
      <li>
        <Link href={"/drafts/"+post.id}>
          <a className="link-to-post" href={"/drafts/"+post.id}>{post.createdAt.substring(1, post.createdAt.length-15)}: {post.title}</a>
        </Link>
      </li>
    </div>
  ));

  const unpublishedDrafts = props.unpublishedFeed.map((post) => (
    <div key={post.id} className="preview-post">
      <li>
        <Link href={"/drafts/"+post.id}>
          <a className="link-to-post" href={"/drafts/"+post.id}>{post.title}</a>
        </Link>
      </li>
    </div>
  ));

  return (
    <div>
      <Head>
        <title>HMP_Blog</title>
        <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section>
        <h1>Drafts</h1>
        <h2>Below are some of your recent drafts</h2>
        <form action="/drafts/new_post_create">
          <input type="submit" value="Create New Draft" />
        </form>

        <p>Unpublished</p>
        <ul>
          {unpublishedDrafts}
        </ul>
        <p>Published</p>
        <ul>
          {publishedDrafts}
        </ul>
      </section>
    </div>
  )
}
