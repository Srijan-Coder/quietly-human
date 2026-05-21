import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {productType} from './productType'
import {guideType} from './guideType'
import {letterType} from './letterType'
import {ebookType} from './ebookType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, productType, guideType, letterType, ebookType],
}
