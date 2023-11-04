import axios from "axios";
import { useEffect, useState } from "react";

// For Capitalize first letter of name.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function usePokemonDetails(id, pokemonName){
    const [pokemon, setPokemon] = useState({});
    async function downloadPokemon(){
        try {
            let response;
        if (pokemonName) {
            response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        } else{
            response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        }
        const pokemonOfSameTypes = axios.get(`https://pokeapi.co/api/v2/type/${response.data.types ? response.data.types[0].type.name : ''}`)
        setPokemon(state => ({
            ...state,
            name: capitalizeFirstLetter(response.data.name),
            image: response.data.sprites.other.dream_world.front_default,
            weight: response.data.weight,
            height: response.data.height,
            types: response.data.types.map((t)=> t.type.name)
        }));
        pokemonOfSameTypes.then((response)=>{
            setPokemon(state => ({
                ...state,
                similarPokemons: response.data.pokemon.slice(0, 5)
            }));
        })

        setPokemonListState({...pokemonListState, 
        type: response.data.types ? response.data.types[0].type.name : ''})
    } catch (error) {
            console.log("Something went wrong");

        }
    }      
        
    const [pokemonListState, setPokemonListState] = useState({});

    useEffect(() =>{
        downloadPokemon();
    }, []);
    return [pokemon]
}

export default usePokemonDetails;