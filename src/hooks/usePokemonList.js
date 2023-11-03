import axios from "axios";
import { useEffect, useState } from "react";

// For Capitalize first letter of name.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function usePokemonList() {
  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    isLoading: true,
    pokedexUrl: "https://pokeapi.co/api/v2/pokemon",
    nextUrl: "",
    previousUrl: ""
  });

  async function downloadPokemons() {

      setPokemonListState((state) => ({ ...state, isLoading: true }));
      const response = await axios.get(pokemonListState.pokedexUrl);
      //This downloads list of 20 pokemons

      const pokemonResults = response.data.results;
      // We get the array of pokemons from result

      setPokemonListState((state) => ({
        ...state,
        nextUrl: response.data.next, //For updating one state multiple times
        previousUrl: response.data.previous,
      }));
      const pokemonResultsPromise = pokemonResults.map((pokemon) =>
        axios.get(pokemon.url)
      );

      // Passing that promise array to axios.all
      const pokemonData = await axios.all(pokemonResultsPromise); // Array of 20 pokemon detailed data

      // Now iterate on the data of each pokemon, and extract id, name, image, types
      const pokeListResult = pokemonData.map((pokeData) => {
        const pokemon = pokeData.data;
        return {
          id: pokemon.id,
          name: capitalizeFirstLetter(pokemon.name),
          image: pokemon.sprites.other
            ? pokemon.sprites.other.dream_world.front_default
            : pokemon.sprites.front_shiny,
          types: pokemon.types,
        };
      });

      setPokemonListState((state) => ({
        ...state, //For updating one state multiple times
        pokemonList: pokeListResult,
        isLoading: false,
      }));
    
  }

  useEffect(() => {
    downloadPokemons();
  }, [pokemonListState.pokedexUrl]);

  return [pokemonListState, setPokemonListState];
}

export default usePokemonList;
