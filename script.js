;((win, doc) => {
  'use strict'

  let Places = function() {
    this.localStorageName = 'places'

    if(!win.localStorage.getItem(this.localStorageName)) {
       let list = [
        { "name": "Popeyes", "weight": 1 },
        { "name": "Wendy's", "weight": 2 },
        { "name": "Moes", "weight": 5 },
        { "name": "Crazy Hibachi", "weight": 5 },
        { "name": "Mama's Gyros", "weight": 5 },
        { "name": "On the Border", "weight": 5 },
        { "name": "Buffalo Wild Wings", "weight": 5 },
        { "name": "Larry's", "weight": 5 },
        { "name": "BJ's Brewhouse", "weight": 5 },
        { "name": "Panera Bread", "weight": 5 }
      ]

      win.localStorage.setItem(this.localStorageName, JSON.stringify(list))
    }
  }

  Places.prototype.setList = function(list) {
    win.localStorage.setItem(this.localStorageName, JSON.stringify(list))
  }

  Places.prototype.getList = function() {
    return JSON.parse(win.localStorage.getItem(this.localStorageName))
  }

  Places.prototype.add = function(name, weight) {
    let list = this.getList()
    list.push({name, weight})

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
    icon.classList.add('fa', 'fa-fw', 'fa-trash')

    let btn = doc.createElement('button')
    btn.classList.add('btn', 'btn-danger', 'mr-3', 'remove-place')
    btn.setAttribute('data-name', name)
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

  // page elms
  const choiceElm = doc.getElementById('choice')
  const rollAgainElm = doc.getElementById('roll-again')

  const newPaneElm = doc.getElementById('new-pane')
  const newPaneToggleElm = doc.getElementById('new-pane-toggle')
  const newNameElm = doc.getElementById('new-name')
  const newWeightElm = doc.getElementById('new-weight')
  const newWeightValElm = doc.getElementById('new-weight-val')
  const newAddElm = doc.getElementById('new-add')

  const curListElm = doc.getElementById('cur-list')

  // init page choice
  choiceElm.innerHTML = places.getRandom().name
  setTimeout(() => {
    choiceElm.classList.add('show')
    choiceElm.classList.remove('hide')
  }, 42)

  rollAgainElm.addEventListener('click', () => {
    choiceElm.classList.add('hide')

    // yuck
    setTimeout(() => {
      choiceElm.innerHTML = places.getRandom().name
      choiceElm.classList.remove('hide')
    }, 300)   
  })

  places.getList().forEach((place, i) => {
    curListElm.appendChild(new DisplayListItem(place.name, place.weight))
  })

  // event listeners
  newWeightElm.addEventListener('input', (e) => {
    newWeightValElm.innerHTML = newWeightElm.value
  })

  newWeightElm.dispatchEvent(new Event('input'))

  newPaneToggleElm.addEventListener('click', (e) => {
    let addClass = 'show'
    let removeClass = 'hide'

    if(newPaneElm.classList.contains('hide')) {
      newPaneElm.classList.add('show')
      newPaneElm.classList.remove('hide')
    } else {
      newPaneElm.classList.add('hide')
      newPaneElm.classList.remove('show')
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