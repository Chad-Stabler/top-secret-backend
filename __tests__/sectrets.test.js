const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const agent = request.agent(app);

const mockUser = {
  email: 'test@defense.gov',
  password: '12345'
};

const testSecret = {
  title: 'first secret test',
  description: 'this is the test for the first secret in my database'
};

const regAndSignIn = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  
  const user = await UserService.create({ ...mockUser, ...userProps });
  
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('/get secrets should return secrets for authenticated users', async () => {
    const [agent] = await regAndSignIn();
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toBe(200);
  });
  it('/get secrets should not allow unregistered access', async () => {
    await agent.delete('/api/v1/users/sessions');
    const res = await request(app).get('/api/v1/secrets');
  
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('You are not signed in');
  });
  it('posting secret should be denied for unauth users', async () => {
    const res = await request(app).post('/api/v1/secrets').send(testSecret);

    expect(res.status).toBe(401);
  });
  it('should post a secret for auth user', async () => {
    const [agent] = await regAndSignIn();
    const res = await agent.post('/api/v1/secrets').send(testSecret);
    expect(res.status).toBe(200);
    const { title, description } = testSecret;
    expect(res.body.title).toBe(title);
    expect(res.body.description).toBe(description);
  });
  afterAll(() => {
    pool.end();
  });
});
