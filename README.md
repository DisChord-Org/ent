# Gestión de Entorno
`ent` es una utilidad ligera para DisChord diseñada para cargar y gestionar variables de entorno desde archivos `.env` de forma sencilla y natural. Olvídate de configuraciones pesadas; simplemente carga tu entorno y accede a tus variables como si fueran propiedades nativas del lenguaje.

## Características
- Proxy Dinámico: Acceso limpio a las variables mediante ent.TU_VARIABLE.
- Ligero: Basado en fs nativo, sin dependencias externas innecesarias.
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
importar ent desde "lib:ent";

// Acceder a las variables de forma dinámica
consola.imprimir(ent.TOKEN_DISCORD); // 'mi_token_secreto'
consola.imprimir(ent[MENSAJE]);       // 'Hola desde DisChord'
```

## Funcionamiento Interno
El GestorEnt procesa el archivo línea por línea utilizando expresiones regulares para asegurar que:
1. Se eliminen espacios innecesarios.
2. Se limpien las comillas simples o dobles que envuelven los valores.
3. Las variables se inyecten directamente en process.env.

El uso de un **Proxy** sobre el objeto `ent` permite que el acceso a las variables sea extremadamente limpio, actuando como una capa de abstracción total.