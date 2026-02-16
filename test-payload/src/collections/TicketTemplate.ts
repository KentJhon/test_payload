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
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'ticket',
          options: [
            { label: 'Ticket', value: 'ticket' },
            { label: 'Convention ID', value: 'convention-id' },
            { label: 'Certificate', value: 'certificate' },
            { label: 'Others', value: 'others' },
          ],
        },
        {
          name: 'width',
          type: 'number',
          required: true,
          defaultValue: 226.32258,
        },
        {
          name: 'height',
          type: 'number',
          required: true,
          defaultValue: 80,
        },
        {
          name: 'fitMode',
          type: 'select',
          required: true,
          defaultValue: 'cover',
          options: [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Stretch', value: 'stretch' },
            { label: 'Original', value: 'original' },
          ],
        },
      ],
    },
    {
      name: 'elements',
      type: 'json',
      required: true,
    },
    {
      name: 'labelConfig',
      type: 'group',
      fields: [
        {
          name: 'labelColumn',
          type: 'text',
          defaultValue: '',
        },
        {
          name: 'labelColors',
          type: 'json',
          defaultValue: {},
        },
        {
          name: 'labelBlockWidth',
          type: 'number',
          defaultValue: 20,
        },
        {
          name: 'rightBlockEnabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'rightBlockWidth',
          type: 'number',
          defaultValue: 20,
        },
      ],
    },
    {
      name: 'csvData',
      type: 'json',
    },
    {
      name: 'csvHeaders',
      type: 'json',
    },
    {
      name: 'printSettings',
      type: 'group',
      fields: [
        {
          name: 'ticketGap',
          type: 'number',
          defaultValue: 2,
        },
      ],
    },
  ],
}
