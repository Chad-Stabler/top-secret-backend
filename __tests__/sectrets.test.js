const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const agent = request.agent(app);

const mockUser = {
  email: 'test@example.com',
  password: '12345'
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
    console.log(res.text);
    expect(res.status).toBe(200);
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
