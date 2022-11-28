import Head from "next/head"
import Header from "../../src/components/Header.js"
import { useSession, getSession } from 'next-auth/react';

export default function Drafts() {
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
      </section>
    </div>
  )
}
