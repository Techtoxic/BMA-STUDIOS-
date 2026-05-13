import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
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
    "image": image.asset->url
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
    "image": image.asset->url
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
    "image": image.asset->url
  }`
  return await client.fetch(query)
}

export async function getHero() {
  const query = `*[_type == "hero"][0] {
    headline,
    subheadline,
    ctaText,
    phone,
    "backgroundImage": backgroundImage.asset->url
  }`
  return await client.fetch(query)
}
