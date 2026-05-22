import { PortableText, PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export function CustomPortableText({ value }: { value: any }) {
  const components: PortableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <div className="my-12 relative w-full overflow-hidden rounded-2xl border border-brand-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(value).url()}
              alt={value.alt || "Image"}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        );
      },
      actionButton: ({ value }: any) => {
        if (!value?.url || !value?.buttonText) return null;
        const isPrimary = value.style === "Primary (Solid)";
        return (
          <div className="my-8 flex justify-center w-full">
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 ${
                isPrimary
                  ? "bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-white"
                  : "border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent"
              }`}
            >
              {value.buttonText}
            </a>
          </div>
        );
      },
    },
    block: {
      normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-brand-soft text-lg font-sans">{children}</p>,
      h1: ({ children }: any) => <h1 className="mt-16 mb-8 text-4xl md:text-5xl font-serif text-brand-text">{children}</h1>,
      h2: ({ children }: any) => <h2 className="mt-12 mb-6 text-3xl font-serif text-brand-text">{children}</h2>,
      h3: ({ children }: any) => <h3 className="mt-10 mb-4 text-2xl font-serif text-brand-text">{children}</h3>,
      blockquote: ({ children }: any) => (
        <blockquote className="my-8 pl-6 border-l-2 border-brand-accent italic font-serif text-xl md:text-2xl text-brand-text leading-relaxed">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-semibold text-brand-text">{children}</strong>,
      em: ({ children }: any) => <em className="italic font-serif text-brand-text">{children}</em>,
      link: ({ value, children }: any) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
        return (
          <a
            href={value?.href}
            target={target}
            rel={target === '_blank' ? 'noindex nofollow' : ''}
            className="text-brand-accent underline underline-offset-4 hover:text-brand-text transition-colors"
          >
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: any) => <ul className="mb-6 pl-6 list-disc space-y-2 text-brand-soft font-sans text-lg">{children}</ul>,
      number: ({ children }: any) => <ol className="mb-6 pl-6 list-decimal space-y-2 text-brand-soft font-sans text-lg">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: any) => <li className="pl-2">{children}</li>,
      number: ({ children }: any) => <li className="pl-2">{children}</li>,
    },
  };

  return <PortableText value={value} components={components} />;
}
