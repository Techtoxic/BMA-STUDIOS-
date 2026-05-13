export default {
  name: 'services',
  type: 'document',
  title: 'Services',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Service Title',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
      description: 'Short description under title'
    },
    {
      name: 'price',
      type: 'string',
      title: 'Price',
      description: 'e.g. "From KSH 45,000"'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Service Image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'icon',
      type: 'string',
      title: 'Icon',
      description: 'Lucide icon name (e.g. Heart, Camera, Palette)',
      initialValue: 'Camera'
    },
    {
      name: 'orientation',
      type: 'string',
      title: 'Image Orientation',
      options: {
        list: [
          { title: 'Portrait (tall)', value: 'portrait' },
          { title: 'Landscape (wide)', value: 'landscape' }
        ]
      },
      initialValue: 'landscape'
    },
    {
      name: 'order',
      type: 'number',
      title: 'Display Order',
      description: 'Lower numbers appear first'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      media: 'image'
    }
  }
}
