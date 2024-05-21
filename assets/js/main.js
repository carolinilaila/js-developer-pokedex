const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonModal = document.getElementById('pokemonModal')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <div onclick="openModal(event)" class="modal-click" id="pokemon-modal" data-value="${pokemon.number - 1}">
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
        </div>
    `
}

function convertPokemonDetailToSection(pokemon)  {
    return `
        <section class="pokemon>
            <span class="name">${pokemon.name}</span>
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </section>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
        // TODO: arrumar pokemonPosition quando clicar no loadMoreButton
        loadPokemonDetails()
    }
})  

// Função para abrir o modal
function openModal(event) {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    const clickedPokemon = event.currentTarget;
    const pokemonPosition = clickedPokemon.dataset.value
    loadPokemonDetails(pokemonPosition)
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Fechar o modal clicando fora da área do modal
window.onclick = function(event) {
    var modal = document.getElementById("modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function loadPokemonDetails(pokemonPosition) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        let newPokemon = []
        console.log(pokemons)
        pokemons.forEach((pokemon) => {
            newPokemon.push({ number: pokemon.number, name: pokemon.name, photo: pokemon.photo, types: pokemon.types })
        })
        
        if (pokemonPosition >= 0 && pokemonPosition < newPokemon.length) {
            const pokemonDetails = newPokemon[pokemonPosition];
            console.log(pokemonDetails);
            const newHtml = convertPokemonDetailToSection(pokemonDetails);
            pokemonModal.innerHTML = newHtml;
            return pokemonDetails;
        } else {
            console.log("Erro: Pokemon não existe!")
            return null
        }
    })
}
