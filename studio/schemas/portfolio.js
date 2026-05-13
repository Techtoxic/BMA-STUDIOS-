export default {
  name: 'portfolio',
  type: 'document',
  title: 'Portfolio',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Image Title',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      type: 'image',
      title: 'Portfolio Image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Wedding', value: 'wedding' },
          { title: 'Portrait', value: 'portrait' },
          { title: 'Event', value: 'event' },
          { title: 'Studio', value: 'studio' },
          { title: 'Creative', value: 'creative' },
          { title: 'Product', value: 'product' },
          { title: 'Outdoor', value: 'outdoor' }
        ]
      }
    },
    {
      name: 'client',
      type: 'string',
      title: 'Client Name',
      description: 'Optional - for testimonial/reference'
    },
    {
      name: 'date',
      type: 'date',
      title: 'Shoot Date'
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured',
      description: 'Show in main gallery first',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image'
    }
  }
}
