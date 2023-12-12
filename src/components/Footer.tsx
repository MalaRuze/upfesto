import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-black px-4 py-8 text-sm text-white">
      <div className="mx-auto flex max-w-screen-xl justify-between ">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/singin">Sign In</Link>
          </li>
          <li>
            <Link href="/singup">Sign Up</Link>
          </li>
        </ul>
        <div className="flex flex-col items-end">
          <Link href="/">
            <img src="/logo_dark.png" alt="logo" className="h-7 " />
          </Link>
          <p>Created by Vojtěch Růžička</p>
          <div className="mt-1 flex gap-2">
            <a href="https://www.linkedin.com/in/vojtech-ruzicka/">
              <img src="/linkedin_icon.svg" alt="linkedin" className="h-5" />
            </a>
            <a href="https://github.com/MalaRuze">
              <img src="/github_icon.png" alt="github" className="h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
