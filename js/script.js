let contenedor = document.querySelector('.contenedor')
let boton = document.getElementById('btn')
let btnSubir = document.querySelector('.btn-subir')
let buscar = document.getElementById('buscar')
let buscarTex = document.getElementById('texto')

let url = 'https://pokeapi.co/api/v2/pokemon/'

let cantidad = 151
let i = 1
async function mostrarTodosPokemon() {
    for (i ; i <= cantidad; i++) {
      const respuesta = await fetch(url + i);
      const data = await respuesta.json();
      mostrarPokemon(data);
    }
    i = cantidad + 1
    cantidad += 20
  }

// funccion para crear los cuadros de cada pokemon
function mostrarPokemon(data){
    let idPokemon = data.id.toString().padStart(3,'00')

    let tipos = data.types.map(type => `<p class ="${type.type.name}">${type.type.name}</p>`)
    tipos = tipos.join('')
    let div = document.createElement('div')
    div.classList.add('poke-cont')
    div.innerHTML =`
        <p class="numero">#${idPokemon}</p>
        <div>
            <img src="${data.sprites.other['official-artwork'].front_default}" alt="pokenom">
        </div>
        <div class="nombre-poke">
            <span class="numId">#${idPokemon}</span>
            <span class="nombre">${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</span>
        </div>
        <div class="tipo">
            ${tipos}
        </div>
        <div class="info">
            <p class="tamaño">Altura: ${data.height*10}cm</p>
            <p class="peso">Peso: ${data.weight/10}kg</p>
            
        </div>
    `;
    contenedor.appendChild(div)
    let url2 = data.species.url
    let divinfo = div.querySelector('.info')
    let divtipos = div.querySelector('.tipo')
    let descripcionDiv = null

    //mostral descripcion de los pokemon

    div.addEventListener('click',()=>{
        if (descripcionDiv){
            descripcionDiv.remove()
            divinfo.style.display = 'flex'
            divtipos.style.display = 'flex'
            descripcionDiv = null
        }else{
            divinfo.style.display = 'none'
            divtipos.style.display = 'none'
            fetch(url2)
            .then(respu => respu.json())
            .then(datos => {
                let descripcion = datos.flavor_text_entries.find((flavor) => flavor.language.name === 'es');
                descripcionDiv = document.createElement('div');
                descripcionDiv.className = 'descrip'
                descripcionDiv.textContent = descripcion.flavor_text;
                div.appendChild(descripcionDiv);
                console.log(datos.color.name)
            })
            .catch(error =>console.log(error)) 
        }
    })

    // cambiar el tamaño del numero pokemon

    let n = div.querySelector('.numero')
    function tamañoFontsize(){
        const nWidth = n.offsetWidth;
        let fontSize = 140;
        while( n.scrollWidth > nWidth){
            fontSize -=1
            n.style.fontSize = `${fontSize}px`
        }
        
    }
    tamañoFontsize()
}
mostrarTodosPokemon()

// buscar un pokemon en especifico
buscar.addEventListener('click', ()=>{
    contenedor.innerHTML =''
    boton.style.display = 'none'
    let texto = buscarTex.value.toLowerCase()
    if(!isNaN(texto)){
        texto = parseInt(texto)
    }
    
    fetch(url + texto)
    .then(res => {
        if(!res.ok){
            let NuevoError = '!No se a encontrado el pokemon intentero de nuevo'
            contenedor.innerHTML =`<h1>${NuevoError}</h1>`
        }
        return res.json()
    })
    .then(dat =>mostrarPokemon(dat))
    .catch(error => console.log('la informacion a fallado',error))
    
    
})

// mostra los siguentes pokemon
boton.addEventListener('click',  () => {
     mostrarTodosPokemon();
});

btnSubir.addEventListener('click',()=>{
    if(window.scrollY !== 0){
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
    }else{
        cantidad = 151
        i = 1
        contenedor.innerHTML =''
        mostrarTodosPokemon()
        boton.style.display = 'flex'
    }
})
