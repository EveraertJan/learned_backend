

const databaseHelpers = {
  async initialiseTables(pg) {
    await pg.schema.hasTable('course').then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable('course', (table) => {
            table.increments();
            table.uuid('uuid').notNullable().unique();
            table.integer('year');
            table.string('title');
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log('created table course');
          });

      }
    });
    await pg.schema.hasTable('subject').then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable('subject', (table) => {
            table.increments();
            table.uuid('uuid').notNullable().unique();
            table.string('title');
            table.string('summary');
            table.json("structure");
            table.integer('level').defaultTo(0);
            table
                .uuid("course_id")
                .unsigned()
                .references("uuid")
                .inTable("course")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log('created table subject');
          });
      }
      // else {
      //   await pg.schema.alterTable('subject', (table) => {
      //     table.integer('level').defaultTo(0);
      //   })
      // }
    });
    await pg.schema.hasTable('contentBlock').then(async (exists) => {
      if (!exists) {
        await pg.schema
          .createTable('contentBlock', (table) => {
            table.increments();
            table.uuid('uuid').notNullable().unique();
            table.json('body');
            table.integer('order');
            table.string('type');
            table
                .uuid("subect_id")
                .unsigned()
                .references("uuid")
                .inTable("subject")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log('created table contentBlock');
          });
          
      }
    });
  }
};

module.exports = databaseHelpers;