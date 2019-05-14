const crypto = require('crypto');

module.exports = function decrypt(encVal,algo,key) {
  let decipher = crypto.createDecipher(algo,key);
  let decryptVal = decipher.update(encVal,'hex','utf8');
  decryptVal += decipher.final('utf8');
  return  decryptVal;
}
