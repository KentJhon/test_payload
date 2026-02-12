import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'event',
  admin: {
    useAsTitle: 'title', // Shows the title in the Admin list view
  },
  access: {
    create: () => true,
    read: () => true, // Allows public access so SvelteKit can fetch it
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea', // Use 'richText' if you want a full editor
      required: true,
    },
     {
      name: 'event_date',
      type: 'date', // Use 'richText' if you want a full editor
      required: true,
    },
    
  ],
}