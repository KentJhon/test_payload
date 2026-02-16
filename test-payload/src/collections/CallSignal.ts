import type { CollectionConfig } from 'payload'

export const CallSignals: CollectionConfig = {
  slug: 'call-signals',
  admin: {
    useAsTitle: 'callId',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'callId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'from',
      type: 'text',
      required: true,
    },
    {
      name: 'to',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Offer', value: 'offer' },
        { label: 'Answer', value: 'answer' },
        { label: 'ICE Candidate', value: 'ice-candidate' },
        { label: 'Hangup', value: 'hangup' },
      ],
    },
    {
      name: 'data',
      type: 'json',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Ended', value: 'ended' },
      ],
    },
  ],
}
