import { useEffect, useState } from "react";
import axios from 'axios';
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {


    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    const [pokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');

    const [nextUrl, setNextUrl] = useState('');
    const [prevUrl, setprevUrl] = useState('');


    async function downloadPokemons() {
        setisLoading(true);
        const response = await axios.get(pokedexUrl); //this downloads lists of 20 pokemon

        const pokemonResults = response.data.results; // we get the array of pokemon from results

        setNextUrl(response.data.next)
        setprevUrl(response.data.previous)
        //iterating over the array of pokemon and using their url to create an array of promises
        //that will download those 20 pokemons
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
        //passing that promise array to axio.all
        const pokemonData = await axios.all(pokemonResultPromise);
        console.log(pokemonData);

        //now iterate over the data of eachv pokemon
        const pokeListResult =  pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name, 
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny, 
                types: pokemon.types
            }
        });
        console.log(pokeListResult);
        setPokemonList(pokeListResult);

        setisLoading(false);
    }

    useEffect(() => {
        downloadPokemons();
    }, [pokedexUrl]);

    return(
        <>
        <div className="pokemon-list-wrapper">
        <div className="pokemon-wrapper">
        {(isLoading) ? 'Loading...' :
            pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
        }
        <div className="controls">
            <button disabled={prevUrl == null} onClick={() => setPokedexUrl(prevUrl)}>prev</button>
            <button disabled={nextUrl == null} onClick={() => setPokedexUrl(nextUrl)}>next</button>
        </div>
        </div>

        </div>

        </>
    );
}

export default PokemonList;