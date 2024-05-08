import { Children, useEffect, useState } from "react";
import StartRating from "./StartRating.js"
// import tempMovieData from "./components/movieData.js"
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=626f89cc


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//=========  App  ==========
const KEY = `626f89cc`;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie(id) {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id){
    //除了id相同的那个,其他的全部过滤一下,相当于删除掉了一个
    setWatched(watched=>watched.filter(movie=>movie.imdbID !== id));
  }

  
  useEffect(function () {

    const controller = new AbortController();

    async function fetchMovies() {
      //fetching data
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{single:controller.single})

        if (!res.ok) throw new Error("Something went wrong with fetching data")

        const data = await res.json()
        if (data.Response === 'False') throw new Error("Movie not found");

        setMovies(data.Search)
        setError("");
      } catch (err) {
        
        if(err.name !== "AbortError"){ 
          console.error(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError('');
      //如果是这样的情况,直接返回,不调用fetch函数
      return;
    }
    handleCloseMovie();
    fetchMovies();

    return function(){
      // 当再次键入时,停止当前的fetch
      controller.abort();
    }
  }, [query]);


  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <Error message={error} />}

        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList 
                watched={watched}
                onDeleteWatched = {handleDeleteWatched}  
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

//=========  App  ==========

function Loader() {
  return <p className="loader">Loading...</p>
}

function Error({ message }) {
  return <p className="error"><span>⛔️</span>{message}</p>
}

// =========  NavBar  =======
function NavBar({ children }) {

  return <nav className="nav-bar">
    <Logo />
    {children}
  </nav>
}

function Search({ query, setQuery }) {

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
      {/* Found <strong>X</strong> results */}
    </p>
  )
}

// ===========  NavBar  ==========

// ===========  Main  ==========
function Main({ children }) {
  return (
    <main className="main">{children}</main>
  )
}

function Box({ children }) {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (children)}
    </div>
  )
}

// function

function MoviesList({ movies, onSelectMovie }) {

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie, onCloseMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
  const watchedMovieRate = watched.find((movie) => movie.imdbID === selectedId)?.userRating
  console.log(`看过: ${isWatched}`);
  // console.log(haveID);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Actors: actors,
    Director: director,
    Genre: genre,
    Released: released,
    imdbRating: imdbRating,
    Plot: plot
  } = movie;
  // console.log(title, year, actors, String(imdbRating));

  const [avgRating,setAvgRating] = useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();

    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating)=>(avgRating + userRating) / 2);
  }

  
  

  // 检测按键
  useEffect(function(){
    const Escape = (e)=>{
      if (e.code === 'Escape'){
        onCloseMovie();
        console.log('console');
      }
    }
    document.addEventListener('keydown',Escape)
    // function cleanUp
    return function (){
      document.removeEventListener('keydown',Escape)
    }
  },[onCloseMovie])

  // 搜索输入框中的内容
  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      const data = await res.json()
      console.log(data);
      setMovie(data);
      setIsLoading(false);
    };
    getMovieDetails();
  }, [selectedId])

  // 将标题改成电影名字
  useEffect(function(){
    
    if (!title) return ;
    document.title = `Movie | ${title}`;
    return function(){
      document.title = "usePopcorn";
    }
  },[title])

  return (
    <>
      <div className="details">
        {isLoading ? <Loader /> :
          <>
            <header className="header">
              <button
                className="btn-back"
                onClick={() => onCloseMovie()}
              >
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`}></img>

              <div className="detail-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>🌟</span>
                  {imdbRating}  IMDB rating
                </p >
              </div>
            </header>
            {/* <p>{avgRating}</p> */}
            <section className="rating">
              <div className="rating">

                {
                  !isWatched ?
                    <>
                      <StartRating
                        maxRating={10}
                        size={30}
                        key={selectedId}
                        onSetRating={setUserRating}
                      />

                      {userRating &&
                        <button className="btn-add" onClick={handleAdd}>
                          Add to watched list
                        </button>
                      }
                    </> :
                    (
                      <h2>you have watched this movie🥳,{watchedMovieRate ? `your rate is ${watchedMovieRate}` : "you have not rating yet👈🏼"}</h2>
                    )
                }
              </div>

              <p><em>{plot}</em></p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        }
        {/* {selectedId} */}
      </div>

    </>
  );
}

function WatchedBox({ children }) {

  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (children)}
    </div>
  )
}

function WatchedSummary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating.value));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedMoviesList({ watched ,onDeleteWatched}) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie 
          movie={movie}
          onDeleteWatched = {onDeleteWatched}
        />
      ))}
    </ul>
  )
}

function WatchedMovie({ movie,onDeleteWatched }) {
  console.log(Number(movie.imdbRating));
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button 
          className="btn-delete" 
          onClick={()=>onDeleteWatched(movie.imdbID)}
        >X</button>
      </div>
    </li>
  )
}