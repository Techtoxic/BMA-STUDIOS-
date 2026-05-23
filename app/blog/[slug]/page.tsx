import { getBlogPosts, getBlogPostBySlug, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, BookOpen, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamicParams = true
export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

const categoryLabels: Record<string, string> = {
  tips: 'Photography Tips', bts: 'Behind the Scenes',
  weddings: 'Weddings', gear: 'Gear Reviews',
  news: 'Studio News', tutorials: 'Tutorials',
}

function getReadTime(body: any[]): string {
  if (!body?.length) return '1 min read'
  const words = body.reduce((acc, b) => {
    if (b._type !== 'block') return acc
    return acc + (b.children?.map((s: any) => s.text || '').join(' ') || '').trim().split(/\s+/).filter(Boolean).length
  }, 0)
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p: any) => ({ slug: p.slug?.current ?? p._id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — BMA Studios Blog`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.coverImageUrl ? [post.coverImageUrl] : [] },
  }
}

function renderBlocks(blocks: any[]) {
  if (!blocks?.length) return null
  return blocks.map((block: any, i: number) => {
    if (block._type === 'image' && block.url) {
      return (
        <div key={i} className="my-8 rounded-2xl overflow-hidden">
          <img src={block.url} alt="" className="w-full object-cover" />
        </div>
      )
    }
    if (block._type !== 'block') return null
    const text = block.children?.map((span: any) => {
      let t = span.text || ''
      if (span.marks?.includes('strong')) t = `<strong>${t}</strong>`
      if (span.marks?.includes('em')) t = `<em>${t}</em>`
      if (span.marks?.includes('underline')) t = `<u>${t}</u>`
      return t
    }).join('') || ''

    const style = block.style || 'normal'
    const classes: Record<string, string> = {
      h1: 'text-2xl font-bold text-white mt-10 mb-4',
      h2: 'text-xl font-bold text-white mt-8 mb-3',
      h3: 'text-lg font-semibold text-white/90 mt-6 mb-2',
      h4: 'text-base font-semibold text-white/80 mt-4 mb-2',
      blockquote: 'border-l-4 border-amber-400 pl-6 italic text-white/60 my-6 py-2',
      normal: 'text-base text-white/70 leading-relaxed mb-4',
    }
    if (block.listItem === 'bullet') return <li key={i} className="text-base text-white/70 ml-6 mb-2 list-disc" dangerouslySetInnerHTML={{ __html: text }} />
    if (block.listItem === 'number') return <li key={i} className="text-base text-white/70 ml-6 mb-2 list-decimal" dangerouslySetInnerHTML={{ __html: text }} />
    return <p key={i} className={classes[style] || classes.normal} dangerouslySetInnerHTML={{ __html: text || '&nbsp;' }} />
  })
}

function getCoverSrc(post: any) {
  if (post.coverImageUrl) return post.coverImageUrl
  if (post.coverImage?.asset?._ref) return urlFor(post.coverImage).width(900).height(600).fit('crop').url()
  return null
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()])
  if (!post) notFound()

  const currentIndex = allPosts.findIndex((p: any) => p._id === post._id)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const relatedPosts = allPosts.filter((p: any) => p._id !== post._id).slice(0, 4)
  const coverSrc = getCoverSrc(post)

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Nav ── */}
      <div className="sticky top-0 z-10 border-b border-white/8"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}>
        <div className="w-full px-6 sm:px-10 lg:px-16 py-3 flex items-center justify-between">
          <Link href="/#blog" className="flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-white/70">BMA Studios</span>
          </Link>
        </div>
      </div>

      {/* ── Magazine layout: LEFT = image+meta  RIGHT = body ── */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* LEFT column — sticky: image + title + meta + CTA */}
          <div className="w-full lg:w-[42%] xl:w-[38%] flex-shrink-0 lg:sticky lg:top-20 space-y-5">

            {/* Category */}
            {post.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: 'rgb(251,191,36)' }}>
                {categoryLabels[post.category] ?? post.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
              {post.author && <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{post.author}</span>}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-amber-400/70">
                <Clock className="h-3.5 w-3.5" />{getReadTime(post.body)}
              </span>
            </div>

            {/* Cover image */}
            {coverSrc && (
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src={coverSrc} alt={post.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 42vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-white/50 leading-relaxed border-l-2 border-amber-400/40 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Book CTA */}
            <div className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <p className="text-white text-sm font-semibold mb-1">Ready to shoot?</p>
              <p className="text-white/40 text-xs mb-3">BMA Studios · Nyeri Town</p>
              <Link href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-black bg-amber-400 hover:bg-amber-300 transition-all">
                Book a Session
              </Link>
            </div>

            {/* Quick contact */}
            <div className="flex flex-col gap-2 text-xs text-white/40">
              <a href="tel:+254725297393" className="hover:text-amber-400 transition-colors">📞 +254 725 297393</a>
              <a href="https://wa.me/254725297393" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">💬 WhatsApp us</a>
              <span>📍 Mahiga Building, Nyeri Town</span>
            </div>
          </div>

          {/* RIGHT column — article body */}
          <div className="flex-1 min-w-0 w-full">

            {/* Body content */}
            <div className="w-full">
              {post.body ? renderBlocks(post.body) : (
                <p className="text-white/40 text-sm italic">Full article coming soon.</p>
              )}
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/8">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">More Posts</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedPosts.map((p: any) => {
                    const src = getCoverSrc(p)
                    return (
                      <Link key={p._id} href={`/blog/${p.slug?.current ?? p._id}`}
                        className="group flex gap-3 items-start rounded-xl p-3 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {src && (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={src} alt={p.title} fill sizes="56px" className="object-cover group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white/70 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug mb-1">
                            {p.title}
                          </p>
                          {p.publishedAt && (
                            <p className="text-[10px] text-white/30">
                              {new Date(p.publishedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Prev / Next */}
            {(prevPost || nextPost) && (
              <div className="mt-8 pt-6 border-t border-white/8 grid grid-cols-2 gap-4">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug?.current ?? prevPost._id}`}
                    className="group flex flex-col gap-1 p-4 rounded-xl transition-all hover:border-amber-400/30"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="flex items-center gap-1 text-[10px] text-white/30 uppercase tracking-widest">
                      <ChevronLeft className="h-3 w-3" /> Previous
                    </span>
                    <p className="text-xs font-semibold text-white/70 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {prevPost.title}
                    </p>
                  </Link>
                ) : <div />}
                {nextPost ? (
                  <Link href={`/blog/${nextPost.slug?.current ?? nextPost._id}`}
                    className="group flex flex-col gap-1 p-4 rounded-xl text-right transition-all hover:border-amber-400/30"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="flex items-center justify-end gap-1 text-[10px] text-white/30 uppercase tracking-widest">
                      Next <ChevronRight className="h-3 w-3" />
                    </span>
                    <p className="text-xs font-semibold text-white/70 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {nextPost.title}
                    </p>
                  </Link>
                ) : <div />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
