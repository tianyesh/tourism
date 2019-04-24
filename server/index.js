const express = require('express')
const consola = require('consola')
const {
  Nuxt,
  Builder
} = require('nuxt')
const app = express()

import router from './routes/index.js';
import db from './db/db.js';
const cookieParser = require('cookie-parser')
const session = require('express-session')
const connectMongo = require('connect-mongo')
const configs = require('./config/default.js')

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host,
    port
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  const MongoStore = connectMongo(session);
  app.use(cookieParser());
  app.use(session({
    name: configs.session.name,
    secret: configs.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: configs.session.cookie,
    store: new MongoStore({
      url: configs.url
    })
  }))
  router(app);

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
