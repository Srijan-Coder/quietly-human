import { defineField, defineType, defineArrayMember } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Digital Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Notion Template', value: 'notion' },
          { title: 'Free Ebook', value: 'free_ebook' },
          { title: 'Premium Ebook', value: 'premium_ebook' },
          { title: 'Physical Book', value: 'physical_book' },
          { title: 'Digital Bundle', value: 'bundle' },
          { title: 'Membership', value: 'membership' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'price',
      title: 'Price ($) — Leave 0 for Free',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'The main product image. Will be shown on product cards and the store page.',
    }),
    defineField({
      name: 'demoImages',
      title: 'Demo / Preview Images',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      description: 'Screenshots, previews, or demo images for the product page gallery.',
    }),
    defineField({
      name: 'demoFile',
      title: 'Demo / Sample File',
      type: 'file',
      options: { storeOriginalFilename: true },
      description: 'A free sample PDF, preview chapter, or demo template.',
    }),
    defineField({
      name: 'link',
      title: 'Purchase Link (Gumroad/Amazon/Payhip)',
      type: 'url',
      description: 'Where customers go to buy this product.',
    }),
    defineField({
      name: 'description',
      title: 'Product Description',
      type: 'blockContent',
      description: 'Full rich-text description for the product page.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description (for cards)',
      type: 'text',
      rows: 2,
      description: 'A one-line teaser shown on product cards.',
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji Icon',
      type: 'string',
      description: 'An emoji to represent this product on cards (e.g. 📓, 🧠, 📦)',
    }),
    defineField({
      name: 'whatsIncluded',
      title: "What's Included",
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Bullet points of what the buyer gets.',
    }),
    defineField({
      name: 'whoItsFor',
      title: "Who It's For",
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', type: 'string', title: 'Question' }),
            defineField({ name: 'answer', type: 'text', title: 'Answer' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'productType',
      media: 'coverImage',
    },
  },
})
