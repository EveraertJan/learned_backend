const { checkUUID, generateUUID } = require("../utils/helpers")

const subjectEndpoints =  (app, pg) => {
  app.get('/subject', async (req, res) => {
    const result = await pg
      .select(['subject.uuid', 'subject.level', 'subject.title', "subject.summary",  "course.title as course"])
      .from('subject')
      .leftJoin("course", "subject.course_id", "course.uuid")
      // .where('subject.level', '=', 0)
    res.json({
        subjects: result
    })
  })
  app.get('/subject/:uuid', async (req, res) => {
    const inquiry = req.params.uuid;
    if(checkUUID(inquiry)) {
      const result = await pg
        .select("*")
        .from('subject')
        .where({uuid: req.params.uuid})
      if(result.length != 0) {
        console.log(result[0].structure)
        const structure = result[0].structure;
        
        new Promise(async (resolve, reject) => {
          await fillStructure(pg, structure, resolve);
        }).then((data)=> {
          res.json({
            ...result[0],
            structure: data,
            schema: structure 
          })
        })
      }
      else {
        res.status(404).send({error: "subject could not be found"});
      }
    }
    else {
      res.status(401).send({error: "bad request, not a UUID"});
    }
  })

  app.post('/subject', async (req, res) => {
    const uuid = generateUUID();
    const toAdd = {
      uuid: uuid,
      course_id: req.body.course_id,
      title: req.body.title,
      summary: req.body.summary,
      structure: [],
      level: 0
    }
    const result = await pg
      .insert(toAdd)
      .into('subject')
      .returning('uuid')
    if(result.length != 0) {
      res.json({
          uuid: result[0]
      })
    }
    else {
      res.status(404).send({error: "subject could not be added"});
    }
  });

  app.delete("/subject/:uuid", async (req, res) => {
    if(checkUUID(req.params.uuid)) {
      const exists = await pg.select("*").table("subject").where({uuid: req.params.uuid});
      if(exists.length > 0) {
        const result = await pg.delete().table("subject").where({uuid: req.params.uuid}).returning("uuid");
        if(result.length > 0) {
          res.send({ message: "succes", uuid: result[0]});
        }
      }
      else {
        res.status(400).send({message: "subject does not exist"})
      }
    }
    else {
      res.status(400).send({message: "No uuid present"})
    }
  })

  app.put("/subject/:uuid", async (req, res) => {
    // TODO: update updatedAt
    if(checkUUID(req.params.uuid)) {
      const exists = await pg.select("*").table("subject").where({uuid: req.params.uuid});
      if(exists.length > 0) {
        const toAdd = {
          year: req.body.year,
          title: req.body.title
        };
        const result = await pg.update(toAdd).table("subject").where({uuid: req.params.uuid}).returning("*");
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
        const result = await pg.insert(toAdd).table("subject").returning("*");
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

async function fillStructure(pg, structure, resolve) {
  if(structure instanceof Array && structure.length > 0) {

    const newStruct = await structure.map(async (s) => {
      if(s instanceof Array) {
        const n = await fillStructure(pg, s);
        return n;
      } else {
        if(s.type == "SUBJECT") {
          const res = await pg
            .select(["title", "summary", "level"])
            .table("subject")
            .where({uuid: s.uuid})
          return { ...res[0], type: "SUBJECT" };
        }
        else {
          const res = await pg
            .select(["uuid", "body", "type"])
            .table("contentBlock")
            .where({uuid: s.uuid})
          return res[0];
        }

      }
    })

    Promise.all(newStruct).then((data) => {
      resolve(data);
    })
  }
}

module.exports = subjectEndpoints;