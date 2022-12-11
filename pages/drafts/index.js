import Head from "next/head"
import Header from "../../src/components/Header.js"
import { useSession } from 'next-auth/react';
import prisma from "../../lib/prisma";

export async function getServerSideProps() {
  const publishedFeed = await prisma.post.findMany({
    where: {
      published: true
    },
    include: {
      author: {
        select: {
          name: true
        }
      }
    }
  });

  const unpublishedFeed = await prisma.post.findMany({
    where: {
      published: false
    },
    include: {
      author: {
        select: {
          name: true
        }
      }
    }
  });

  return {
    props: { publishedFeed: publishedFeed, unpublishedFeed: unpublishedFeed }
  }
}

export default function Drafts(props) {
  const { data: session } = useSession();

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
  const unpublishedDrafts = props.publishedFeed.map((post) => (
    <div key={post.id} className="preview-post">
    </div>
  ));

  const publishedDrafts = props.unpublishedFeed.map((post) => (
    <div key={post.id} className="preview-post">
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
        {unpublishedDrafts}
        {publishedDrafts}
      </section>
    </div>
  )
}
