import type { CollectionConfig } from 'payload'

export const TicketTemplates: CollectionConfig = {
  slug: 'ticket-templates',
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ticketSettings',
      type: 'json',
      required: true,
    },
    {
      name: 'elements',
      type: 'json',
      required: true,
    },
    {
      name: 'labelConfig',
      type: 'json',
    },
    {
      name: 'csvData',
      type: 'json',
    },
    {
      name: 'csvHeaders',
      type: 'json',
    },
  ],
}
