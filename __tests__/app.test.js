const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@example.com',
  password: '12345'
};

// const regAndSignIn = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;
//   const agent = request.agent(app);

//   const user = await UserService.create({ ...mockUser, ...userProps });

//   const { email } = user;
//   await (await agent.post('/api/v1/users/sessions')).setEncoding({ email, password });

//   return [agent, user];
// };

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('add user route should add a new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(resp.body).toEqual({
      id: expect.any(String),
      email
    });
  });
  afterAll(() => {
    pool.end();
  });
});
