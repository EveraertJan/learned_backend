
const {v1: uuidv1 } = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },

  checkUUID: (uuid) => {
    const regex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g;
    if(typeof uuid == 'string') {
      if(regex.test(uuid)) {
        return uuid
      }
    }

    return false
  },

  checkTitleLength: (inputString) => {
    if(typeof inputString == 'string') {
      if(inputString.length <= 50) {
        if(/^[A-Z]/.test(inputString)) {
          return inputString
        }
      }
    }

    return false
  }

}

module.exports = Helpers
