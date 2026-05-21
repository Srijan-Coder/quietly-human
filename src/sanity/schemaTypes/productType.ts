import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Digital Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'price',
      title: 'Price ($)',
      type: 'number',
    }),
    defineField({
      name: 'link',
      title: 'Gumroad/Payhip Link',
      type: 'url',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
