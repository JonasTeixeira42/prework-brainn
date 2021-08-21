import './style.css'

const url = 'http://localhost:3333/cars'
const toast = document.querySelector('[data-js="toast"]')
const form = document.querySelector('[data-js="form-car"]')
const tbody = document.querySelector('[data-js="table-body"]')
const inputImage = document.querySelector('[data-js="input-image"]')

const addProperties = {
  image: (rowElement, dataElement, value) => {
    const image = document.createElement('img')
    image.className = 'image'
    image.src = value

    dataElement.appendChild(image)
    rowElement.appendChild(dataElement)
  },

  normal: (rowElement, dataElement, value) => {
    dataElement.textContent = value
    rowElement.appendChild(dataElement)
  },

  color: (rowElement, dataElement, value) => {
    const colorDiv = document.createElement('div')
    colorDiv.className = 'color'
    colorDiv.style.background = value

    dataElement.appendChild(colorDiv)
    rowElement.appendChild(dataElement)
  }
}

const setNoCarsMessage = () => {
  const tr = document.createElement('tr')
  const td = document.createElement('td')
  tr.dataset.js = 'no-cars'
  td.colSpan = 6
  td.className = 'td'
  td.textContent = 'Nenhum carro encontrado'

  tr.appendChild(td)
  tbody.appendChild(tr)
}

const removeRow = async (e) => {
  const plate = e.target.dataset.js

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ plate })
    })

    const data = await response.json()

    if(data.error) {
      throw data.message
    }

    addToast(data.message)

    const button = document.querySelector(`[data-js="${plate}"]`)
    const row = button.parentElement.parentElement

    row.remove()
  } catch (error) {
    addToast(error)
  }
}

const listCars = (cars) => {
  cars.forEach((car) => {
    const tr = document.createElement('tr')
    const tdButton = document.createElement('td')
    tdButton.className = 'td'

    const removeButton = document.createElement('button')
    removeButton.className = 'button'
    removeButton.textContent = 'remover'
    removeButton.dataset.js = car.plate

    removeButton.onclick = removeRow

    Object.entries(car).forEach(([name, value]) => {
      const td = document.createElement('td')
      td.className = 'td'

      addProperties.hasOwnProperty(name)
        ? addProperties[name](tr, td, value)
        : addProperties.normal(tr, td, value)

    })

    tdButton.appendChild(removeButton)
    tr.appendChild(tdButton)
    tbody.appendChild(tr)
  })
}

const getCars = async () => {
  try {
    const response = await fetch(url)

    const cars = await response.json()

    cars.length ? listCars(cars) : setNoCarsMessage()
  } catch (error) {
    addToast('Ocorreu um erro, tente mais tarde')
    setNoCarsMessage()
  }
}

const addToast = (message) => {
  toast.textContent = message
  toast.classList.add('show')

  setTimeout(() => {
    toast.classList.remove('show')
  }, 2500)
}

const addCars = async (car) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(car)
    })

    const data = await response.json()

    if(data.error) {
      throw data.message
    }

    addToast(data.message)
    listCars([{...car}])

    form.reset()
    inputImage.focus()
  } catch (error) {
    addToast(error)
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formElements = [...e.target.elements].slice(0, -1)

  const car = {
    image: formElements[0].value,
    brandModel: formElements[1].value,
    year: formElements[2].value,
    plate: formElements[3].value,
    color: formElements[4].value
  }

  const noCarsMessage = document.querySelector('[data-js="no-cars"]')

  if(noCarsMessage) {
    noCarsMessage.remove()
  }

  addCars(car)
})

getCars()
