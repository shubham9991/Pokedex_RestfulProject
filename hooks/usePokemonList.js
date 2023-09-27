import axios from "axios";
import { useEffect, useState } from "react";

function usePokemonList(url, type) {
    const [pokemonListState, setPokemonListState] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: url,
        nextUrl: '',
        prevUrl: ''
    });

    async function downloadPokemons() {
        setPokemonListState((state) => ({...state, isLoading: true}));
        const response = await axios.get(pokemonListState.pokedexUrl); //this downloads lists of 20 pokemon

        const pokemonResults = response.data.results; // we get the array of pokemon from results

        console.log("response ise", response.data.pokemon);
        console.log(pokemonListState);
        setPokemonListState((state) => ({
            ...state,
            nextUrl: response.data.next, 
            prevUrl: response.data.previous
        }));

        //iterating over the array of pokemon and using their url to create an array of promises
        //that will download those 20 pokemons
        if(type) {
            setPokemonListState((state) => ({
                ...state,
                pokemonList: response.data.pokemon.slice(0, 5)
            }))
        } else {
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
    }

    useEffect(() => {
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]);

    return [pokemonListState, setPokemonListState]
}

export default usePokemonList;