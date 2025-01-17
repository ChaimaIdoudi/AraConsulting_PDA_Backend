const app = require('./app')
//import app from './app'
const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
