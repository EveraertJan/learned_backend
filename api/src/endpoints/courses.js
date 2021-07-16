const { checkUUID, generateUUID } = require("../utils/helpers")

const courseEndpoints =  (app, pg) => {
  app.get('/course', async (req, res) => {
    const result = await pg
      .select(['uuid', 'title', 'created_at', "year"])
      .from('course')
    res.json({
        courses: result
    })
  })
  app.get('/course/:uuid', async (req, res) => {
    const inquiry = req.params.uuid;
    if(checkUUID(inquiry)) {
      const result = await pg
        .select(['uuid', 'title', 'created_at', "year"])
        .from('course')
        .where({uuid: req.params.uuid})
      if(result.length != 0) {
        res.json({
            courses: result[0]
        })
      }
      else {
        res.status(404).send({error: "course could not be found"});
      }
    }
    else {
      res.status(401).send({error: "bad request, not a UUID"});
    }
  })

  app.post('/course', async (req, res) => {
    const uuid = generateUUID();
    const toAdd = {
      uuid: uuid,
      year: req.body.year,
      title: req.body.title
    }
    const result = await pg
      .insert(toAdd)
      .into('course')
      .returning('uuid')
    if(result.length != 0) {
      res.json({
          uuid: result[0]
      })
    }
    else {
      res.status(404).send({error: "course could not be added"});
    }
  });
  app.delete("/course/:uuid", async (req, res) => {
    if(checkUUID(req.params.uuid)) {
      const exists = await pg.select("*").table("course").where({uuid: req.params.uuid});
      if(exists.length > 0) {
        const result = await pg.delete().table("course").where({uuid: req.params.uuid}).returning("uuid");
        if(result.length > 0) {
          res.send({ message: "succes", uuid: result[0]});
        }
      }
      else {
        res.status(400).send({message: "course does not exist"})
      }
    }
    else {
      res.status(400).send({message: "No uuid present"})
    }
  })

  app.put("/course/:uuid", async (req, res) => {
    // TODO: update updatedAt
    if(checkUUID(req.params.uuid)) {
      const exists = await pg.select("*").table("course").where({uuid: req.params.uuid});
      if(exists.length > 0) {
        const toAdd = {
          year: req.body.year,
          title: req.body.title
        };
        const result = await pg.update(toAdd).table("course").where({uuid: req.params.uuid}).returning("*");
        if(result.length > 0) {
          res.send({ message: "succes", data: result[0]});
        }
      }
      else {
        const uuid = generateUUID();
        const toAdd = {
          uuid: uuid,
          year: req.body.year,
          title: req.body.title
        };
        const result = await pg.insert(toAdd).table("course").returning("*");
        if(result.length > 0) {
          res.send({ message: "succes", data: result[0]});
        } 
      }
    }
    else {
      res.status(400).send({message: "No uuid present"})
    }
  })
}

module.exports = courseEndpoints;