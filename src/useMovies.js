import {useState,useEffect} from 'react'


const KEY = `626f89cc`;
export  function useMovies(query) {

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(function () {
        // callback?.();

        const controller = new AbortController();

        async function fetchMovies() {
            //fetching data
            try {
                setIsLoading(true);
                setError('');
                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { single: controller.single })

                if (!res.ok) throw new Error("Something went wrong with fetching data")

                const data = await res.json()
                if (data.Response === 'False') throw new Error("Movie not found");

                setMovies(data.Search)
                setError("");
            } catch (err) {

                if (err.name !== "AbortError") {
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
        fetchMovies();

        return function () {
            // 当再次键入时,停止当前的fetch
            controller.abort();
        }
    }, [query]);
    return {movies,isLoading,error}
}
