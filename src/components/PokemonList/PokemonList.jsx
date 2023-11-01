import { useEffect, useState } from "react";
import axios from 'axios';
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";


// For Capitalize first letter of name.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


function PokemonList() {

    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const POKEDEX_URL = "https://pokeapi.co/api/v2/pokemon";

    async function downloadPokemons() {
        const response = await axios.get(POKEDEX_URL); //This downloads list of 20 pokemons

        const pokemonResults = response.data.results; // We get the array of pokemons from result
        console.log(response.data);
        // Iterating over the array of pokemons, and using their URL to create an array of promises that will download those 20 pokemons
        const pokemonResultsPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url)); 
        // Passing that promise array to axios.all 
        const pokemonData = await axios.all(pokemonResultsPromise); // Array of 20 pokemon detailed data 
        console.log(pokemonData);
        // Now iterate on the data of each pokemon, and extract id, name, image, types
        const pokeListResult = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: capitalizeFirstLetter(pokemon.name),
                image: (pokemon.sprites.other)
                    ? pokemon.sprites.other.dream_world.front_default
                    : pokemon.sprites.front_shiny,
                types: pokemon.types
            };
        });

        console.log(pokeListResult);
        setPokemonList(pokeListResult);
        setIsLoading(false);
    }

    useEffect(() => {
        downloadPokemons();
    }, []);

    return (
        <div className="pokemon-list-wrapper">
            <div>Pokemon List</div>
            {(isLoading) ? "Loading..." :
                pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
            }
        </div>
    )
}

export default PokemonList;