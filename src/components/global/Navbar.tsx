"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Reset", path: "/reset" },
  { name: "Books", path: "/books" },
  { name: "Products", path: "/products" },
  { name: "Blog", path: "/blog" },
  { name: "Library", path: "/library" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-0 left-0 w-full z-40 px-6 py-8 md:px-12 flex justify-between items-center text-brand-text"
    >
      <Link href="/" className="font-serif text-2xl tracking-wide font-light">
        Quietly Human Studio
      </Link>

      <div className="flex items-center gap-8">
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm tracking-widest uppercase transition-colors duration-500 hover:text-brand-accent ${
                pathname === link.path ? "text-brand-accent opacity-100" : "opacity-60"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <ThemeToggle />

        {/* Mobile Menu Button - Placeholder */}
        <button className="md:hidden text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
          Menu
        </button>
      </div>
    </motion.header>
  );
}
