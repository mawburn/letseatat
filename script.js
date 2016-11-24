;((d) => {
  'use strict'

  let rList = {

    baseList: [
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
    ],
    
    addTo: (name, weight = 5) => {
      baseList.push({name, weight})
    },

    getWeightedList: function() {
      let weightedList = []

      for(let i=0; i < this.baseList.length; i++) {
        for(let k=0; k < this.baseList[i].weight; k++) {
          weightedList.push(i)
        }
      }

      return weightedList
    }  
  }

  let listItemView = function(place) {
    let liElm = d.createElement('li')
    let liText = d.createTextNode(place.name)

    let btnElm = d.createElement('button')
    let iconElm = d.createElement('i')
    iconElm.classList.add('fa')
    iconElm.classList.add('fa-fw')
    iconElm.classList.add('fa-trash')

    btnElm.appendChild(iconElm)

    btnElm.classList.add('btn')
    btnElm.classList.add('btn-danger')
    btnElm.classList.add('mr-3')
    btnElm.classList.add('remove')
    btnElm.setAttribute('data-name', place.name)

    liElm.appendChild(btnElm)

    let tagElm = d.createElement('span')
    let tagText = d.createTextNode(place.weight)

    tagElm.appendChild(tagText)

    tagElm.classList.add('tag')
    tagElm.classList.add('tag-default')
    tagElm.classList.add('tag-pill')
    tagElm.classList.add('float-xs-right')

    liElm.appendChild(tagElm)
    liElm.appendChild(liText)

    liElm.classList.add('list-group-item')

    return liElm
  }

  const ulList = d.getElementById('currentlist')

  rList.baseList.forEach((place, i) => {
    ulList.appendChild(new listItemView(place))
  })

  const out = d.getElementById('choice')
  let wList = rList.getWeightedList()
  let rand = Math.floor(Math.random() * wList.length)

  out.innerHTML = rList.baseList[wList[rand]].name

  setTimeout(() => {
    out.classList.add('show')
    out.classList.remove('hide')
  }, 42)

  let slider = d.getElementById('opt1-slider')

  slider.addEventListener('input', () => {
    d.getElementById('opt1-val').innerHTML = slider.value
  }, false)

  slider.dispatchEvent(new Event('input'))

  const addWrapper = d.getElementById('addwrapper')
  const addBtn = d.getElementById('addmore')

  addBtn.addEventListener('click', () => {
    if(addWrapper.classList.contains('hide')) {
      addWrapper.classList.add('show')
      addWrapper.classList.remove('hide')
    } else {
      addWrapper.classList.add('hide')
      addWrapper.classList.remove('show')
    }    
  })

  const removeBtn = d.getElementsByClassName('remove')

  Array.from(removeBtn).forEach(elm => {
    elm.addEventListener('click', (e) => {
      const name = e.target.dataset.name

      rList.baseList = rList.baseList.filter(place => {
        return place.name !== name
      })

      wList = rList.getWeightedList()

      const parentNode = e.target.parentNode
      parentNode.classList.add('hide')

      // gross, but the alternative is an optimization
      setTimeout(() => {
        ulList.removeChild(parentNode)
      }, 300)
    })
  })

  const rollAgain = d.getElementById('rollagain')

  rollAgain.addEventListener('click', () => {
    rand = Math.floor(Math.random() * wList.length)

    out.classList.add('hide')
    
    setTimeout(() => {
      out.innerHTML = rList.baseList[wList[rand]].name
      out.classList.remove('hide')
    }, 300)
  })
})(document);