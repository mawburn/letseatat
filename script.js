;((win, doc) => {
  'use strict'

  let Places = function() {
    this.localStorageName = 'places'
  }

  Places.prototype.getPlaces = function() {
    const defaultPlaces = [
      { "name": "McDonalds", "weight": 5, url: '#' },
      { "name": "Wendy\'s", "weight": 5, url: '#' },
      { "name": "Burger King", "weight": 5, url: '#' },
      { "name": "Taco Bell", "weight": 5, url: '#' },
      { "name": "Chipotle", "weight": 5, url: '#' },
      { "name": "KFC", "weight": 5, url: '#' },
      { "name": "Subway", "weight": 5, url: '#' },
      { "name": "Panera Bread", "weight": 5, url: '#' },
      { "name": "Chick-fil-A", "weight": 5, url: '#' }
    ]

    return new Promise((resolve, reject) => {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          fetch(`https://wt-5eb43228035d150edc08e7002ca810ee-0.run.webtask.io/pick4me.js?lat=${pos.coords.latitude}&long=${pos.coords.longitude}`, {method: 'POST'})
            .then(response => response.json())
            .then(json => {
              // hitting google API kinda defeats the purpose of storing in local storage.
              // I'll leave it like this for now... 
              win.localStorage.setItem(this.localStorageName, JSON.stringify(json.places))
              resolve()
            })
            .catch((err) => {
              reject(err)
            })
        })
      } else {
        win.localStorage.setItem(this.localStorageName, defaultPlaces)
        resolve()
      }
    })
  }

  Places.prototype.setList = function(list) {
    win.localStorage.setItem(this.localStorageName, JSON.stringify(list))
  }

  Places.prototype.getList = function() {
    return JSON.parse(win.localStorage.getItem(this.localStorageName))
  }

  Places.prototype.add = function(name, weight) {
    let list = this.getList()
    list.push({name: name.trim(), weight})

    this.setList(list)
  }

  Places.prototype.remove = function(name) {
    let list = this.getList()
    let newList = list.filter(place => {
      return place.name !== name
    })

    this.setList(newList)
  }

  Places.prototype.weightedList = function() {
    let list = this.getList()
    let weightedList = []

    for(let i=0; i < list.length; i++) {
      for(let k=0; k < list[i].weight; k++) {
        weightedList.push(i)
      }
    }

    return weightedList
  }

  Places.prototype.getRandom = function() {
    let weightedList = this.weightedList()
    let randIndex = Math.floor(Math.random() * weightedList.length)
    let weightedIndex = weightedList[randIndex]

    return this.getList()[weightedIndex]
  }

  // ------ 

  let DisplayListItem = function(name, weight) { 
    let li = doc.createElement('li')
    li.classList.add('list-group-item')

    let liText = doc.createTextNode(name)

    let icon = doc.createElement('i')
    icon.classList.add('icon-trash')
    icon.setAttribute('aria-hidden', true)

    let btn = doc.createElement('button')
    btn.classList.add('btn', 'btn-danger', 'mr-3', 'remove-place')
    btn.setAttribute('data-name', name)
    btn.setAttribute('aria-label', `Remove: ${name}, weight: ${weight}`)
    btn.appendChild(icon)

    let tag = doc.createElement('span')
    let tagText = doc.createTextNode(weight)
    tag.classList.add('tag', 'tag-pill', 'float-xs-right')

    if(weight <= 2) {
      tag.classList.add('tag-danger')
    } else if(weight >= 8) {
      tag.classList.add('tag-success')
    } else {
      tag.classList.add('tag-default')
    }

    tag.appendChild(tagText)

    li.appendChild(btn)
    li.appendChild(tag)
    li.appendChild(liText)

    return li
  }

  // ------ 

  let places = new Places()

  const choiceElm = doc.getElementById('choice')
  const loadingElm = doc.getElementById('loading')
  const rollAgainElm = doc.getElementById('roll-again')

  const newPaneElm = doc.getElementById('new-pane')
  const newPaneToggleElm = doc.getElementById('new-pane-toggle')
  const newNameElm = doc.getElementById('new-name')
  const newWeightElm = doc.getElementById('new-weight')
  const newWeightValElm = doc.getElementById('new-weight-val')
  const newAddElm = doc.getElementById('new-add')

  const curListElm = doc.getElementById('cur-list')

  places.getPlaces()
    .then(() => {
      const getChoice = places.getRandom()
      choiceElm.innerHTML = `<a href="${getChoice.url}">${getChoice.name}</a>` 
      choiceElm.setAttribute('aria-label', `Let's Eat At: ${getChoice.name}`)
      setTimeout(() => {
        choiceElm.classList.add('show')
        choiceElm.classList.remove('hide')
        loadingElm.style.display = 'none'

        setTimeout(() => {
          choiceElm.focus()
        }, 300)
      }, 42)

      places.getList().forEach((place, i) => {
        curListElm.appendChild(new DisplayListItem(place.name, place.weight))
      })
    })
    .catch(err => {
      console.error(err)
      alert('Sorry an error occured. Please refresh and try again.')
    })

  rollAgainElm.addEventListener('click', () => {
    choiceElm.classList.add('hide')

    // css transition timeout... yuck
    setTimeout(() => {
      const getChoice = places.getRandom()
      choiceElm.innerHTML = `<a href="${getChoice.url}">${getChoice.name}</a>` 
      choiceElm.setAttribute('aria-label', `Let's Eat At: ${getChoice.name}`)
      choiceElm.classList.remove('hide')
      
      // screenreader - I really need a hook for the css transition
      setTimeout(() => {
        choiceElm.focus()
      }, 300)
    }, 300)   
  })

  // event listeners
  newWeightElm.addEventListener('input', (e) => {
    newWeightValElm.innerHTML = newWeightElm.value
  })

  newWeightElm.dispatchEvent(new Event('input'))

  newPaneToggleElm.addEventListener('click', (e) => {
    if(newPaneElm.classList.contains('hide')) {
      newPaneElm.classList.add('show')
      newPaneElm.classList.remove('hide')
      newPaneElm.style.display = 'block'
      newPaneElm.style.opacity = 0

      setTimeout(() => {
        newPaneElm.style.opacity = null
      }, 10)
    } else {
      newPaneElm.classList.add('hide')
      newPaneElm.classList.remove('show')

      setTimeout(() => {
        newPaneElm.style.display = 'none'
      }, 300)
    }    
  })

  newAddElm.addEventListener('click', (e) => {
    const name = newNameElm.value
    const weight = newWeightElm.value

    if(name.length !== 0) {
      places.add(name, weight)

      newNameElm.value = ''
      newWeightElm.value = 5
      newWeightElm.dispatchEvent(new Event('input'))

      curListElm.appendChild(new DisplayListItem(name, weight))
    }
  })

  doc.body.addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-place')) {
      const name = e.target.dataset.name
      const parentNode = e.target.parentNode

      places.remove(name)

      parentNode.classList.add('hide')

      // yuck
      setTimeout(() => {
        curListElm.removeChild(parentNode)
      }, 300)
    }
  })
})(window, document);