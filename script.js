const results = document.querySelector('#results')
const searchBar = document.querySelector('#searchbar')

const infoCards = results => {
  let img = results.images.jpg.image_url
  let title = results.title
  let year
  results.year == null ? year = "Unknown" : year = results.year
  let malId = results.mal_id
  
  return {
    img: img,
    title: title,
    year: year,
    malId: malId
  }
}

fetch(`https://api.jikan.moe/v4/anime`)
.then(responses => responses.json())
.then(responses => {
    let cards = ''
    responses.data.forEach(res => {
      let data = infoCards(res)
      cards += `
        <div class="col-md-4 mt-3">
          <div class="card">
          <img src="${data.img}" class="card-img-top">
          <div class="card-body">
          <h5 class="card-title">${data.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${data.year}</h6>
          <a href="#" data-mal-id="${data.malId}" class="card-link"
             data-bs-toggle="modal" data-bs-target="#detailAnime">Click for more info!</a>
        </div></div></div>`
    })
    results.innerHTML = cards
})

const infoAnime = result => {
  let img = result.images.jpg.large_image_url
  let title = result.title
  let score
  result.score == null ? score = "Score: Not rated yet" : score = `Score: ${result.score}`
  let typeEps = `${result.type}, ${result.episodes} ep(s)`
  let duration = `Duration: ${result.duration}`
  let stud = []
  let studio
  result.studios.forEach(el => stud.push(el.name))
  stud.length == 0 ? studio = "Studio: Unknown" : studio = "Studio: " + stud.join(', ')
  let malUrl = result.url
  
  return {
    img: img,
    title: title,
    score: score,
    typeEps: typeEps,
    duration: duration,
    studio: studio,
    malUrl: malUrl
  }
}

const searchAnime = () => {
  let search = searchBar.value
  results.innerHTML = '<div class="spinner-border m-auto" role="status"></div>'
  fetch(`https://api.jikan.moe/v4/anime?q=${search}`)
  .then(responses => responses.json())
  .then(responses => {
    if (responses.data.length == 0) {
      results.innerHTML = `<div class="col-md-4 mt-3">
        <h1 class="text-center">Anime not found!</h1>
      </div>`
      searchBar.value = ''
    } else {
      let cards = ''
      responses.data.forEach(res => {
        let data = infoCards(res)
        cards += `
          <div class="col-md-4 mt-3">
            <div class="card">
            <img src="${data.img}" class="card-img-top">
            <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${data.year}</h6>
            <a href="#" data-mal-id="${data.malId}" class="card-link"
               data-bs-toggle="modal" data-bs-target="#detailAnime">Click for more info!</a>
          </div></div></div>`
      })
      results.innerHTML = cards
      searchBar.value = ''
    }
  })
  .catch(err => alert("ERROR: " + err))
}

results.addEventListener('click', e => {
  if (e.target.className == "card-link") {
    let clickedId = e.target.dataset.malId
    fetch(`https://api.jikan.moe/v4/anime/${clickedId}`)
    .then(responses => responses.json())
    .then(responses => {
      let data = infoAnime(responses.data)
      const modalBody = document.querySelector('.modal-body')
      const malDetailed = document.querySelector('.mal-detailed')
      const closeModal = document.querySelectorAll('#closeModal')
      const modalLabel = document.querySelector('#modalLabel')
      modalLabel.innerHTML = data.title
      modalBody.innerHTML ='...'
      malDetailed.setAttribute('href', data.malUrl)
      modalBody.innerHTML = `
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-4">
                <img src="${data.img}" class ="img-fluid">
              </div>
              <div class="col-md-8">
                <ul class="list-group">
                  <li class="list-group-item"><h4>${data.title}</h4></li>
                  <li class="list-group-item">${data.score}</li>
                  <li class="list-group-item">${data.typeEps}</li>
                  <li class="list-group-item">${data.duration}</li>
                  <li class="list-group-item">${data.studio}</li>
                </ul></div></div></div>`
      closeModal.forEach(el => {
        el.addEventListener('click', () => { 
          modalBody.innerHTML = '...'
          modalLabel.innerHTML = 'Title'
        })
      })
    })
    .catch(err => alert("ERROR: " + err))
  }
})
