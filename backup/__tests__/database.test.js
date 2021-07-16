const { Pool } = require('pg');

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

    // test send to endpoint -> uuid is uitgekomen

    test('connection', async () => {
        const client = await pgPool.connect();
        try {
            await client.query('BEGIN');

            const { rows } = await client.query('SELECT * FROM story');
            expect(rows).toBeInstanceOf(Array);

        } catch(err) {
          throw err;
        } finally {
            client.release();
        }

    })

});