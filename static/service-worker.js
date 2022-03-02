/* global self, atob, fetch, Request */

let token = null

self.addEventListener('fetch', event => {
  if (event.request.url.match(/top-secret$/)) {
    event.respondWith((async () =>
      fetch(new Request(event.request, {
        headers: { Authorization: 'Bearer ' + await getToken() }
      }))
    )())
  }
})

async function getToken () {
  token = token || await fetch('/token').then(r => r.text())
  const tokenObject = JSON.parse(atob(token))
  if (tokenObject.valid < new Date().getTime() - 2000) {
    token = null
    return getToken()
  } else {
    return token
  }
}
