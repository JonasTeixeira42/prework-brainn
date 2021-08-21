import './style.css'
import { get, post, del } from './http'

type ImageType = {
  src: string;
  alt: string;
}

export type Car = {
  image: string;
  brandModel: string;
  color: string;
  plate: string;
  year: string;
}

type ElementProperties = {
  type: string;
  value: string | ImageType;
}

type ElementTypes = {
  image: (data: ImageType) => HTMLTableDataCellElement;
  text: (data: string) => HTMLTableDataCellElement;
  color: (data: string) => HTMLTableDataCellElement;
}

type GetFormElements = (target: HTMLFormElement) => (elementName: string) => HTMLInputElement

const url = 'http://localhost:3333/cars'
const form = document.querySelector<HTMLFormElement>('[data-js="cars-form"]')!
const table = document.querySelector<HTMLTableSectionElement>('[data-js="table"]')!

const getFormElement: GetFormElements = (target) => (elementName) => {
  return target[elementName]
}

const elementTypes: ElementTypes = {
  image: createImage,
  text: createText,
  color: createColor,
}

function createImage (data: ImageType) {
  const td = document.createElement('td')
  const img = document.createElement('img')
  img.src = data.src
  img.alt = data.alt
  img.width = 100
  td.appendChild(img)
  return td
}

function createText (value: string) {
  const td = document.createElement('td')
  td.textContent = value
  return td
}

function createColor (value: string) {
  const td = document.createElement('td')
  const div = document.createElement('div')
  div.style.width = '100px'
  div.style.height = '100px'
  div.style.background = value
  td.appendChild(div)
  return td
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const target = e.target as HTMLFormElement

  if(!target) {
    return null
  }

  const getElement = getFormElement(target)

  const image = getElement('image')

  const data = {
    image: getElement('image').value,
    brandModel: getElement('brand-model').value,
    year: getElement('year').value,
    plate: getElement('plate').value,
    color: getElement('color').value,
  }

  const result = await post(url, data)

  if (result.error) {
    console.log('deu erro na hora de cadastrar', result.message)
    return
  }

  const noContent = document.querySelector('[data-js="no-content"]')
  if (noContent) {
    table.removeChild(noContent)
  }

  createTableRow(data)

  target.reset()
  image.focus()
})

function createTableRow (data: Car) {
  const elements: ElementProperties[] = [
    { type: 'image', value: { src: data.image, alt: data.brandModel } },
    { type: 'text', value: data.brandModel },
    { type: 'text', value: data.year },
    { type: 'text', value: data.plate },
    { type: 'color', value: data.color }
  ]

  const tr = document.createElement('tr')
  tr.dataset.plate = data.plate

  elements.forEach(element => {
    let td

    if(element.type === 'image') {
      td = elementTypes.image(element.value as ImageType)
    }

    if(element.type === 'text') {
      td = elementTypes.text(element.value as string)
    }

    if(element.type === 'color') {
      td = elementTypes.color(element.value as string)
    }

    if(td) {
      tr.appendChild(td)
    }
  })

  const button = document.createElement('button')
  button.textContent = 'Excluir'
  button.dataset.plate = data.plate

  button.addEventListener('click', handleDelete)

  tr.appendChild(button)

  table.appendChild(tr)
}

async function handleDelete (e: MouseEvent) {
  const button = e.target as HTMLButtonElement

  if(!button) {
    return
  }

  const plate = button.dataset.plate

  if(!plate) {
    return
  }

  const result = await del(url, { plate })

  if (result.error) {
    console.log('erro ao deletar', result.message)
    return
  }

  const tr = document.querySelector<HTMLTableRowElement>(`tr[data-plate="${plate}"]`)!
  table.removeChild(tr)
  button.removeEventListener('click', handleDelete)

  const allTrs = table.querySelector('tr')
  if (!allTrs) {
    createNoCarRow()
  }
}

function createNoCarRow () {
  const tr = document.createElement('tr')
  const td = document.createElement('td')
  const thsLength = document.querySelectorAll('table th').length.toString()
  td.setAttribute('colspan', thsLength)
  td.textContent = 'Nenhum carro encontrado'

  tr.dataset.js = 'no-content'
  tr.appendChild(td)
  table.appendChild(tr)
}

async function main () {
  const result = await get(url)

  if (result.error) {
    console.log('Erro ao buscar carros', result.message)
    return
  }

  if (result.length === 0) {
    createNoCarRow()
    return
  }

  result.forEach(createTableRow)
}

main()
