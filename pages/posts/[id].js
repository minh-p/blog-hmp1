/*
  Posts pages; Static Generation, dynamic routing
  Need database cms stuff set up first to get posts' data.
*/

import { useRouter } from "next/router";
import prisma from "../../lib/prisma";

// getStaticPaths function to generate dynamic paths for the posts statically. Called at build time.
export async function getStaticPaths() {
  const posts = await prisma.posts.findMany({
    where: {
      published: true
    }
  });
  const paths = posts.map((post) => ({
    params: { post },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  return {
    props: { post: params },
    revalidate: 60
  };
}

export default function Post({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { id } = router.query;

  return <h1>post.title</h1>;
}
