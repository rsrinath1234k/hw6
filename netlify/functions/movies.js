// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  // write out inputs by user
  console.log(`the year is ${year} and genre is ${genre} `)
  if (year == undefined || genre==undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Missing either year or genre in url! pls fix thx` // a string of data telling user to fix any input problems
    }
  }
  // creating structure for count and array for movies
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    for (let i=0; i < moviesFromCsv.length; i++) {
      let movie=moviesFromCsv[i]
      //Create new  object containing relevant fields we want in our array
      let movObject = {
        title: movie.primaryTitle,
        yearRelease: movie.startYear,
        genres: movie.genres}
      //have if statement that pulls in results from the two inputted variables and excludes results where genres and runtime are null
      if (movie.startYear== year&&movie.genres!=`\\N`&&movie.runtimeMinutes!=`\\N`&&movie.genres.includes(genre)) {
      //push the movie object and add one to the counter
          returnValue.movies.push(movObject)
          returnValue.numResults=returnValue.numResults+1
      }
    }


    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}