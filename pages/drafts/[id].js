/*
  Drafts Page; Static generation, dynamic routing
  This is where the admin can edit their post. This page's complexity is probably
  the highest in the app.
*/

import { useRouter } from "next/router";
import Head from "next/head"
import Header from "../../src/components/Header.js"
import React, { useState } from 'react';
import prisma from "../../lib/prisma";
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';

// getStaticPaths function to generate dynamic paths for the posts statically. Called at build time.
export async function getStaticPaths() {
  const posts = await prisma.post.findMany();
  const paths = posts.map((draft) => ({
    params: { draft },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  return {
    props: { draft: params },
    revalidate: 60
  };
}

export default function Draft({ draft }) {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  var defaultTitle = id;
  var defaultContent = "Start Writing the Post in Markdown :)...";

  var [contentMarkdownInput, setContentMarkdownInput] = useState();

  if (draft && draft.title) {
    defaultTitle = draft.title;
    defaultContent = draft.content;
  }

  // Textarea sucks and it does not indent. So this is here:
  const handleIndent = (e) => {
    if (e.keyCode === 9) {
      console.log("Tabbed");
      e.preventDefault()

      e.target.setRangeText(
        '   ',
        e.target.selectionStart,
        e.target.selectionStart,
        'end'
      )
    }
  }

  if (!session) {
    return (
      <div>
        <Head>
          <title>HMP_Blog</title>
          <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <p>Draft ID: {id}</p>
        <div>You need to be authenticated to view this page.</div>
      </div>
    );
  }

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Head>
        <title>HMP_Blog</title>
        <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <label htmlFor="postid">Post ID: </label>
      <input
        type="text"
        id="postid"
        name="postid"
        defaultValue={id}
      /> <label className="warning">WARNING: any changes made to the ID will change the path of this page.</label><br/><br/>

      <label htmlFor="posttitle"> Post Title: </label><br/>
      <input type="text" id="posttitle" name="posttitle" defaultValue={defaultTitle}/><br/><br/>
      <button>Write Changes</button>
      <button>Publish</button>
      <div id="markdown-content-edit">
        <textarea
          autoFocus
          onKeyDown={handleIndent}
          id="post-content-markdown"
          value={contentMarkdownInput}
          onChange={(e) => setContentMarkdownInput(e.target.value)}
        />
        <ReactMarkdown className="markdown">{contentMarkdownInput}</ReactMarkdown>
      </div>
    </div>
  );
}
