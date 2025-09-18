import request from 'supertest'
import { bootstrapTestApp, TestContext } from './helpers'

describe('AppController (e2e)', () => {
  let ctx: TestContext

  beforeEach(async () => {
    ctx = await bootstrapTestApp()
  })

  afterEach(async () => {
    if (ctx?.app) {
      await ctx.app.close()
    }
  })

  it('/ (GET)', async () => {
    const res = await request(ctx.httpServer).get('/')
    expect(res.status).toBe(200)
    expect(res.text).toBe('Hello World!')
  })
})
