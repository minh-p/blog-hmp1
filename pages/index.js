import Head from "next/head"
import Header from "../src/components/Header.js"

export default function Home({ posts }) {
  // The below stuff is like simple html. Kinda crazy how anybody would think this is hard.
  // Anyways, what's crazy is gonna be the posts.
  return (
    <div>
      <Head>
        <title>HMP_Blog</title>
        <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section>
        <h1>HMP_Blog</h1>
        <h2>Introduction</h2>
        <p>
          Hello, my name is Vu Huy Minh Pham.
          Thank you so much for your time, taking a visit to my dynamic blog web page.
          You might find some information useful here.
          <br />
          The rest of the blog is mostly about things that I am doing with passion! :D
          <br />
          And as well as some personal preferences.
          <br /><br/>
          To view my posts, navigate to the Posts page using the navigation bar.
        </p>
      </section>
    </div>
  )
}
