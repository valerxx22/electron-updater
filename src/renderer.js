const { ipcRenderer } = require('electron');

const select = selector => document.querySelector(selector)

let container = select('#messages')
let progressBar = select('#progressBar')
let version = select('#version')

ipcRenderer.on('message', (event, text) => {
  console.log(text);
  let message = document.createElement('div')
  
  message.innerHTML = text
  container.appendChild(message)

})

ipcRenderer.on('version', (event, text) => {
  console.log(text);
  version.innerText = text
})

ipcRenderer.on('download-progress', (event, text) => {
  console.log(text);
  progressBar.style.width = `${text}%`
})
