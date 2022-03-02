/* global fetch */

navigator.serviceWorker.register('service-worker.js')

document.querySelector('button').onclick = event => {
  event.preventDefault()
  fetchTopSecret()
}

async function fetchTopSecret () {
  document.querySelector('p').textContent = await fetch('/top-secret').then(r => r.text())
}
