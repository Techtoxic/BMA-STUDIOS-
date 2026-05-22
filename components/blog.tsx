"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, User, ArrowRight, BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getBlogPosts, getBlogPostWithBody, urlFor } from "@/lib/sanity";

interface BlogPost {
  _id: string;
  title: string;
  slug?: { current: string };
  excerpt: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  featured?: boolean;
  coverImage?: any;
  coverImageUrl?: string;
  body?: any[];
}

const categoryLabels: { [key: string]: string } = {
  tips: "Photography Tips",
  bts: "Behind the Scenes",
  weddings: "Weddings",
  gear: "Gear Reviews",
  news: "Studio News",
  tutorials: "Tutorials",
};

// Simple Portable Text renderer — no external deps needed
function renderBlocks(blocks: any[]): React.ReactElement[] {
  return blocks.map((block, i) => {
    if (block._type === "image" && block.url) {
      return (
        <div key={i} className="my-6 rounded-xl overflow-hidden">
          <img src={block.url} alt="" className="w-full object-cover max-h-72" />
        </div>
      );
    }
    if (block._type !== "block") return <></>;

    const text = block.children
      ?.map((span: any) => {
        let t = span.text || "";
        if (span.marks?.includes("strong")) t = `<strong>${t}</strong>`;
        if (span.marks?.includes("em")) t = `<em>${t}</em>`;
        return t;
      })
      .join("") || "";

    const style = block.style || "normal";
    const classes: Record<string, string> = {
      h1: "text-xl font-bold text-white mt-6 mb-3",
      h2: "text-lg font-bold text-white mt-5 mb-2",
      h3: "text-base font-semibold text-white/90 mt-4 mb-2",
      blockquote: "border-l-2 border-amber-400 pl-4 italic text-white/60 my-4",
      normal: "text-sm text-white/70 leading-relaxed mb-3",
    };

    return (
      <p
        key={i}
        className={classes[style] || classes.normal}
        dangerouslySetInnerHTML={{ __html: text || "&nbsp;" }}
      />
    );
  });
}

