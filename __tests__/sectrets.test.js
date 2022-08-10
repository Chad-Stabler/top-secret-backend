const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const agent = request.agent(app);

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('/get secrets should not allow unregistered access', async () => {
    await agent.delete('/api/v1/users/sessions');
    const res = await request(app).get('/api/v1/secrets');
  
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('You are not signed in');
  });
  afterAll(() => {
    pool.end();
  });
});
