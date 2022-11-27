import React from "react";
import { navLinks } from "../utils/navdata.js";
import Link from "next/link";

export default function Header() {
  var navLink = navLinks.map((link, index) => 
    <Link href={link.path}>
      <li key={index}>{link.name}</li>
    </Link>
  )

  return (
    <header>
      <div className="brand">
        <h3>HMP_Blog</h3>
      </div>
      <nav>
        <ul>
          {navLink}
        </ul>
      </nav>
    </header>
  );
}
