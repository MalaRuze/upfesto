import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm w-full py-8 px-4">
      <div className="max-w-screen-xl mx-auto flex justify-between ">
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
          <p>Created by Vojtech Ruzicka</p>
          <div className="flex gap-2 mt-1">
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
