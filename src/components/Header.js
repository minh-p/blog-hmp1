import React from "react";
import { navLinks } from "../utils/navdata.js";
import Link from "next/link";
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const router = useRouter();
  const isActive = (pathname) => router.pathname === pathname;
  const { data: session, status } = useSession();

  var signedIn;
  var drafts = "";

  if (!session) {
    signedIn = (
      <li>
        <Link href="/api/auth/signin">
          <a data-active={isActive('/signup')}>Log in (If Have Perms)</a>
        </Link>
      </li>
    )

  } else {
    signedIn = (
      <li>
        Signed In ({session.user.email})
        <button onClick={() => signOut()}>
          Log out
        </button>
      </li>
    );
    drafts = (
      <li>
        <Link href="/drafts">
          <a data-active={isActive('/drafts')}>Drafts</a>
        </Link>
      </li>
    )
  }

  var navLink = navLinks.map((link, index) => 
    <Link href={link.path}>
      <a data-active={isActive(link.path)}>
        <li key={index}>{link.name}</li>
      </a>
    </Link>
  )

  return (
    <header>
      <div className="brand">
        <Link href="/"><h3>HMP_Blog</h3></Link>
      </div>
      <nav>
        <ul>
          {navLink}
          {drafts}
          {signedIn}
        </ul>
      </nav>
    </header>
  );
}
