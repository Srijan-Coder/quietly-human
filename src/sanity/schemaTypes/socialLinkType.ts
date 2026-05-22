import { defineField, defineType } from 'sanity'

export const socialLinkType = defineType({
  name: 'socialLink',
  title: 'Link-in-Bio Links',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Button Label', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'url', title: 'URL', type: 'url', validation: Rule => Rule.required() }),
    defineField({
      name: 'icon', title: 'Icon', type: 'string',
      options: { list: ['instagram', 'youtube', 'twitter', 'notion', 'email', 'book', 'gift', 'heart', 'link', 'download'] }
    }),
    defineField({ name: 'highlighted', title: 'Highlight this button?', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
    defineField({ name: 'active', title: 'Visible?', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } }
})
