import { useEffect, useState } from "react";
import axios from 'axios';
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {


    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';

    async function downloadPokemons() {
        const response = await axios.get(POKEDEX_URL); //this downloads lists of 20 pokemon

        const pokemonResults = response.data.results; // we get the array of pokemon from results

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
    }, []);

    return(
        <>
        <div className="pokemon-list-wrapper">
        <div className="pokemon-wrapper">
        {(isLoading) ? 'Loading...' :
            pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
        }
        </div>

        </div>
        <div className="controls">
            <button>prev</button>
            <button>next</button>
        </div>
        </>
    );
}

export default PokemonList;