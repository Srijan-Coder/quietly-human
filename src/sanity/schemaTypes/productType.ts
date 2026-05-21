import { defineField, defineType, defineArrayMember } from 'sanity'

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
    defineField({
      name: 'description',
      title: 'Emotional Description',
      type: 'text',
    }),
    defineField({
      name: 'whatsIncluded',
      title: 'What\'s Included',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'whoItsFor',
      title: 'Who It\'s For',
      type: 'text',
    }),
    defineField({
      name: 'faq',
      title: 'Frequently Asked Questions',
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
  ],
})
