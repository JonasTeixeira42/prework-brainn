import './style.css'

const url = 'http://localhost:3333/cars'
const tbody = document.querySelector('[data-js="table-body"]')

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
  td.colSpan = 5
  td.className = 'td'
  td.textContent = 'Nenhum carro encontrado'

  tr.appendChild(td)
  tbody.appendChild(tr)
}

const addCars = (cars) => {
  cars.forEach((car) => {
    const tr = document.createElement('tr')

    Object.entries(car).forEach(([name, value]) => {
      const td = document.createElement('td')
      td.className = 'td'

      addProperties.hasOwnProperty(name)
        ? addProperties[name](tr, td, value)
        : addProperties.normal(tr, td, value)

      tbody.appendChild(tr)
    })
  })
}

const getCars = async () => {
  try {
    const response = await fetch(url)

    const cars = await response.json()

    cars.length ? addCars(cars) : setNoCarsMessage()
  } catch (error) {
    console.warn('error:', error)
  }
}

getCars()
