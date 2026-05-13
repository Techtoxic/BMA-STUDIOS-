import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// Singleton document types that should only have one instance
const singletonTypes = new Set(['hero'])

export default defineConfig({
  name: 'bma-photography',
  title: 'BMA Photography Studio',
  projectId: 'ufopobpc',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Hero as a singleton — opens directly to the editor
            S.listItem()
              .title('Hero Section')
              .id('hero')
              .child(
                S.document()
                  .schemaType('hero')
                  .documentId('hero')
              ),
            S.divider(),
            // All other document types as normal lists
            ...S.documentTypeListItems().filter(
              (listItem) => !singletonTypes.has(listItem.getId())
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
