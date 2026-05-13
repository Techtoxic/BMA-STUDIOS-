export default {
  name: 'blog',
  type: 'document',
  title: 'Blog Posts',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Post Title',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Short Description',
      description: 'A brief summary shown on the blog card',
      rows: 3,
      validation: Rule => Rule.required().max(200)
    },
    {
      name: 'body',
      type: 'array',
      title: 'Blog Content',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Photography Tips', value: 'tips' },
          { title: 'Behind the Scenes', value: 'bts' },
          { title: 'Weddings', value: 'weddings' },
          { title: 'Gear Reviews', value: 'gear' },
          { title: 'Studio News', value: 'news' },
          { title: 'Tutorials', value: 'tutorials' }
        ]
      }
    },
    {
      name: 'author',
      type: 'string',
      title: 'Author',
      initialValue: 'BMA Studios'
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published Date',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured Post',
      description: 'Show this post prominently',
      initialValue: false
    }
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      subtitle: 'category'
    }
  }
}
