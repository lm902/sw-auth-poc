/* global atob, btoa */

const Koa = require('koa')
const Router = require('@koa/router')
const send = require('koa-send')
const path = require('path')
const cors = require('@koa/cors')

let token = null

const app = new Koa()

const router = new Router()

router.get('/token', (ctx, next) => {
  token = btoa(JSON.stringify({
    token: Math.random().toString(),
    valid: new Date().getTime() + 10000
  }))
  ctx.body = token
})

router.get('/top-secret', (ctx, next) => {
  const tokenInHeader = ctx.header?.authorization?.match(/^Bearer (.+)$/)[1]
  if (token && tokenInHeader) {
    const tokenInHeaderObject = JSON.parse(atob(tokenInHeader))
    const tokenObject = JSON.parse(atob(token))
    if (tokenInHeaderObject.token !== tokenObject.token) {
      ctx.status = 401
      return
    } else if (tokenObject.valid < new Date().getTime()) {
      ctx.status = 401
      return
    }
  } else {
    ctx.status = 401
    return
  }
  ctx.body = 'Hello world!'
})

router.get('/(.*)', (ctx, next) => send(ctx, ctx.path, {
  root: path.join(__dirname, 'static'),
  index: 'index.html'
}))

app.use(cors({
  allowHeaders: ['Authorization']
}))

app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
