import { defineField, defineType } from 'sanity'

export const resourceType = defineType({
  name: 'resource',
  title: 'Free Resources',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Short Description', type: 'text' }),
    defineField({
      name: 'resourceType', title: 'Type', type: 'string',
      options: { list: ['PDF', 'Wallpaper', 'Prompt Card', 'Audio', 'Checklist', 'Template'] }
    }),
    defineField({ name: 'file', title: 'Upload File', type: 'file' }),
    defineField({ name: 'externalUrl', title: 'Or External URL (Google Drive, Notion etc)', type: 'url' }),
    defineField({ name: 'coverImage', title: 'Preview Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'requiresEmail', title: 'Require Email to Download?', type: 'boolean', initialValue: false }),
    defineField({ name: 'featured', title: 'Feature at Top', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ]
})
