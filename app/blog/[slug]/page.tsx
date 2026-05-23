import { getBlogPosts, getBlogPostWithBody, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamicParams = true
export const revalidate = 60

interface Props {
  params: { slug: string }
}

const categoryLabels: Record<string, string> = {
  tips: 'Photography Tips', bts: 'Behind the Scenes',
  weddings: 'Weddings', gear: 'Gear Reviews',
  news: 'Studio News', tutorials: 'Tutorials',
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p: any) => ({
    // Use slug if available, otherwise fall back to _id
    slug: p.slug?.current ?? p._id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await getBlogPosts()
  const post = posts.find((p: any) => (p.slug?.current ?? p._id) === params.slug)
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
      h1: 'text-2xl font-bold text-white mt-10 mb-4',
      h2: 'text-xl font-bold text-white mt-8 mb-3',
      h3: 'text-lg font-semibold text-white/90 mt-6 mb-2',
      h4: 'text-base font-semibold text-white/80 mt-4 mb-2',
      blockquote: 'border-l-4 border-amber-400 pl-6 italic text-white/60 my-6 py-2',
      normal: 'text-base text-white/70 leading-relaxed mb-4',
    }
    if (block.listItem === 'bullet') {
      return <li key={i} className="text-base text-white/70 ml-6 mb-2 list-disc" dangerouslySetInnerHTML={{ __html: text }} />
    }
    if (block.listItem === 'number') {
      return <li key={i} className="text-base text-white/70 ml-6 mb-2 list-decimal" dangerouslySetInnerHTML={{ __html: text }} />
    }
    return (
      <p key={i} className={classes[style] || classes.normal}
        dangerouslySetInnerHTML={{ __html: text || '&nbsp;' }} />
    )
  })
}

export default async function BlogPost({ params }: Props) {
  const posts = await getBlogPosts()
  const post = posts.find((p: any) => (p.slug?.current ?? p._id) === params.slug)
  if (!post) notFound()

  const fullPost = await getBlogPostWithBody(post._id)
  const related = posts.filter((p: any) => p._id !== post._id && p.category === post.category).slice(0, 3)

  const coverSrc = post.coverImageUrl || (post.coverImage?.asset?._ref
    ? urlFor(post.coverImage).width(1200).height(600).fit('crop').url()
    : null)

  return (
    <div className="min-h-screen bg-black text-white">
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

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Category */}
        {post.category && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: 'rgb(251,191,36)' }}>
            {categoryLabels[post.category] ?? post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-white/40 mb-8">
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
        <div className="prose-bma">
          {fullPost?.body ? renderBlocks(fullPost.body) : (
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

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Related Posts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel: any) => (
                <Link key={rel._id} href={`/blog/${rel.slug?.current}`}
                  className="group rounded-xl overflow-hidden transition-all hover:border-amber-400/30"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {rel.coverImageUrl && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={rel.coverImageUrl} alt={rel.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-xs font-semibold text-white/80 group-hover:text-amber-400 transition-colors line-clamp-2">{rel.title}</p>
                    <p className="text-[10px] text-white/30 mt-1 line-clamp-2">{rel.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
