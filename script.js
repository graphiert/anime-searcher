const searchBar = document.querySelector('#searchbar')
const buttonSearch = document.querySelector('#button-search')
const results = document.querySelector('#results')
const spinner = document.querySelector('.spinner-border')
const notFound = document.querySelector('.not-found')
const container = document.querySelector('.container')

const appendCards = results => {
  if (results.year == null) {
    $('#results').append(`
      <div class="col-md-4 mt-3">
        <div class="card">
        <img src="${results.images.jpg.image_url}" class="card-img-top">
        <div class="card-body">
        <h5 class="card-title">${results.title}</h5>
        <a href="#" data-mal-id="${results.mal_id}" class="card-link"
           data-bs-toggle="modal" data-bs-target="#detailAnime">Click for more info!</a>
      </div></div></div>`)
    } else {
    $('#results').append(`
      <div class="col-md-4 mt-3">
        <div class="card">
        <img src="${results.images.jpg.image_url}" class="card-img-top">
        <div class="card-body">
        <h5 class="card-title">${results.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${results.year}</h6>
        <a href="#" data-mal-id="${results.mal_id}" class="card-link"
           data-bs-toggle="modal" data-bs-target="#detailAnime">Click for more info!</a>
      </div></div></div>`)
    }
}

const infoAnime = result => {
  const modalBody = document.querySelector('.modal-body')
  const malDetailed = document.querySelector('.mal-detailed')
  modalBody.innerHTML ='...'
  let stud = []
  result.studios.forEach(el => stud.push(el.name))
  let studio = stud.join(', ')
  malDetailed.setAttribute('href', result.url)
  $('.modal-body').html(`
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4">
        <img src="${result.images.jpg.large_image_url}" class ="img-fluid">
      </div>
      <div class="col-md-8">
        <ul class="list-group">
          <li class="list-group-item"><h4>${result.title}</h4></li>
          <li class="list-group-item">Score: ${result.score}</li>
          <li class="list-group-item">${result.type}, ${result.episodes} eps</li>
          <li class="list-group-item">Duration: ${result.duration}</li>
          <li class="list-group-item">Studios: ${studio}</li>
        </ul>
      </div>
    </div>
  </div>
  `)
}

const searchAnime = () => {
  let search = searchBar.value
  notFound.classList.add('d-none')
  spinner.classList.remove('d-none')
  fetch(`https://api.jikan.moe/v4/anime?q=${search}`)
  .then(responses => responses.json())
  .then(responses => {
    let resultsApi = responses.data
    if (resultsApi.length == 0) {
      results.innerHTML = ''
      notFound.classList.remove('d-none')
      spinner.classList.add('d-none')
      searchBar.value = ''
    } else {
      results.innerHTML = ''
      spinner.classList.add('d-none')
      resultsApi.forEach(res => appendCards(res))
      searchBar.value = ''
    }
  })
  .catch(err => console.log(err))
}

buttonSearch.addEventListener('click', searchAnime())

searchbar.addEventListener('keyup', e => {
  if (e.which === 13) {
    searchAnime() 
  }
})

container.addEventListener('click', e => {
  if (e.target.className == "card-link") {
    let clickedId = e.target.dataset.malId
    fetch(`https://api.jikan.moe/v4/anime/${clickedId}`)
    .then(responses => responses.json())
    .then(responses => {
      let resultsApi = responses.data
      infoAnime(resultsApi)
     })
    .catch(err => console.log(err))
  }
})
