import { defineField, defineType } from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Your Name',
      type: 'string',
      initialValue: 'Srijan Pandey',
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload your headshot or avatar. Will be shown on the homepage and /about page.',
    }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio (Homepage)',
      type: 'text',
      rows: 3,
      description: 'A 2-3 sentence bio shown on the homepage "About the Creator" section.',
    }),
    defineField({
      name: 'fullStory',
      title: 'Full Story',
      type: 'blockContent',
      description: 'Your full personal story for the /about page. Make it emotional and real.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter/X URL', type: 'url' }),
        defineField({ name: 'pinterest', title: 'Pinterest URL', type: 'url' }),
        defineField({ name: 'gumroad', title: 'Gumroad URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'photo' },
  },
})
