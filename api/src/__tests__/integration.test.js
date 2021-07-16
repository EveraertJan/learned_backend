const supertest = require('supertest');
const app = require('./../server.js')

const request = supertest(app);


describe('GET /test endpoint', () =>{

  test('check if it responds with 201', async (done) => {
    try {
      await request.get('/test')
        .expect(204)
        .then((res) => {
          expect(res.body).toStrictEqual({})
          done()
        });
    }  catch(e) {
      if(e) console.log(e); done(e)
      done()
    }
  })
  test('check if it responds with 400 when sent data', async (done) => {
    try {
      await request.get('/test')
        .query({ id: null})
        .expect(400)
        .then((res) => {
          done()
        });
    }  catch(e) {
      if(e) console.log(e); done(e)
      done()
    }
  })
})

describe('POST /test endpoint', () =>{

  test('check if it responds with 201, if got object', async (done) => {
    try {
      await request.post('/test')
        .send({ data: [] })
        .expect(201)
        .then((res) => {
          done()
        });
    }  catch(e) {
      if(e) console.log(e); done(e)
      done()
    }
  })
  test('check if it responds with 400 when sent without data', async (done) => {
    try {
      await request.post('/test')
        .expect(400)
        .then((res) => {
          expect(res.body).toStrictEqual({})
          done()
        });
    }  catch(e) {
      if(e) console.log(e); done(e)
      done()
    }
  })
})

