import { platformBrowser } from '@angular/platform-browser';
import { Planta } from '../interfaces/planta';
import { Supaservice } from '../services/supaservice';
import { inject } from '@angular/core';

export const plantasSolaresDemo: Planta[] = [
  {
    id: 1,
    created_at: 1672531200000, // 1 Enero 2023
    nom: 'Planta Solar Andalucía',
    ubicacio: { lat: 37.3891, lon: -5.9845 },
    capacitat: 150,
    usuari: 'admin@energiasolares.com',
    foto: '',
    favorite: false,
  },
  {
    id: 2,
    created_at: 1680307200000, // 1 Abril 2023
    nom: 'Parque Fotovoltaico Extremadura',
    ubicacio: { lat: 39.475, lon: -6.3728 },
    capacitat: 250,
    usuari: 'tecnico@extremadura-solar.com',
    foto: '',
    favorite: false,
  },
  {
    id: 3,
    created_at: 1688169600000, // 1 Julio 2023
    nom: 'Granja Solar Castilla-La Mancha',
    ubicacio: { lat: 39.8628, lon: -4.0273 },
    capacitat: 180,
    usuari: 'operador@renovables-clm.es',
    foto: '',
    favorite: false,
  },
  {
    id: 4,
    created_at: 1696118400000, // 1 Octubre 2023
    nom: 'Instalación Solar Valencia',
    ubicacio: { lat: 39.4699, lon: -0.3763 },
    capacitat: 95,
    usuari: 'gestor@valencia-energia.com',
    foto: '',
    favorite: false,
  },
  {
    id: 5,
    created_at: 1704067200000, // 1 Enero 2024
    nom: 'Central Fotovoltaica Aragón',
    ubicacio: { lat: 41.6488, lon: -0.8891 },
    capacitat: 320,
    usuari: 'supervisor@aragon-renovable.org',
    foto: '',
    favorite: false,
  },
  {
    id: 6,
    created_at: 1711929600000, // 1 Abril 2024
    nom: 'Planta Solar Cataluña',
    ubicacio: { lat: 41.5912, lon: 1.5209 },
    capacitat: 210,
    usuari: 'administrador@catalunya-solar.cat',
    foto: '',
    favorite: false,
  },
  {
    id: 7,
    created_at: 1719792000000, // 1 Julio 2024
    nom: 'Huerto Solar Murcia',
    ubicacio: { lat: 37.9922, lon: -1.1307 },
    capacitat: 120,
    usuari: 'tecnico@murcia-solar.es',
    foto: '',
    favorite: false,
  },
  {
    id: 8,
    created_at: 1727740800000, // 1 Octubre 2024
    nom: 'Parque Solar Navarra',
    ubicacio: { lat: 42.8125, lon: -1.6458 },
    capacitat: 175,
    usuari: 'operador@navarra-renovable.es',
    foto: '',
    favorite: false,
  },
  {
    id: 9,
    created_at: 1735689600000, // 1 Enero 2025
    nom: 'Instalación Fotovoltaica Galicia',
    ubicacio: { lat: 42.8782, lon: -8.5448 },
    capacitat: 140,
    usuari: 'gestor@galicia-solar.gal',
    foto: '',
    favorite: false,
  },
  {
    id: 10,
    created_at: 1743552000000, // 1 Abril 2025
    nom: 'Planta Solar Canarias',
    ubicacio: { lat: 28.2916, lon: -16.6291 },
    capacitat: 85,
    usuari: 'admin@canarias-energia.es',
    foto: '',
    favorite: false,
  },
];

// id: 1,
// created_at: 1672531200000, // 1 Enero 2023
// nom: "Planta Solar Andalucía",
// ubicacio: { lat: 37.3891, lon: -5.9845 },
// capacitat: 150,
// usuari: "admin@energiasolares.com",
// foto: "https://ejemplo.com/fotos/planta-andalucia.jpg"
export async function carregarPlantesDemo(supaservice: Supaservice) {
  try {
    const results = await supaservice.countAllSupabase('plantes');

    if (results === 0) {
      plantasSolaresDemo.forEach(async (element) => {
        const fechaValida = new Date(element.created_at);
        await supaservice.updateSupabase('plantes', {
          id: element.id,
          created_at: fechaValida,
          nom: element.nom,
          ubicacio: element.ubicacio,
          capacitat: element.capacitat,
          usuari: 'f65c95f8-bb8f-43a8-973d-fa6c33eee5cf',
          foto: element.foto
        });
      });
    }
  } catch (e) {
    console.error('Error al contar registres:', e);
  }
}
