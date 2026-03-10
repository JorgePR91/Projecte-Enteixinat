export interface Planta {
    id: number,
    created_at: number,
    nom: string, 
    ubicacio: {lat: number, lon: number},
    capacitat: number,
    usuari: string,
    foto: string,
    favorite: boolean
}
