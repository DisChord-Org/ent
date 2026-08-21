# Gestión de Entorno
`ent` es una utilidad ligera para DisChord diseñada para cargar y gestionar variables de entorno desde archivos `.env` de forma sencilla y natural. Olvídate de configuraciones pesadas; simplemente carga tu entorno y accede a tus variables como si fueran propiedades nativas del lenguaje.

Escrita íntegramente en **DisChord** (`.chord`), sobre las librerías oficiales `procesos` y `sf`.

## Características
- Proxy Dinámico: Acceso limpio a las variables mediante ent.TU_VARIABLE.
- Carga Automática: al importar `ent`, intenta cargar `.env` y, si no existe, cae en `.ent` — sin llamadas extra.
- Limpieza Automática: Ignora comentarios (#) y líneas vacías, además de limpiar comillas automáticamente.

## Uso rápido
1. Prepara tu archivo `.env` o `.ent`

```
TOKEN_DISCORD="mi_token_secreto"
PUERTO=3000
MENSAJE="Hola desde DisChord"
```

2. Carga y usa las variables
```chord
importar { ent } desde "lib:ent"

// Acceder a las variables de forma dinámica
consola.imprimir(ent.TOKEN_DISCORD) // 'mi_token_secreto'
consola.imprimir(ent["MENSAJE"])    // 'Hola desde DisChord'
```

## Funcionamiento Interno
Al importarse, `ent` procesa el archivo línea por línea (vía `sf`) para:
1. Eliminar espacios innecesarios y descartar comentarios/líneas vacías.
2. Limpiar las comillas simples o dobles que envuelven los valores.
3. Inyectar cada variable en el entorno del proceso (vía `procesos`).

El uso de un **Proxy** sobre el objeto `ent` permite que el acceso a las variables sea extremadamente limpio, actuando como una capa de abstracción total.

## Dependencias
- [`procesos`](https://github.com/DisChord-Org/procesos) — lectura/escritura de variables de entorno.
- [`sf`](https://github.com/DisChord-Org/sf) — lectura del fichero `.env`/`.ent`.
