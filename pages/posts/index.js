import Head from "next/head"
import Header from "../../src/components/Header.js"

export default function Posts() {
  return (
    <div>
      <Head>
        <title>HMP_Blog</title>
        <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section>
        <h1>Posts</h1>
      </section>
    </div>
  )
}
