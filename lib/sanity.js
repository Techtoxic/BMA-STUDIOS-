import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'ufopobpc',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Fetch queries
export async function getServices() {
  const query = `*[_type == "services"] | order(order asc) {
    _id,
    title,
    subtitle,
    price,
    icon,
    orientation,
    image,
    "imageUrl": image.asset->url
  }`
  return await client.fetch(query)
}

export async function getProducts() {
  const query = `*[_type == "products"] | order(order asc) {
    _id,
    name,
    category,
    price,
    originalPrice,
    rating,
    inStock,
    description,
    featured,
    image,
    "imageUrl": image.asset->url
  }`
  return await client.fetch(query)
}

export async function getPortfolio() {
  const query = `*[_type == "portfolio"] | order(date desc) {
    _id,
    title,
    category,
    client,
    date,
    featured,
    image,
    "imageUrl": image.asset->url
  }`
  return await client.fetch(query)
}

export async function getBlogPosts() {
  const query = `*[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    author,
    publishedAt,
    featured,
    coverImage,
    "coverImageUrl": coverImage.asset->url
  }`
  return await client.fetch(query)
}

export async function getHero() {
  const query = `*[_type == "hero"] | order(_updatedAt desc) [0] {
    headline,
    subheadline,
    ctaText,
    phone,
    backgroundImage,
    "backgroundImageUrl": backgroundImage.asset->url
  }`
  return await client.fetch(query)
}

export async function getPortfolioByCategories(categories) {
  const query = `*[_type == "portfolio" && category in $categories] | order(date desc) {
    _id, title, category, image, "imageUrl": image.asset->url
  }`
  return await client.fetch(query, { categories })
}

export async function getBlogPostWithBody(id) {
  const query = `*[_type == "blog" && _id == $id][0] {
    _id, title, slug, excerpt, category, author, publishedAt, coverImage,
    "coverImageUrl": coverImage.asset->url,
    body[] {
      ...,
      _type == "image" => { ..., "url": asset->url }
    }
  }`
  return await client.fetch(query, { id })
}
