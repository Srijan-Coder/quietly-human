import { defineField, defineType } from 'sanity'

export const seoEmotionPageType = defineType({
  name: 'seoEmotionPage',
  title: 'SEO Emotion Pages',
  type: 'document',
  fields: [
    defineField({ name: 'emotion', title: 'Emotion Keyword (e.g. "feeling-behind")', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'headline', title: 'Page Headline', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'string' }),
    defineField({ name: 'openingParagraph', title: 'Opening Paragraph', type: 'text' }),
    defineField({ name: 'featuredQuote', title: 'Featured Quote', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'SEO Meta Description', type: 'text' }),
    defineField({
      name: 'relatedGuides', title: 'Related Guides',
      type: 'array', of: [{ type: 'reference', to: [{ type: 'guide' }] }]
    }),
    defineField({
      name: 'relatedBooks', title: 'Related Books',
      type: 'array', of: [{ type: 'reference', to: [{ type: 'ebook' }] }]
    }),
    defineField({ name: 'active', title: 'Published?', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'emotion', subtitle: 'headline' } }
})
