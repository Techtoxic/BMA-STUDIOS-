export default {
  name: 'hero',
  type: 'document',
  title: 'Hero Section',
  fields: [
    {
      name: 'headline',
      type: 'string',
      title: 'Main Headline',
      initialValue: 'Capturing Your Precious Moments'
    },
    {
      name: 'subheadline',
      type: 'text',
      title: 'Subheadline',
      rows: 2,
      initialValue: 'Professional photography services in Nyeri, Kenya'
    },
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
      description: 'Hero section background photo',
      options: {
        hotspot: true
      }
    },
    {
      name: 'ctaText',
      type: 'string',
      title: 'CTA Button Text',
      initialValue: 'Explore Services'
    },
    {
      name: 'phone',
      type: 'string',
      title: 'Phone Number',
      initialValue: '+254 725 297393'
    }
  ],
  preview: {
    select: {
      title: 'headline'
    }
  }
}
