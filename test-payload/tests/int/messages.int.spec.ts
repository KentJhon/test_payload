import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
const createdIds: number[] = []

describe('Messages collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterAll(async () => {
    // Clean up all messages created during tests
    for (const id of createdIds) {
      try {
        await payload.delete({ collection: 'messages', id })
      } catch {
        // Ignore if already deleted
      }
    }
  })

  it('creates a message with sender and content', async () => {
    const message = await payload.create({
      collection: 'messages',
      data: {
        sender: 'Alice',
        content: 'Hello, world!',
      },
    })

    createdIds.push(message.id as number)

    expect(message.sender).toBe('Alice')
    expect(message.content).toBe('Hello, world!')
    expect(message.id).toBeDefined()
  })

  it('reads messages', async () => {
    const message = await payload.create({
      collection: 'messages',
      data: {
        sender: 'Bob',
        content: 'Test read',
      },
    })
    createdIds.push(message.id as number)

    const result = await payload.find({
      collection: 'messages',
      where: { id: { equals: message.id } },
    })

    expect(result.docs).toHaveLength(1)
    expect(result.docs[0].sender).toBe('Bob')
    expect(result.docs[0].content).toBe('Test read')
  })

  it('finds a message by id', async () => {
    const message = await payload.create({
      collection: 'messages',
      data: {
        sender: 'Charlie',
        content: 'Find me',
      },
    })
    createdIds.push(message.id as number)

    const found = await payload.findByID({
      collection: 'messages',
      id: message.id,
    })

    expect(found.sender).toBe('Charlie')
    expect(found.content).toBe('Find me')
  })

  it('rejects creation without required sender field', async () => {
    await expect(
      payload.create({
        collection: 'messages',
        data: {
          sender: '',
          content: 'No sender',
        } as any,
      }),
    ).rejects.toThrow()
  })

  it('rejects creation without required content field', async () => {
    await expect(
      payload.create({
        collection: 'messages',
        data: {
          sender: 'Alice',
          content: '',
        } as any,
      }),
    ).rejects.toThrow()
  })

  it('enforces sender maxLength of 50', async () => {
    const longSender = 'A'.repeat(51)

    await expect(
      payload.create({
        collection: 'messages',
        data: {
          sender: longSender,
          content: 'Test',
        },
      }),
    ).rejects.toThrow()
  })

  it('enforces content maxLength of 1000', async () => {
    const longContent = 'A'.repeat(1001)

    await expect(
      payload.create({
        collection: 'messages',
        data: {
          sender: 'Alice',
          content: longContent,
        },
      }),
    ).rejects.toThrow()
  })

  it('allows sender at exactly 50 characters', async () => {
    const sender = 'A'.repeat(50)

    const message = await payload.create({
      collection: 'messages',
      data: {
        sender,
        content: 'Boundary test',
      },
    })
    createdIds.push(message.id as number)

    expect(message.sender).toBe(sender)
  })

  it('allows content at exactly 1000 characters', async () => {
    const content = 'B'.repeat(1000)

    const message = await payload.create({
      collection: 'messages',
      data: {
        sender: 'Alice',
        content,
      },
    })
    createdIds.push(message.id as number)

    expect(message.content).toBe(content)
  })

  it('deletes a message', async () => {
    const message = await payload.create({
      collection: 'messages',
      data: {
        sender: 'ToDelete',
        content: 'Delete me',
      },
    })

    await payload.delete({
      collection: 'messages',
      id: message.id,
    })

    await expect(
      payload.findByID({
        collection: 'messages',
        id: message.id,
      }),
    ).rejects.toThrow()
  })
})
