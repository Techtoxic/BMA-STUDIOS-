"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [posts, setPosts]             = useState<BlogPost[]>([]);
  const [loading, setLoading]         = useState(true);
  const [openPost, setOpenPost]       = useState<BlogPost | null>(null);
  const [bodyLoading, setBodyLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getBlogPosts()
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = openPost ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openPost]);

  const openModal = async (post: BlogPost, index: number) => {
    const pageSlug = post.slug?.current ?? post._id;
    if (pageSlug) {
      window.location.href = `/blog/${pageSlug}`;
      return;
    }
    setActiveIndex(index);
    if (post.body) { setOpenPost(post); return; }
    setBodyLoading(true);
    setOpenPost({ ...post, body: [] });
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
  const restPosts = posts.filter((p) => p._id !== featuredPost._id).slice(0, 4);

  return (
    <>
      <section id="blog" className="py-6 sm:py-12 bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader />

          {/* ── Desktop: featured left + list right | Mobile: stack ── */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">

            {/* Featured post — large card */}
            <button
              onClick={() => openModal(featuredPost, posts.indexOf(featuredPost))}
              className="group cursor-pointer text-left w-full lg:w-[55%] flex-shrink-0"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={getImageSrc(featuredPost)}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {featuredPost.category && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-amber-400 text-background rounded">
                        {categoryLabels[featuredPost.category] || featuredPost.category}
                      </span>
                    )}
                    <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-white/10 text-white/70 rounded border border-white/10">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-[var(--font-heading)] font-bold text-white leading-tight mb-2">
                    {featuredPost.title}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2 mb-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] text-white/40">
                      {featuredPost.author && (
                        <div className="flex items-center gap-1"><User className="h-3 w-3" /><span>{featuredPost.author}</span></div>
                      )}
                      {featuredPost.publishedAt && (
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(featuredPost.publishedAt)}</span></div>
                      )}
                    </div>
                    <span className="text-xs text-amber-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Right column — list of remaining posts */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              {restPosts.length === 0 && (
                <p className="text-sm text-white/30 pt-4">More posts coming soon.</p>
              )}
              {restPosts.map((post) => {
                const idx = posts.indexOf(post);
                return (
                  <button
                    key={post._id}
                    onClick={() => openModal(post, idx)}
                    className="group cursor-pointer text-left w-full"
                  >
                    <div
                      className="flex gap-4 items-start rounded-xl p-3 transition-colors duration-150"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={getImageSrc(post)}
                          alt={post.title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        {post.category && (
                          <span className="inline-block px-1.5 py-0.5 text-[9px] font-medium bg-amber-400/10 text-amber-400 rounded mb-1">
                            {categoryLabels[post.category] || post.category}
                          </span>
                        )}
                        <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <p className="text-[11px] text-white/45 line-clamp-2 mb-1.5">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-white/30">
                          {post.author && (
                            <div className="flex items-center gap-1"><User className="h-2.5 w-2.5" />{post.author}</div>
                          )}
                          {post.publishedAt && (
                            <div className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{formatDate(post.publishedAt)}</div>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-amber-400 flex-shrink-0 mt-1 transition-colors" />
                    </div>
                  </button>
                );
              })}

              {posts.length > 5 && (
                <div className="pt-1">
                  <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-400 transition-colors">
                    <BookOpen className="h-3 w-3" strokeWidth={1.5} />
                    <span>View All Posts</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-Post Modal ── */}
      {openPost && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setOpenPost(null); }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpenPost(null)} />
          <div className="relative z-10 w-full sm:max-w-2xl sm:mx-4 bg-[#111] sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92dvh] flex flex-col">
            <div className="relative w-full aspect-[16/9] flex-shrink-0">
              <Image
                src={getImageSrc(openPost)}
                alt={openPost.title}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
              <button
                onClick={() => setOpenPost(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {openPost.category && (
                <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-medium bg-amber-400 text-black rounded">
                  {categoryLabels[openPost.category] || openPost.category}
                </span>
              )}
            </div>
            <div className="overflow-y-auto flex-1 px-5 pt-3 pb-6">
              <h2 className="font-[var(--font-heading)] text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                {openPost.title}
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-white/40 mb-4">
                {openPost.author && <div className="flex items-center gap-1"><User className="h-2.5 w-2.5" />{openPost.author}</div>}
                {openPost.publishedAt && <div className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{formatDate(openPost.publishedAt)}</div>}
              </div>
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
            <div className="flex items-center justify-between border-t border-white/8 px-5 py-3 flex-shrink-0">
              <button
                onClick={() => navigate(-1)}
                disabled={activeIndex === 0}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <span className="text-[10px] text-white/25">{activeIndex + 1} / {posts.length}</span>
              <button
                onClick={() => navigate(1)}
                disabled={activeIndex === posts.length - 1}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
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
