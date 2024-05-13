const criptomonedasSelect = document.getElementById('criptomonedas');
const formulario = document.getElementById('formulario');
const monedaSelect = document.getElementById('moneda');
const resultado = document.getElementById('resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptomonedas = async (criptomonedas) => {
    return criptomonedas;
}

const selectCriptomonedas = (criptomonedas = []) => {
    criptomonedas.forEach(crypto => {
        const { FullName, Name } = crypto.CoinInfo;
        const option = document.createElement('option');
        
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

const consultarCriptomonedas = async () => {
    try {
        const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.error("Hubo un error al consultar las criptomonedas:", error);
    }
}

const mostrarAlerta = (mensaje = '') => {
    const existeError = document.querySelector('.error');

    if (!existeError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
    }
}

const limpiarHTML = () => {
    
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    const existeError = document.querySelector('.error');
    if (existeError) {
        existeError.remove();
    }
}

const formatPrecio = precio =>  precio.replace(/,/g, '#').replace(/\./g, ',').replace(/#/g, '.');

const mostrarCotizacionHTML = (cotizacion) => {
    
    limpiarHTML();
    
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR } = cotizacion;
    
    const precioActual = document.createElement('p');
    precioActual.classList.add('precio');
    precioActual.innerHTML = `El precio es <span>${formatPrecio(PRICE)}</span>`;

    const precioMasAlto = document.createElement('p');
    precioMasAlto.classList.add('precio');
    precioMasAlto.innerHTML = `El precio mas alto del dia fue <span>${formatPrecio(HIGHDAY)}</span>`;

    const precioMasBajo = document.createElement('p');
    precioMasBajo.classList.add('precio');
    precioMasBajo.innerHTML = `El precio mas bajo del dia fue <span>${formatPrecio(LOWDAY)}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.classList.add('precio');
    ultimasHoras.innerHTML = `Variacion ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

    resultado.appendChild(precioActual);
    resultado.appendChild(precioMasAlto);
    resultado.appendChild(precioMasBajo);
    resultado.appendChild(ultimasHoras);
}

const consultarApi = async () => {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.error("Hubo un error al consultar la API:", error);
    }
}

const submitFormulario = (event) => {
    event.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if (!moneda || !criptomoneda) {
        mostrarAlerta('Ambos campos son obligatorios!');
        return;
    }

    consultarApi();
}

const leerValor = (event) => {
    objBusqueda[event.target.name] = event.target.value;
}

document.addEventListener('DOMContentLoaded', async () => {
    await consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
    console.log('from app2');
});
