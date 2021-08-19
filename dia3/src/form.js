const input = document.querySelector('[data-js="username"]')

const validadeName = (words) => {
  const allowedWords = ['da', 'de', 'do', 'dos']

  return words.map((word) => {
    word = word.replace(/\d/g, '').toLowerCase();

    return allowedWords.includes(word) ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`
  }).join(' ')
}

input.addEventListener('input', (event) => {
  event.target.value = validadeName(event.target.value.split(' '))
})
