// Catálogo de vinos/bebidas que respalda la herramienta "buscarVinos".
// Es un dataset pequeño e intencional para que el asistente base sus
// recomendaciones en datos reales (grounding) en lugar de inventar etiquetas.

export type WineType =
  | "tinto"
  | "blanco"
  | "rosado"
  | "espumoso"
  | "sin alcohol";

export interface Wine {
  id: string;
  nombre: string;
  tipo: WineType;
  uva: string;
  region: string;
  precioMXN: number;
  cuerpo: "ligero" | "medio" | "alto";
  /** Palabras clave de platillos/ingredientes con los que marida bien. */
  maridajes: string[];
  notas: string;
}

export const WINES: Wine[] = [
  { id: "w01", nombre: "Casa Madero 2V", tipo: "tinto", uva: "Cabernet Sauvignon / Merlot", region: "Valle de Parras, México", precioMXN: 320, cuerpo: "medio", maridajes: ["carne", "res", "cordero", "quesos", "pasta", "hamburguesa"], notas: "Frutos rojos y un toque de roble; taninos suaves." },
  { id: "w02", nombre: "Santo Tomás Tempranillo", tipo: "tinto", uva: "Tempranillo", region: "Valle de Guadalupe, México", precioMXN: 380, cuerpo: "alto", maridajes: ["carne", "asado", "barbacoa", "cordero", "embutidos"], notas: "Estructurado, especiado, ideal para asados." },
  { id: "w03", nombre: "Rioja Crianza", tipo: "tinto", uva: "Tempranillo", region: "Rioja, España", precioMXN: 450, cuerpo: "medio", maridajes: ["carne", "jamón", "cochinita", "cordero", "champiñones"], notas: "Vainilla y cuero, clásico versátil." },
  { id: "w04", nombre: "Malbec de Mendoza", tipo: "tinto", uva: "Malbec", region: "Mendoza, Argentina", precioMXN: 400, cuerpo: "alto", maridajes: ["carne", "arrachera", "res", "chocolate amargo"], notas: "Jugoso, ciruela madura; el rey de la parrilla." },
  { id: "w05", nombre: "Pinot Noir Casablanca", tipo: "tinto", uva: "Pinot Noir", region: "Valle de Casablanca, Chile", precioMXN: 420, cuerpo: "ligero", maridajes: ["salmón", "atún", "pato", "champiñones", "pavo"], notas: "Ligero y sedoso; único tinto que va bien con salmón." },
  { id: "w06", nombre: "Sauvignon Blanc Marlborough", tipo: "blanco", uva: "Sauvignon Blanc", region: "Marlborough, Nueva Zelanda", precioMXN: 390, cuerpo: "ligero", maridajes: ["pescado", "ceviche", "ensalada", "queso de cabra", "sushi", "mariscos"], notas: "Cítrico y herbal, acidez vibrante." },
  { id: "w07", nombre: "Chardonnay con barrica", tipo: "blanco", uva: "Chardonnay", region: "Valle de Guadalupe, México", precioMXN: 430, cuerpo: "medio", maridajes: ["pollo", "pasta cremosa", "langosta", "camarón", "quesos suaves"], notas: "Untuoso, notas de mantequilla y vainilla." },
  { id: "w08", nombre: "Albariño", tipo: "blanco", uva: "Albariño", region: "Rías Baixas, España", precioMXN: 460, cuerpo: "ligero", maridajes: ["mariscos", "pulpo", "almejas", "ceviche", "pescado", "tacos de pescado"], notas: "Salino y fresco, hecho para el mar." },
  { id: "w09", nombre: "Riesling semi-seco", tipo: "blanco", uva: "Riesling", region: "Mosela, Alemania", precioMXN: 410, cuerpo: "ligero", maridajes: ["comida picante", "tailandesa", "curry", "cerdo", "pad thai", "cocina asiática"], notas: "Dulzor sutil que doma el picante." },
  { id: "w10", nombre: "Rosado de Provenza", tipo: "rosado", uva: "Garnacha / Cinsault", region: "Provenza, Francia", precioMXN: 440, cuerpo: "ligero", maridajes: ["ensalada", "sushi", "aperitivo", "pizza", "comida mediterránea", "verano"], notas: "Seco, fresco y elegante; comodín de verano." },
  { id: "w11", nombre: "Cava Brut", tipo: "espumoso", uva: "Macabeo / Xarel·lo", region: "Penedés, España", precioMXN: 350, cuerpo: "ligero", maridajes: ["aperitivo", "fritura", "papas", "sushi", "brunch", "celebración", "ostras"], notas: "Burbuja fina; la fritura y las burbujas se aman." },
  { id: "w12", nombre: "Champagne Brut", tipo: "espumoso", uva: "Chardonnay / Pinot Noir", region: "Champagne, Francia", precioMXN: 1200, cuerpo: "medio", maridajes: ["celebración", "ostras", "caviar", "quesos", "aperitivo"], notas: "El estándar de oro para brindar." },
  { id: "w13", nombre: "Prosecco Extra Dry", tipo: "espumoso", uva: "Glera", region: "Véneto, Italia", precioMXN: 300, cuerpo: "ligero", maridajes: ["brunch", "aperitivo", "postre ligero", "fruta", "pizza"], notas: "Floral y afrutado, más suave que el cava." },
  { id: "w14", nombre: "Oporto Tawny", tipo: "tinto", uva: "Touriga Nacional", region: "Douro, Portugal", precioMXN: 520, cuerpo: "alto", maridajes: ["postre", "chocolate", "quesos azules", "nuez"], notas: "Dulce y untuoso; postre en copa." },
  { id: "w15", nombre: "Kombucha de jamaica", tipo: "sin alcohol", uva: "—", region: "Artesanal, México", precioMXN: 90, cuerpo: "ligero", maridajes: ["tacos", "comida picante", "ensalada", "aperitivo", "vegetariano"], notas: "Ácida y burbujeante; alternativa sin alcohol muy versátil." },
  { id: "w16", nombre: "Mosto de uva blanca", tipo: "sin alcohol", uva: "Verdejo", region: "Sin alcohol", precioMXN: 120, cuerpo: "ligero", maridajes: ["pescado", "ensalada", "brunch", "aperitivo", "postre"], notas: "Jugo de uva sin fermentar; dulce y fresco para toda la mesa." },
];

export interface WineSearchFilter {
  maridaje?: string;
  tipo?: WineType;
  presupuestoMax?: number;
  region?: string;
}

/**
 * Busca en el catálogo. Todos los criterios son opcionales y se combinan (AND).
 * El maridaje hace match parcial contra las palabras clave y el nombre.
 */
export function searchWines(filter: WineSearchFilter, limit = 5): Wine[] {
  const term = filter.maridaje?.trim().toLowerCase();

  const results = WINES.filter((wine) => {
    if (filter.tipo && wine.tipo !== filter.tipo) return false;
    if (filter.presupuestoMax && wine.precioMXN > filter.presupuestoMax)
      return false;
    if (
      filter.region &&
      !wine.region.toLowerCase().includes(filter.region.toLowerCase())
    )
      return false;
    if (term) {
      const haystack = [wine.nombre, wine.uva, ...wine.maridajes]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  // Ordena por precio ascendente para sugerir primero lo más accesible.
  return results.sort((a, b) => a.precioMXN - b.precioMXN).slice(0, limit);
}
