const input = document.querySelector('[data-js="username"]')
const form = document.querySelector('[data-js="form"]')

const validadeName = (words) => {
  const allowedWords = ['da', 'de', 'do', 'dos']

  return words.map((word) => {
    word = word.replace(/\d/g, '').toLowerCase();

    return allowedWords.includes(word) ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`
  }).join(' ')
}

const setAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

const createOptions = (element, colors) => {
  colors.forEach(({ name, value }) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = name
    element.appendChild(option)
  })
}

input.addEventListener('input', (event) => {
  event.target.value = validadeName(event.target.value.split(' '))
})

const selectLabel = document.createElement('label')
const multipleSelect = document.createElement('select')
const colorWrapper = document.createElement('div')

selectLabel.textContent = 'Cores'

const attributes = {
  name: 'colors',
  id: 'colors',
  multiple: true,
  class: 'input'
}

const colors = [
  { name: 'Orange', value: '#ff9e00' },
  { name: 'Purple', value: '#240046' },
  { name: 'Green', value: '#38b000' },
  { name: 'Pink', value: '#f72585' },
  { name: 'Blue', value: '#031d44' }
]

setAttributes(multipleSelect, attributes)
setAttributes(colorWrapper, { class: 'colors-wrapper' })
setAttributes(selectLabel, { class: 'label', for: 'colors' })
createOptions(multipleSelect, colors)

form.appendChild(selectLabel)
form.appendChild(multipleSelect)
form.appendChild(colorWrapper)

multipleSelect.addEventListener('change', (event) => {
  colorWrapper.textContent = ''

  Array.from(event.target.selectedOptions).forEach(option => {
    const square = document.createElement('div')
    setAttributes(square, { class: 'square' })
    square.style.background = option.value
    colorWrapper.appendChild(square)
  })
})
