;((d) => {
  'use strict'

  let Places = function(placeList) {
    if(placeList !== undefined) {
      this.list = placeList
    } else {
      this.list = [
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
    }
  }

  Places.prototype.add = function(name, weight) {
    this.list.push({name, weight})
  }

  Places.prototype.remove = function(name) {
    this.list = this.list.filter(place => {
      return place.name !== name
    })
  }

  Places.prototype.weightedList = function() {
    let weightedList = []

    for(let i=0; i < this.list.length; i++) {
      for(let k=0; k < this.list[i].weight; k++) {
        weightedList.push(i)
      }
    }

    return weightedList
  }

  Places.prototype.getRandom = function() {
    let weightedList = this.weightedList()
    let randIndex = Math.floor(Math.random() * weightedList.length)
    let weightedIndex = weightedList[randIndex]

    return this.list[weightedIndex]
  }

  // ------ 

  let DisplayListItem = function(name, weight) { 
    let li = d.createElement('li')
    li.classList.add('list-group-item')

    let liText = d.createTextNode(name)

    let icon = d.createElement('i')
    icon.classList.add('fa', 'fa-fw', 'fa-trash')

    let btn = d.createElement('button')
    btn.classList.add('btn', 'btn-danger', 'mr-3', 'remove-place')
    btn.setAttribute('data-name', name)

    let tag = d.createElement('span')
    tag.classList.add('tag', 'tag-default', 'tag-pill')

    btn.appendChild(icon)
    li.appendChild(btn)
    li.appendChild(tag)
    li.appendChild(liText)

    return li
  }

  // ------ 

  let places = new Places()

  // page elms
  const choiceElm = d.getElementById('choice')
  const rollAgainElm = d.getElementById('roll-again')

  const newPaneElm = d.getElementById('new-pane')
  const newPaneToggleElm = d.getElementById('new-pane-toggle')
  const newNameElm = d.getElementById('new-name')
  const newWeightElm = d.getElementById('new-weight')
  const newWeightValElm = d.getElementById('new-weight-val')
  const newAddElm = d.getElementById('new-add')

  const curListElm = d.getElementById('cur-list')

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

  places.list.forEach((place, i) => {
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

    places.add(name, weight)

    newNameElm.value = ''
    newWeightElm.value = 5
    newWeightElm.dispatchEvent(new Event('input'))

    curListElm.appendChild(new DisplayListItem(name, weight))
  })

  d.body.addEventListener('click', (e) => {
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
})(document);