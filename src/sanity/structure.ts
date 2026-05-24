import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Quietly Humans Studio')
    .items([
      // === CONTENT ===
      S.listItem()
        .title('📝 Content')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('post').title('Blog Posts'),
              S.documentTypeListItem('letter').title('Midnight Letters'),
              S.documentTypeListItem('guide').title('Pillar Guides'),
              S.documentTypeListItem('quote').title('Quotes'),
            ])
        ),

      S.divider(),

      // === PRODUCTS & BOOKS ===
      S.listItem()
        .title('📦 Store & Products')
        .child(
          S.list()
            .title('Store & Products')
            .items([
              S.documentTypeListItem('book').title('Books (Free & Paid)'),
              S.documentTypeListItem('product').title('Digital Products'),
              S.documentTypeListItem('ebook').title('Legacy Ebooks'),
            ])
        ),

      S.divider(),

      // === SITE SETTINGS ===
      S.listItem()
        .title('⚙️ Site Settings')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.documentTypeListItem('announcement').title('Announcement Bar'),
              S.documentTypeListItem('aboutPage').title('About Page'),
              S.documentTypeListItem('leadMagnetSettings').title('Lead Magnet Settings'),
              S.documentTypeListItem('socialLink').title('Social Links'),
            ])
        ),

      S.divider(),

      // === COMMUNITY ===
      S.listItem()
        .title('👥 Community')
        .child(
          S.list()
            .title('Community')
            .items([
              S.documentTypeListItem('subscriber').title('Subscribers'),
              S.documentTypeListItem('author').title('Authors'),
              S.documentTypeListItem('category').title('Categories'),
            ])
        ),
    ])
