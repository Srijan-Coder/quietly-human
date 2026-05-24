import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { productType } from './productType'
import { guideType } from './guideType'
import { letterType } from './letterType'
import { ebookType } from './ebookType'
import { subscriberType } from './subscriberType'
import { leadMagnetSettings } from './leadMagnetSettings'
import { quoteType } from './quoteType'
import { resourceType } from './resourceType'
import { announcementType } from './announcementType'
import { blogSeriesType } from './blogSeriesType'
import { socialLinkType } from './socialLinkType'
import { seoEmotionPageType } from './seoEmotionPageType'
import { aboutPageType } from './aboutPageType'

import { bookType } from './bookType'
import { timeCapsuleType } from './timeCapsuleType'
import { userCollectionType } from './userCollectionType'
import { sharedKitType } from './sharedKitType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType, categoryType, postType, authorType,
    productType, guideType, letterType, ebookType, bookType,
    subscriberType, leadMagnetSettings,
    quoteType, resourceType, announcementType,
    blogSeriesType, socialLinkType, seoEmotionPageType, timeCapsuleType, userCollectionType, sharedKitType,
    aboutPageType,
  ],
}
