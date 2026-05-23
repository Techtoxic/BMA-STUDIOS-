import { getBlogPosts, getBlogPostBySlug, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, BookOpen, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamicParams = true
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

const categoryLabels: Record<string, string> = {
  tips: 'Photography Tips', bts: 'Behind the Scenes',
  weddings: 'Weddings', gear: 'Gear Reviews',
  news: 'Studio News', tutorials: 'Tutorials',
}

function getReadTime(body: any[]): string {
  if (!body?.length) return '1 min read'
  const wordCount = body.reduce((acc, block) => {
    if (block._type !== 'block') return acc
    const text = block.children?.map((s: any) => s.text || '').join(' ') || ''
    return acc + text.trim().split(/\s+/).filter(Boolean).length
  }, 0)
  const mins = Math.max(1, Math.ceil(wordCount / 200))
  return `${mins} min read`
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
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
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
    const text = block.children
      ?.map((span: any) => {
        let t = span.text || ''
        if (span.marks?.includes('strong')) t = `<strong>${t}</strong>`
        if (span.marks?.includes('em')) t = `<em>${t}</em>`
        if (span.marks?.includes('underline')) t = `<u>${t}</u>`
        return t
      }).join('') || ''

    const style = block.style || 'normal'
    const classes: Record<string, string> = {
      h1: 'text-2xl font-bold text-white mt-10 mb-4 break-words',
      h2: 'text-xl font-bold text-white mt-8 mb-3 break-words',
      h3: 'text-lg font-semibold text-white/90 mt-6 mb-2 break-words',
      h4: 'text-base font-semibold text-white/80 mt-4 mb-2 break-words',
      blockquote: 'border-l-4 border-amber-400 pl-6 italic text-white/60 my-6 py-2 break-words',
      normal: 'text-base text-white/70 leading-relaxed mb-4 break-words w-full',
    }
    if (block.listItem === 'bullet') {
      return <li key={i} className="text-base text-white/70 ml-6 mb-2 list-disc break-words" dangerouslySetInnerHTML={{ __html: text }} />
    }
    if (block.listItem === 'number') {
      return <li key={i} className="text-base text-white/70 ml-6 mb-2 list-decimal break-words" dangerouslySetInnerHTML={{ __html: text }} />
    }
    return (
      <p key={i} className={classes[style] || classes.normal}
        dangerouslySetInnerHTML={{ __html: text || '&nbsp;' }} />
    )
  })
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
  ])
  if (!post) notFound()

  // Prev / Next navigation
  const currentIndex = allPosts.findIndex((p: any) => p._id === post._id)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  const readTime = getReadTime(post.body)

  const coverSrc = post.coverImageUrl || (post.coverImage?.asset?._ref
    ? urlFor(post.coverImage).width(1200).height(600).fit('crop').url()
    : null)

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Back nav */}
      <div className="sticky top-0 z-10 border-b border-white/8"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/#blog"
            className="flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-white/70">BMA Studios</span>
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-10 overflow-x-hidden">
        {/* Category */}
        {post.category && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: 'rgb(251,191,36)' }}>
            {categoryLabels[post.category] ?? post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 break-words">
          {post.title}
        </h1>

        {/* Meta: author · date · read time */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/40 mb-8">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />{post.author}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-amber-400/70">
            <Clock className="h-3.5 w-3.5" />
            {readTime}
          </span>
        </div>

        {/* Cover image */}
        {coverSrc && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10">
            <Image src={coverSrc} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-white/60 leading-relaxed mb-8 pb-8 border-b border-white/8">
            {post.excerpt}
          </p>
        )}

        {/* Body */}
        <div className="prose-bma w-full overflow-x-hidden">
          {post.body ? renderBlocks(post.body) : (
            <p className="text-white/40 text-sm italic">Full article coming soon.</p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl text-center"
          style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <p className="text-white font-semibold mb-2">Ready to capture your moments?</p>
          <p className="text-white/50 text-sm mb-4">BMA Studios — Mahiga Building, Nyeri Town</p>
          <Link href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-black bg-amber-400 hover:bg-amber-300 transition-all">
            Book a Session
          </Link>
        </div>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-10 pt-8 border-t border-white/8 grid grid-cols-2 gap-4">
            {/* Prev = older post */}
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

            {/* Next = newer post */}
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
      </article>
    </div>
  )
}
