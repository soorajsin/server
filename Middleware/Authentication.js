const jwt = require("jsonwebtoken");
const keysecret = "jklknhgfdreswercfghbnjhkilmnjhg";
const userdb = require("../Model/userSchema");


const authentication = async (req, res, next) => {
          try {
                    const token = await req.headers.authorization;
                    // console.log(token);

                    if (!token) {
                              return res.status(401).json({
                                        error: "Not found token"
                              })
                    } else {
                              const verifyToken = jwt.verify(token, keysecret);
                              // console.log(verifyToken);

                              if (!verifyToken) {
                                        return res.status(502).send('Invalid Token');
                              } else {
                                        const getData = await userdb.findOne({
                                                  _id: verifyToken._id
                                        });
                                        // console.log(getData);

                                        if (!getData) {
                                                  return res.status(403).send('User not Found')
                                        } else {
                                                  req.getData = getData;

                                                  next();
                                        }
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Authentiction internal error"
                    })
          }
}

module.exports = authentication;