
const supertest = require('supertest');
const app = require('../server.js');

const request = supertest(app);



describe( 'GET /test', () => {

  test('if the app responds with 200', async (done) => {
      await request
        .get('/test')
        .expect(200, done())
  })
})



describe('GET /', () => {
  let uuid;
  test('responds', async (done) => {
      // run code
      const response = await request.post('/')
      expect(response.status).toBe(200, done());
  })

})