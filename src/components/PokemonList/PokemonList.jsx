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

    const [pokedexUrl, setPokedexUrl ]= useState("https://pokeapi.co/api/v2/pokemon");
    const [nextUrl, setNextUrl ]= useState(''); // Next 20 pokemons 
    const [previousUrl, setPreviousUrl ]= useState(''); //  Previous 20 pokemons

    async function downloadPokemons() {
        setIsLoading(true);
        const response = await axios.get(pokedexUrl); //This downloads list of 20 pokemons

        const pokemonResults = response.data.results; // We get the array of pokemons from result
        console.log(response.data);
        setNextUrl(response.data.next)
        setPreviousUrl(response.data.previous)
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
    }, [pokedexUrl]);

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(isLoading) ? "Loading..." :
                    pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id}id={p.id} />)
                }   
            </div>
            <div className="controls">
                    <button disabled={previousUrl == null} onClick={() => setPokedexUrl(previousUrl)}>Previous</button>
                    <button disabled={nextUrl == null} onClick={() => setPokedexUrl(nextUrl)}>Next</button>
            </div>
        </div>
    )
}

export default PokemonList;