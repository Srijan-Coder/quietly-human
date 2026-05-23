import { defineField, defineType } from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Reader Notes & Testimonials',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'What They Said', type: 'text', validation: Rule => Rule.required() }),
    defineField({ name: 'name', title: 'Reader Name (or "Anonymous")', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'email', title: 'Reader Email (Private)', type: 'string', description: 'Admin only. This is never displayed on the website.', hidden: false }),
    defineField({ name: 'isApproved', title: 'Approved for Public Display', type: 'boolean', description: 'Toggle this ON to publish the note on the website.', initialValue: false }),
    defineField({ name: 'handle', title: 'Social Handle (optional, e.g. @username)', type: 'string' }),
    defineField({ name: 'platform', title: 'Platform', type: 'string', options: { list: ['Instagram', 'Twitter', 'Email', 'Notion', 'Website Form', 'Other'] } }),
    defineField({ name: 'featured', title: 'Show on Homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'name', subtitle: 'quote' } }
})
