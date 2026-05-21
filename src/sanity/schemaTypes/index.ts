import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './postType'
import { productType } from './productType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, productType],
}
