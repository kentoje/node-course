const request = require('supertest');
const { User } = require('../../models/users');
const { Genre } = require('../../models/genres');
let server;

describe('auth middleware', () => {
  beforeEach(() => { server = require('../../app'); });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  let token;
  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' })
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';

    const response = await exec();

    expect(response.status).toBe(401);
  });

  it('should return 400 token is invalid', async () => {
    token = 'a';

    const response = await exec();

    expect(response.status).toBe(400);
  });

  it('should return 200 token is valid', async () => {
    const response = await exec();

    expect(response.status).toBe(200);
  });
});