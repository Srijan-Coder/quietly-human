import { defineField, defineType } from 'sanity'

export const timeCapsuleType = defineType({
  name: 'timeCapsule',
  title: 'Quiet Archive (Time Capsules)',
  type: 'document',
  fields: [
    defineField({
      name: 'message',
      title: 'The Message',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'unlockDate',
      title: 'Unlock Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'authorAlias',
      title: 'Author Alias',
      type: 'string',
      initialValue: 'A quiet human',
    }),
    defineField({
      name: 'userId',
      title: 'Clerk User ID',
      type: 'string',
      description: 'Used to link the capsule to the user dashboard',
    }),
    defineField({
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
      description: 'Used for automated email delivery on unlock date',
    }),
    defineField({
      name: 'createdAt',
      title: 'Written On',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'message',
      subtitle: 'unlockDate',
    },
  },
})
