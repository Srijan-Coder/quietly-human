import { defineField, defineType } from 'sanity'

export const sharedKitType = defineType({
  name: 'sharedKit',
  title: 'Shared Kits (Care Packages)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Folder Name',
      type: 'string',
    }),
    defineField({
      name: 'authorId',
      title: 'Author Clerk ID',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Kit Items (JSON)',
      type: 'text',
      description: 'The stringified array of CollectionItems',
    }),
  ],
})
