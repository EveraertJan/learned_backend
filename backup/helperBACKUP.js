
  
const {v1: uuidv1 } = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },

  /**
  *
  */
  limitToTen: (InputArray) => {
    if(typeof InputArray == 'object') {
      return InputArray.slice(0, 10)
    }
    return 
  },

  /**
  * string die je meegeeft mag maximaal 50 karakters lang zijn, 
  * en moet een string zijn, en begint met hoofdletter
  */
  lengthCheck: (inputString) => {
    if(typeof inputString == 'string') {
      if(inputString.length <= 50) {
        if(/^[A-Z]/.test(inputString)) {
          return true 
        }
      }
    }
    return false 
  },

}

module.exports = Helpers
