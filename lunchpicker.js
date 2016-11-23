'use strict'

//(function(window, document) {
  console.log('test')
  fetch('resturaunts.json')
    .then(res => res.json)
    .then(json => {
      makeChoice(json)
    })

  function makeChoice(places) {
    let output = document.getElementById('choice')
    let randSpot = Math.floor(Math.random() * output.length)

    output.innerHTML = output[randSpot].name
  }

//})(window, documnet)