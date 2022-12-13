/*
  Posts pages; Static Generation, dynamic routing
  Need database cms stuff set up first to get posts' data.
*/

import { useRouter } from "next/router";
import prisma from "../../lib/prisma";
import Head from "next/head";
import Header from "../../components/Header.js";
import ReactMarkdown from 'react-markdown';

// getStaticPaths function to generate dynamic paths for the posts statically. Called at build time.
export async function getStaticPaths() {
  const posts = await prisma.post.findMany({
    where: {
      published: true
    }
  });
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) ,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  const dateStripped = post => {
    post.createdAt = JSON.stringify(post.createdAt);
    return post
  }

  return {
    props: dateStripped(post),
    revalidate: 10
  };
}

export default function Post(post) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { id } = router.query;

  let title;
  if (post == undefined) {
    return (
      <div>
        <Head>
          <title>HMP_Blog</title>
          <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
      </div>
    )
  } else {
    title = post.title;
  }

  return (
    <div>
      <Head>
        <title>HMP_Blog</title>
        <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <h1 className="blog-title">{title}</h1>
      <ReactMarkdown className="markdown">{post.content}</ReactMarkdown>
    </div>
  )
}
