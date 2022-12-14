/*
  Drafts Page; Static generation, dynamic routing
  This is where the admin can edit their post. This page's complexity is probably
  the highest in the app.
*/

import { useRouter } from "next/router";
import Router from "next/router";
import Head from "next/head";
import Header from "../../components/Header.js"
import React, { useState } from 'react';
import prisma from "../../lib/prisma";
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';

// getStaticPaths function to generate dynamic paths for the posts statically. Called at build time.
export async function getStaticPaths() {
  const posts = await prisma.post.findMany();
  const paths = posts.map((draft) => ({
    params: { id: draft.id.toString() },
  }));
  paths.push({params: {id: "new_post_create"}});
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  if (params.id == "new_post_create") return {props: {}};
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  // stringify DateTime
  const dateStripped = post => {
    post.createdAt = JSON.stringify(post.createdAt);
    return post
  }

  return {
    props: dateStripped(post),
    revalidate: 10,
  };
}

async function publish(id, draftTitle, draftContent) {
  try {
    const body = {title: draftTitle, content: draftContent}
    await fetch(`/api/publish/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await Router.push("/posts")
  } catch (error) {
    console.log(error);
  }
}

async function deletePost(id) {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  await Router.push("/posts")
}

export default function Draft(draft) {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  var defaultContent = "";

  var [contentMarkdownInput, setContentMarkdownInput] = useState((draft && draft.content) ? draft.content : "Start Writing the Post in Markdown :)...");
  var [draftTitle, setDraftTitle] = useState(draft ? draft.title : "");

  function EditorButtons() {

    async function create(e) {
      try {
        const body = { title: draftTitle, content: contentMarkdownInput };
        await fetch("/api/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        await router.push("/drafts");
      } catch (error) {
        console.error(error);
      }
    }

    if (!draftTitle || !contentMarkdownInput) return;

    if (id == "new_post_create") {
      return (
        <button onClick={create}>Create</button>
      )
    } else {
      return (
        <>
          <button onClick={() => {publish(draft.id, draftTitle, contentMarkdownInput)}}>Publish</button>
          <button onClick={() => {deletePost(draft.id)}}>Delete</button>
        </>
      )
    }
  }

  // Textarea sucks and it does not indent. So this is here:
  const handleIndent = (e) => {
    if (e.keyCode === 9) {
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
          <title>HMP_Blog - Draft Permission Denied</title>
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
        <title>HMP_Blog - {draftTitle}</title>
        <meta name="description" content="HMP_Blog, a blog created by Vu Huy Minh Pham" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <label htmlFor="posttitle"> Post Title: </label><label className="warning">*(required)</label><br/>
      <input type="text" id="posttitle" name="posttitle" value={draftTitle} onChange={(e) => {setDraftTitle(e.target.value)}}/><br/><br/>
      <EditorButtons/>
      <div id="markdown-content-edit">
        <textarea
          autoFocus
          onKeyDown={handleIndent}
          id="post-content-markdown"
          value={contentMarkdownInput}
          onChange={(e) => setContentMarkdownInput(e.target.value)}
        />
        <div className="markdown" id="markdown-in-draft">
          <ReactMarkdown>{contentMarkdownInput}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
