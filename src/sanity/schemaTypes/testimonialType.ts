import { defineField, defineType } from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Reader Notes & Testimonials',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'What They Said', type: 'text', validation: Rule => Rule.required() }),
    defineField({ name: 'name', title: 'Reader Name (or "Anonymous")', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'handle', title: 'Social Handle (optional, e.g. @username)', type: 'string' }),
    defineField({ name: 'platform', title: 'Platform', type: 'string', options: { list: ['Instagram', 'Twitter', 'Email', 'Notion', 'Other'] } }),
    defineField({ name: 'featured', title: 'Show on Homepage', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'name', subtitle: 'quote' } }
})
