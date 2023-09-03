import { useEffect, useState } from "react";
import axios from 'axios';
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {


    const [pokemonListState, setPokemonListState] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon',
        nextUrl: '',
        prevUrl: ''
    });


    async function downloadPokemons() {
        setPokemonListState((state) => ({...state, isLoading: true}));
        const response = await axios.get(pokemonListState.pokedexUrl); //this downloads lists of 20 pokemon

        const pokemonResults = response.data.results; // we get the array of pokemon from results

        setPokemonListState((state) => ({
            ...state,
            nextUrl: response.data.next, 
            prevUrl: response.data.previous
        }));

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
        setPokemonListState((state) => ({
            ...state,
            pokemonList: pokeListResult,
            isLoading: false
        }));

    }

    useEffect(() => {
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]);

    return(
        <>
        <div className="pokemon-list-wrapper">
        <div className="pokemon-wrapper">
        {(pokemonListState.isLoading) ? 'Loading...' :
            pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
        }
        <div className="controls">
            <button disabled={pokemonListState.prevUrl == null} onClick={() => setPokemonListState({...pokemonListState, pokedexUrl: pokemonListState.prevUrl})}>prev</button>
            <button disabled={pokemonListState.nextUrl == null} onClick={() => setPokemonListState({...pokemonListState, pokedexUrl: pokemonListState.nextUrl})}>next</button>
        </div>
        </div>

        </div>

        </>
    );
}

export default PokemonList;