"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { getBlogPosts, urlFor } from "@/lib/sanity";

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
}

const categoryLabels: { [key: string]: string } = {
  tips: "Photography Tips",
  bts: "Behind the Scenes",
  weddings: "Weddings",
  gear: "Gear Reviews",
  news: "Studio News",
  tutorials: "Tutorials",
};

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const getImageSrc = (post: BlogPost) => {
    if (post.coverImage?.asset?._ref) {
      return urlFor(post.coverImage).width(800).height(500).fit("crop").auto("format").quality(80).url();
    }
    return post.coverImageUrl || "";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section id="blog" className="py-6 sm:py-12 bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 sm:w-8 bg-amber-400" />
              <span className="text-xs uppercase tracking-widest text-amber-400">Blog</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
              Stories & Insights
            </h2>
          </div>
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
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 sm:w-8 bg-amber-400" />
              <span className="text-xs uppercase tracking-widest text-amber-400">Blog</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
              Stories & Insights
            </h2>
          </div>
          <p className="text-center text-muted-foreground text-sm">Coming soon</p>
        </div>
      </section>
    );
  }

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const otherPosts = posts.filter((p) => p._id !== featuredPost._id).slice(0, 3);

  return (
    <section id="blog" className="py-6 sm:py-12 bg-background">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 sm:w-8 bg-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400">Blog</span>
          </div>
          <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
            Stories & Insights
          </h2>
        </div>

        {/* Featured + Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Featured Post */}
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
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
                <div className="flex items-center gap-3 text-[9px] sm:text-[10px] text-white/50">
                  {featuredPost.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-2.5 w-2.5" />
                      <span>{featuredPost.author}</span>
                    </div>
                  )}
                  {featuredPost.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side Posts */}
          <div className="flex flex-col gap-3 sm:gap-3">
            {otherPosts.map((post) => (
              <div
                key={post._id}
                className="group cursor-pointer flex gap-3 items-start"
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-md sm:rounded-lg">
                  <Image
                    src={getImageSrc(post)}
                    alt={post.title}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Text */}
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
                  <div className="flex items-center gap-2 text-[8px] sm:text-[9px] text-muted-foreground">
                    {post.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-2 w-2" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-amber-400">
                      <span>Read</span>
                      <ArrowRight className="h-2 w-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All */}
        {posts.length > 4 && (
          <div className="mt-4 sm:mt-6 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-1 text-xs sm:text-xs text-muted-foreground hover:text-amber-400 transition-colors"
            >
              <BookOpen className="h-3 w-3 sm:h-3 sm:w-3" strokeWidth={1.5} />
              <span>View All Posts</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
