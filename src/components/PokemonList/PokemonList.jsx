import { useEffect, useState } from "react";
import axios from 'axios';
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";


// For Capitalize first letter of name.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


function PokemonList() {

    // const [pokemonList, setPokemonList] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [pokedexUrl, setPokedexUrl ]= useState("https://pokeapi.co/api/v2/pokemon");
    // const [nextUrl, setNextUrl ]= useState(''); // Next 20 pokemons 
    // const [previousUrl, setPreviousUrl ]= useState(''); //  Previous 20 pokemons

    const[pokemonListState, setPokemonListState] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon',
        nextUrl: '',
        previousUrl: ''
    })


    async function downloadPokemons() {
        // setIsLoading(true);
        setPokemonListState((state)=>({...state, isLoading: true}));
        const response = await axios.get(pokemonListState.pokedexUrl); //This downloads list of 20 pokemons

        const pokemonResults = response.data.results; // We get the array of pokemons from result
      
        // setNextUrl(response.data.next)
        // setPreviousUrl(response.data.previous)
        setPokemonListState((state)=> ({
            ...state, 
            nextUrl: response.data.next,            //For updating one state multiple times
            previousUrl: response.data.previous
        }));
        
        // Iterating over the array of pokemons, and using their URL to create an array of promises that will download those 20 pokemons
        const pokemonResultsPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url)); 
        // Passing that promise array to axios.all 
        const pokemonData = await axios.all(pokemonResultsPromise); // Array of 20 pokemon detailed data 

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

        setPokemonListState((state)=>({
            ...state,                       //For updating one state multiple times
            pokemonList: pokeListResult, 
            isLoading: false
        }));
        // setPokemonList(pokeListResult);
        // setIsLoading(false);
    }

    useEffect(() => {
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]);

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(pokemonListState.isLoading) ? "Loading..." :
                    pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id}id={p.id} />)
                }   
            </div>
            <div className="controls">
                    <button disabled={pokemonListState.previousUrl == null} onClick={() => {
                        const urlToSet = pokemonListState.previousUrl;
                        setPokemonListState({...pokemonListState, pokedexUrl: urlToSet })} 
                    }>Previous</button>  
                    <button disabled={pokemonListState.nextUrl == null} onClick={() =>{
                        const urlToSet = pokemonListState.nextUrl;
                        setPokemonListState({...pokemonListState, pokedexUrl: urlToSet})}
                    }>Next</button>
            </div>
        </div>
    )
}

export default PokemonList;