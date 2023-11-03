import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";
import usePokemonList from "../../hooks/usePokemonList";

function PokemonList() {

    const [pokemonListState, setPokemonListState] = usePokemonList(false);
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