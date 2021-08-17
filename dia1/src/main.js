import './style.css'

const link = document.querySelector('[data-js="link"]')
const linkLabel = document.querySelector('[data-js="label"]')
const app = document.querySelector('[data-js="app"]')

app.innerHTML = `
  <h1>B. Academy</h1>
  <p>Boas vindas à semana de pré-work para o Bootcamp em React.js 😁</p>
`

link.addEventListener('click', (event) => {
  event.preventDefault()

  const ariaValue = app.getAttribute('aria-hidden') === 'false' ? 'true' : 'false'

  linkLabel.textContent = ariaValue === 'true' ? 'Exibir' : 'Desaparecer'

  app.setAttribute('aria-hidden', ariaValue)
})
