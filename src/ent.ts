// ent.chord
// ¿env? nah, ent (entorno).

import fs from 'fs';

class EntManager {
    /**
     * Reads and loads the .env file in memory
     */
    public static load (path: string = '.env'): boolean {
        if (!fs.existsSync(path)) return false;

        const content = fs.readFileSync(path, 'utf-8');
        const lines = content.split(/\r?\n/);

        for (const line of lines) {
            const trim = line.trim();
            if (!trim || trim.startsWith('#')) continue;

            const matched = trim.match(/^([^=]+)=(.*)$/);
            if (matched) {
                const key = matched[1].trim();
                let value = matched[2].trim();

                value = value.replace(/^['"]|['"]$/g, '');

                process.env[key] = value; 
            }
        }

        return true;
    }

    /**
     * Gets the var from proecss env
     * @param name - Name of the prop
     * @returns The prop from process env
     */
    getVariable(name: string) {
        return process.env[name];
    }
}

const EntInstance = new EntManager();

// Automatic fallback loading: try '.env' first, then '.ent'
if (!EntManager.load()) EntManager.load('.ent');

/**
 * Reactive Proxy exposing loaded process.env variables as a transparent object.
 */
export const ent = new Proxy({} as Record<string, string | undefined>, {
    /**
     * Intercepts property access (e.g. ent.PORT or ent['PORT'])
     */
    get(_, prop: string | symbol) {
        if (typeof prop === 'symbol') return undefined;
        return EntInstance.getVariable(prop);
    },

    /**
     * Intercepts Object.keys(ent), Object.getOwnPropertyNames(ent), and console.log inspection
     */
    ownKeys() {
        return Reflect.ownKeys(process.env);
    },

    /**
     * Required for traps like ownKeys, Object.assign, or console.log 
     * to properly describe each property of process.env
     */
    getOwnPropertyDescriptor(_, prop: string | symbol) {
        if (typeof prop === 'symbol') return undefined;
        
        const value = EntInstance.getVariable(prop);
        if (value === undefined) return undefined;

        return {
            enumerable: true,
            configurable: true,
            writable: true,
            value
        };
    },

    /**
     * Intercepts the 'in' operator (e.g. 'PORT' in ent)
     */
    has(_, prop: string | symbol) {
        if (typeof prop === 'symbol') return false;
        return prop in process.env;
    }
});

export default ent;