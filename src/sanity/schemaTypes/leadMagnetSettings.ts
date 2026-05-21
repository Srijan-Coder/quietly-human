import { defineField, defineType } from 'sanity'

export const leadMagnetSettings = defineType({
  name: 'leadMagnetSettings',
  title: '7-Day Reset Links',
  type: 'document',
  fields: [
    defineField({
      name: 'notionLink',
      title: 'Notion Template URL',
      type: 'url',
      description: 'The link users get after they enter their email.',
    }),
    defineField({
      name: 'driveLink',
      title: 'Google Drive Asset URL',
      type: 'url',
      description: 'The link to Google Drive folders/files for the reset.',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'text',
      initialValue: 'Your 7-Day Reset has begun. Access your resources below.',
    }),
  ],
})
