import { defineField, defineType } from 'sanity'

export const subscriberType = defineType({
  name: 'subscriber',
  title: 'Subscribers (Leads)',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'source',
      title: 'Source (e.g. 7-Day Reset)',
      type: 'string',
      initialValue: '7-Day Reset',
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'firstName',
    },
  },
})
