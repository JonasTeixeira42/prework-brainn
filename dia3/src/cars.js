const form = document.querySelector('[data-js="form-car"]')
const tableBody = document.querySelector('[data-js="table-body"]')

const getValues = (elements) => {
  return elements.map(element => ({
    name:  element.name,
    value: element.value
  }))
}

const styledData = {
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

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formElements = [...e.target.elements].slice(0, -1)
  const row = document.createElement('tr')

  getValues(formElements).forEach(({ name, value }) => {
    const rowData = document.createElement('td')
    rowData.className = 'td'

    styledData.hasOwnProperty(name)
      ? styledData[name](row, rowData, value)
      : styledData.normal(row, rowData, value)

    tableBody.appendChild(row)
  })

  form.reset()
  formElements[0].focus()
})
