const { checkUUID, generateUUID } = require("../utils/helpers")

const contentBlockEndpoints =  (app, pg) => {
  app.get('/contentBlock', async (req, res) => {
    const result = await pg
      .select("*")
      .from('contentBlock')
    res.json({
        contentBlocks: result
    })
  })
  app.get('/contentBlock/:uuid', async (req, res) => {
    const inquiry = req.params.uuid;
    if(checkUUID(inquiry)) {
      const result = await pg
        .select("*")
        .from('contentBlock')
        .where({uuid: req.params.uuid})
      if(result.length != 0) {
        res.json({
            contentBlocks: result[0]
        })
      }
      else {
        res.status(404).send({error: "contentBlock could not be found"});
      }
    }
    else {
      res.status(401).send({error: "bad request, not a UUID"});
    }
  })

  app.post('/contentBlock', async (req, res) => {
    const uuid = generateUUID();
    if(checkUUID(req.body.subject_id)) {
      const exists = await pg.select("*").table("subject").where({uuid: req.body.subject_id});
      if(exists.length > 0) {
        const toAdd = {
          uuid: uuid,
          subject_id: req.body.subject_id,
          body: JSON.stringify(req.body.content),
          type: req.body.type
        }
       
        let result;
        if(req.body.type == "SUBJECT") {
          // set level on subject to 1;
          // Where uuid in body 
          result = await pg.update({level: 1}).table("subject").where({uuid: req.body.content.uuid}).returning("uuid");
        } else { 
          result = await pg
            .insert(toAdd)
            .into('contentBlock')
            .returning('uuid')
        }
        if(result.length != 0) {
          const struct = req.body.structure;
          const newStruct = swapArray(struct, {
            uuid: req.body.type == "SUBJECT" ? req.body.content.uuid : result[0],
            type: toAdd.type,
          })
          const updateSubject = await pg
            .update({structure: JSON.stringify(newStruct)})
            .table("subject")
            .where({uuid: toAdd.subject_id})
            .returning("*");
          if(updateSubject.length > 0) {

            res.json({
                uuid: result[0],
                newStruct
            })
          }
          else {
            res.status(404).send({error: "subject could not be updated"});
          }
        }
        else {
          res.status(404).send({error: "contentBlock could not be added"});
        }
      } else {
        res.status(400).send({message: "subject does not exist"});
      }
    } else {
      res.status(400).send({message: "subject_id is not a UUID"});
    }
  });

  app.delete("/contentBlock/:uuid", async (req, res) => {
    if(checkUUID(req.params.uuid)) {
      const exists = await pg.select("*").table("contentBlock").where({uuid: req.params.uuid});
      if(exists.length > 0) {
        const result = await pg.delete().table("contentBlock").where({uuid: req.params.uuid}).returning("uuid");
        if(result.length > 0) {
          
          const curStruct = await pg.select("structure").table("subject").where({uuid: exists[0].subject_id});
          const newStruct = removeFromStruct(curStruct[0].structure, req.params.uuid);
          const updateRes = await pg.update({structure: JSON.stringify(newStruct)}).table("subject").where({uuid: exists[0].subject_id}).returning("uuid");
          
          if(updateRes.length > 0) {
            res.send({ message: "succes", uuid: result[0]});
          }
          else {
            res.status(500).send({message: "deleted, but could not update struct"});
          }
          
        }
      }
      else {
        res.status(400).send({message: "contentBlock does not exist"})
      }
    }
    else {
      res.status(400).send({message: "No uuid present"})
    }
  })

  app.put("/contentBlock/:uuid", async (req, res) => {
    // TODO: update updatedAt
    if(checkUUID(req.params.uuid)) {
      const exists = await pg.select("*").table("contentBlock").where({uuid: req.params.uuid});
      if(exists.length > 0) {
        const toAdd = {
          type: req.body.type,
          body: JSON.parse(req.body.content)
        };
        const result = await pg.update(toAdd).table("contentBlock").where({uuid: req.params.uuid}).returning("*");
        if(result.length > 0) {
          res.send({ message: "succes", data: result[0]});
        }
      }
      else {
        res.status(400).send({message: "Does not exist"})
      }
    }
    else {
      res.status(400).send({message: "No uuid present"})
    }
  })
}

function removeFromStruct(arr, uuid) {
  return arr.filter((a) => {
    if(a instanceof Array) {
      removeFromStruct(a, uuid);
    }
    return a.uuid != uuid
  })
}

function swapArray(a, item) {
  console.log(a)
  return a.map((i) => {
    if(i instanceof Array) {
      return swapArray(i, item);
    }
    else if(i == "HERE") {
      return item
    }
    else {
      return i;
    }
  })
}

module.exports = contentBlockEndpoints;