import { useState } from "react";
import axios from "axios";
import usePokemonList from "./usePokemonList";

function usePokemonDetails(id) {
    const [pokemon, setPokemon] = useState({});
    async function downloadPokemon() {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon ({
            name: response.data.name,
            image: response.data.sprites.other.dream_world.front_default,
            weight: response.data.weight,
            height: response.data.height,
            types: response.data.types.map((t) => t.type.name)
        });
    }


    usePokemonList(`https://pokeapi.co/api/v2/type/${pokemon.types ? pokemon.types[0] : 'fire'}`, true);


    useEffect(() => {
        downloadPokemon();
        console.log("list", pokemon.types, pokemonListState);
    }, []);

    return [pokemon, pokemonListState];
    // return(
    //     {pokemon.types &&
    //         <div>
    //             More {pokemon.types[0]} type pokemons
    //             <ul>
    //                 {pokemonListHookResponse && pokemonListHookResponse.pokemonListState.pokemonList && pokemonListHookResponse.pokemonListState.pokemonList.map((p) => <li key={p.pokemon.url}>{p.pokemon.name}</li>)}
    //             </ul>
    //         </div>
    //     }
    // )


}

export default usePokemonDetails;