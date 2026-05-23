import { defineField, defineType } from 'sanity'

export const userCollectionType = defineType({
  name: 'userCollection',
  title: 'User Collections',
  type: 'document',
  fields: [
    defineField({
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'The unique ID of the user from Clerk Authentication.',
    }),
    defineField({
      name: 'savedItems',
      title: 'Saved Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string', title: 'Item ID (Slug or GUID)' },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'url', type: 'string', title: 'URL Path' },
            { name: 'type', type: 'string', title: 'Content Type' },
            { name: 'savedAt', type: 'datetime', title: 'Saved At', initialValue: () => new Date().toISOString() },
          ]
        }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'clerkUserId',
      items: 'savedItems',
    },
    prepare(selection) {
      const { title, items } = selection
      return {
        title: `User: ${title}`,
        subtitle: `${items ? items.length : 0} saved items`,
      }
    }
  },
})
