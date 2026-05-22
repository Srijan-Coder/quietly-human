import { defineField, defineType } from 'sanity'

export const announcementType = defineType({
  name: 'announcement',
  title: 'Announcement Bar',
  type: 'document',
  fields: [
    defineField({ name: 'active', title: 'Show Announcement Bar', type: 'boolean', initialValue: false }),
    defineField({ name: 'message', title: 'Message', type: 'string' }),
    defineField({ name: 'linkText', title: 'Link Text (e.g. "Get it now")', type: 'string' }),
    defineField({ name: 'linkUrl', title: 'Link URL', type: 'string' }),
    defineField({
      name: 'style', title: 'Bar Style', type: 'string',
      options: { list: ['warm', 'dark', 'accent', 'midnight'], layout: 'radio' },
      initialValue: 'warm'
    }),
  ],
  preview: { select: { title: 'message', subtitle: 'active' } }
})
