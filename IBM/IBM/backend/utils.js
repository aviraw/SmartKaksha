// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');

// generate token and return it
function generateToken(user) {
  //1. Don't use password and other sensitive fields
  //2. Use the information that are useful in other parts
  if (!user) return null;

  if (!user.ST_id){

    var u = {
      TE_id: user.TE_id,
      TE_FirstName: user.TE_FirstName,
      TE_Emailid: user.TE_Emailid,
      CY_id: user.CY_id,
      TC_id: user.TC_id,
      TP_id: user.TP_id,
      /* userId: user.TE_id,
      name: user.TE_FirstName,
      username: user.TE_Emailid, */
      //isAdmin: user.isAdmin
    };
  }

  if (!user.TE_id){

  var u = {
    ST_id: user.ST_id,
    ST_Firstname: user.ST_Firstname,
    ST_Username: user.ST_Username,
    CY_id: user.CY_id,
    /* userId: user.ST_id,
    name: user.ST_Firstname,
    username: user.ST_Username, */
    //isAdmin: user.isAdmin
  };
}

  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
}

// return basic user details
function getCleanUser(user) {
  if (!user) return null;

  if (!user.ST_id){

    return {
      TE_id: user.TE_id,
      TE_FirstName: user.TE_FirstName,
      TE_Emailid: user.TE_Emailid,
      CY_id: user.CY_id,
      TC_id: user.TC_id,
      TP_id: user.TP_id,
      //isAdmin: user.isAdmin
    };
  }

  if (!user.TE_id){

  return {
    ST_id: user.ST_id,
    ST_Firstname: user.ST_Firstname,
    ST_Username: user.ST_Username,
    CY_id: user.CY_id,
    //isAdmin: user.isAdmin
  };
}

}

module.exports = {
  generateToken,
  getCleanUser
}