export function Blog() {
  const [posts, setPosts]               = useState<BlogPost[]>([]);
  const [loading, setLoading]           = useState(true);
  const [openPost, setOpenPost]         = useState<BlogPost | null>(null);
  const [bodyLoading, setBodyLoading]   = useState(false);
  const [activeIndex, setActiveIndex]   = useState(0);

  useEffect(() => {
    getBlogPosts()
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = openPost ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openPost]);

  const openModal = async (post: BlogPost, index: number) => {
    setActiveIndex(index);
    if (post.body) { setOpenPost(post); return; }
    setBodyLoading(true);
    setOpenPost({ ...post, body: [] }); // show modal immediately
    try {
      const full = await getBlogPostWithBody(post._id);
      setOpenPost(full);
    } catch { /* keep partial */ }
    finally { setBodyLoading(false); }
  };

  const navigate = async (dir: -1 | 1) => {
    const next = activeIndex + dir;
    if (next < 0 || next >= posts.length) return;
    await openModal(posts[next], next);
  };

  const getImageSrc = (post: BlogPost) => {
    if (post.coverImage?.asset?._ref) {
      return urlFor(post.coverImage).width(800).height(500).fit("crop").auto("format").quality(80).url();
    }
    return post.coverImageUrl || "";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <section id="blog" className="py-6 sm:py-12 bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="py-6 sm:py-12 bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader />
          <p className="text-center text-muted-foreground text-sm">Coming soon</p>
        </div>
      </section>
    );
  }

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const featuredIdx  = posts.indexOf(featuredPost);
  const otherPosts   = posts.filter((p) => p._id !== featuredPost._id).slice(0, 3);

  return (
    <>
      <section id="blog" className="py-6 sm:py-12 bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader />

          {/* Featured + Side Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">

            {/* Featured Post */}
            <button
              onClick={() => openModal(featuredPost, featuredIdx)}
              className="group cursor-pointer text-left w-full"
            >
              <div className="relative overflow-hidden rounded-xl">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={getImageSrc(featuredPost)}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                  {featuredPost.category && (
                    <span className="inline-block px-2 py-0.5 text-[9px] sm:text-[10px] font-medium bg-amber-400 text-background rounded mb-2">
                      {categoryLabels[featuredPost.category] || featuredPost.category}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-lg font-[var(--font-heading)] font-bold text-white leading-tight mb-1 sm:mb-2">
                    {featuredPost.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-white/70 line-clamp-2 mb-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[9px] sm:text-[10px] text-white/50">
                      {featuredPost.author && (
                        <div className="flex items-center gap-1"><User className="h-2.5 w-2.5" /><span>{featuredPost.author}</span></div>
                      )}
                      {featuredPost.publishedAt && (
                        <div className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" /><span>{formatDate(featuredPost.publishedAt)}</span></div>
                      )}
                    </div>
                    <span className="text-[9px] text-amber-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Side Posts */}
            <div className="flex flex-col gap-3">
              {otherPosts.map((post) => {
                const idx = posts.indexOf(post);
                return (
                  <button
                    key={post._id}
                    onClick={() => openModal(post, idx)}
                    className="group cursor-pointer flex gap-3 items-start text-left"
                  >
                    <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-lg">
                      <Image
                        src={getImageSrc(post)}
                        alt={post.title}
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      {post.category && (
                        <span className="inline-block text-[8px] sm:text-[9px] font-medium text-amber-400 uppercase tracking-wider mb-1">
                          {categoryLabels[post.category] || post.category}
                        </span>
                      )}
                      <h4 className="text-xs sm:text-sm font-[var(--font-heading)] font-semibold text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-amber-400 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground line-clamp-2 mb-1.5">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-1 text-[8px] text-amber-400/70 group-hover:text-amber-400 transition-colors">
                        <span>Read more</span>
                        <ArrowRight className="h-2 w-2" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {posts.length > 4 && (
            <div className="mt-5 text-center">
              <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-400 transition-colors">
                <BookOpen className="h-3 w-3" strokeWidth={1.5} />
                <span>View All Posts</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Full-Post Modal ─────────────────────────────────────────────── */}
      {openPost && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setOpenPost(null); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpenPost(null)} />

          {/* Panel */}
          <div className="relative z-10 w-full sm:max-w-2xl sm:mx-4 bg-[#111] sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92dvh] flex flex-col">

            {/* Cover image */}
            <div className="relative w-full aspect-[16/9] flex-shrink-0">
              <Image
                src={getImageSrc(openPost)}
                alt={openPost.title}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

              {/* Close button */}
              <button
                onClick={() => setOpenPost(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Category */}
              {openPost.category && (
                <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-medium bg-amber-400 text-black rounded">
                  {categoryLabels[openPost.category] || openPost.category}
                </span>
              )}
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5 pt-3 pb-6">
              <h2 className="font-[var(--font-heading)] text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                {openPost.title}
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-white/40 mb-4">
                {openPost.author && (
                  <div className="flex items-center gap-1"><User className="h-2.5 w-2.5" />{openPost.author}</div>
                )}
                {openPost.publishedAt && (
                  <div className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{formatDate(openPost.publishedAt)}</div>
                )}
              </div>

              {/* Body */}
              {bodyLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full" />
                </div>
              ) : openPost.body?.length ? (
                <div>{renderBlocks(openPost.body)}</div>
              ) : (
                <p className="text-sm text-white/60 leading-relaxed">{openPost.excerpt}</p>
              )}
            </div>

            {/* Prev / Next navigation */}
            <div className="flex items-center justify-between border-t border-white/8 px-5 py-3 flex-shrink-0">
              <button
                onClick={() => navigate(-1)}
                disabled={activeIndex === 0}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <span className="text-[10px] text-white/25">{activeIndex + 1} / {posts.length}</span>
              <button
                onClick={() => navigate(1)}
                disabled={activeIndex === posts.length - 1}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionHeader() {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px w-6 sm:w-8 bg-amber-400" />
        <span className="text-xs uppercase tracking-widest text-amber-400">Blog</span>
      </div>
      <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
        Stories & Insights
      </h2>
    </div>
  );
}
