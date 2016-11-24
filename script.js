;((d) => {
  'use strict'

  let rList = {

    baseList: [
{
  "name": "Popeyes",
  "weight": 3
},
{
  "name": "Wendy's",
  "weight": 9
},
{
  "name": "Moes",
  "weight": 5
},
{
  "name": "Crazy Hibachi - Mongolian Grill",
  "weight": 5
},
{
  "name": "Crazy Hibachi - Hibachi",
  "weight": 5
},
{
  "name": "Mama's Gyros",
  "weight": 5
},
{
  "name": "On the Border",
  "weight": 5
},
{
  "name": "Buffalo Wild Wings",
  "weight": 5
},
{
  "name": "Larry's",
  "weight": 5
},
{
  "name": "BJ's Brewhouse",
  "weight": 5
},
{
  "name": "Panera Bread",
  "weight": 5
}
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

  const out = d.getElementById('choice')
  let wList = rList.getWeightedList()
  let rand = Math.floor(Math.random() * wList.length)

  out.innerHTML = rList.baseList[wList[rand]].name

  setTimeout(() => {
    out.classList.add('show')
    out.classList.remove('hide')
  }, 42)

  let slider = d.getElementById('opt1-slider')

  slider.addEventListener('input', function() {
    d.getElementById('opt1-val').innerHTML = slider.value
  }, false)

  slider.dispatchEvent(new Event('input'))
})(document);