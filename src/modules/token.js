const jwt = require('jsonwebtoken')

const TOKEN_KEY = 'x4TDI23nkifaASDOJOASLasd5y'
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).send('Token Required')
  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) return res.status(403).send('Token invalidate')
    req.user = user
    next()
  })
}

module.exports = {
  verifyToken,
  TOKEN_KEY,
}
