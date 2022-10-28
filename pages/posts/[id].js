/*
  Posts pages; Static Generation, dynamic routing
  Need database cms stuff set up first to get posts' data.
*/

import { useRouter } from "next/router"

// getStaticPaths function to generate dynamic paths for the posts statically. Called at build time.
export async function getStaticPaths() {
  const posts = [
    {
      id: "Dummy-Test-1"
    },
    {
      id: "Dummy-Test-2"
    }
  ];
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Get post information from params.id as provided via processing of the getStaticPaths function.
  return {
    props: { post: {} }
  };
}

export default function Post({ post }) {
  const router = useRouter();
  const { id } = router.query;

  return <p>Post: {id}</p>;
}
