const { Pool } = require('pg');
const supertest = require('supertest');
const app = require('./../server.js')

const request = supertest(app);


describe('testing postgres', () => {

  let pgPool;

  beforeAll(() => {
    pgPool = new Pool({
      connectionString: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/test'

    });
  });

  afterAll(async () => {

    await pgPool.end();
  });

  test('full circle', async (done) =>{
    const client = await pgPool.connect();
    try {
      let uuid = null;
      await request.post('/story')
        .send({ title: 'test', summary: 'testing' })
        .expect(200)
        .then((res) => {
          uuid = res.body[0].uuid
          done()
        }).catch((e) => {
          console.log(e)
        })

      await client.query('BEGIN');
      const { rows } = await client.query(`SELECT * FROM story WHERE uuid='${uuid}'`);
      expect(rows).toBeInstanceOf(Array);
      expect(rows.length).toBe(1);
    } catch(err) {
      throw err;
    } finally {
      client.release();
    }
  })



});