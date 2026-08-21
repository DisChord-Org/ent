import { entorno, variableEntorno, establecerVariableEntorno } from '../lib/procesos/src/index.js';
import { existe, leer } from '../lib/sf/src/index.js';
async function archivoExiste(ruta) {
    return existe(ruta);
}
async function leerArchivo(ruta) {
    return leer(ruta);
}
function limpiarComillas(valor) {
    let primero = valor.charCodeAt(0);
    let ultimo = valor.charCodeAt(valor.length - 1);
    let esComilla = primero == 34 || primero == 39;
    if (esComilla && primero == ultimo) {
        return valor.substring(1, valor.length - 1);
    }
    return valor;
}
function procesarLinea(linea) {
    let limpia = linea.trim();
    if (limpia.length == 0) {
        return;
    }
    if (limpia.startsWith('#')) {
        return;
    }
    let indice = limpia.indexOf('=');
    if (indice < 0) {
        return;
    }
    let clave = limpia.substring(0, indice).trim();
    let valor = limpiarComillas(limpia.substring(indice + 1).trim());
    establecerVariableEntorno(clave, valor);
}
async function cargar(ruta) {
    let existeArchivo = await archivoExiste(ruta);
    if (!existeArchivo) {
        return false;
    }
    let contenido = await leerArchivo(ruta);
    let lineas = contenido.split('\n');
    for (let linea of Array.isArray(lineas) ? lineas : Object.keys(lineas)) {
        procesarLinea(linea);
    }
    return true;
}
async function inicializar() {
    let cargado = await cargar('.env');
    if (!cargado) {
        await cargar('.ent');
    }
}
await inicializar();
let gestor = (() => {
    function get(objetivo, propiedad) {
        return variableEntorno(propiedad);
    }
    function has(objetivo, propiedad) {
        return variableEntorno(propiedad) != undefined;
    }
    function ownKeys(objetivo) {
        return Object.keys(entorno());
    }
    function getOwnPropertyDescriptor(objetivo, propiedad) {
        let valor = variableEntorno(propiedad);
        if (valor == undefined) {
            return undefined;
        }
        return (() => {
            let enumerable = true;
            let configurable = true;
            let writable = true;
            let value = valor;

            return { enumerable, configurable, writable, value };
        })();
    }
    return { get, has, ownKeys, getOwnPropertyDescriptor };
})();
export let ent = new Proxy({}, gestor);
