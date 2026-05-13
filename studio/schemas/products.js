export default {
  name: 'products',
  type: 'document',
  title: 'Products',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Product Name',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Camera', value: 'Camera' },
          { title: 'Lens', value: 'Lens' },
          { title: 'Lighting', value: 'Lighting' },
          { title: 'Stabilizer', value: 'Stabilizer' },
          { title: 'Storage', value: 'Storage' },
          { title: 'Support', value: 'Support' },
          { title: 'Bags', value: 'Bags' },
          { title: 'Accessories', value: 'Accessories' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'price',
      type: 'number',
      title: 'Current Price (KSH)',
      validation: Rule => Rule.required()
    },
    {
      name: 'originalPrice',
      type: 'number',
      title: 'Original Price (KSH)',
      description: 'For sale items (leave empty if no discount)'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Product Image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'rating',
      type: 'number',
      title: 'Rating',
      description: '1.0 to 5.0',
      initialValue: 4.5,
      validation: Rule => Rule.min(1).max(5)
    },
    {
      name: 'inStock',
      type: 'boolean',
      title: 'In Stock',
      initialValue: true
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 3
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured Product',
      description: 'Show this product prominently',
      initialValue: false
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
      title: 'name',
      subtitle: 'category',
      media: 'image'
    }
  }
}
