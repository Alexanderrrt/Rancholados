export interface MenuItem {
  id: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  priceCents: number;
  image: string | null;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  nameEs: string;
  nameEn: string;
  slug: string;
  image: string | null;
  items: MenuItem[];
}

export const categories: Category[] = [
  {
    id: "cholados",
    nameEs: "Cholados",
    nameEn: "Cholados (Colombian Shaved Ice)",
    slug: "cholados",
    image: "/images/stock/cholado.jpg",
    items: [
      {
        id: "cholado-clasico",
        nameEs: "Cholado Clásico (20 oz)",
        nameEn: "Classic Cholado (20 oz)",
        descEs: "El rey de Cali: hielo raspado bañado en jarabes de fruta, fruta fresca picada, lechera, coco rallado y su oblea de corona.",
        descEn: "The king of Cali: shaved ice drenched in fruit syrups, piled with fresh-cut fruit, condensed milk, shredded coconut and a wafer crown.",
        priceCents: 1395,
        image: "/images/stock/cholado.jpg",
        isAvailable: true,
      },
      {
        id: "cholado-especial",
        nameEs: "Cholado Especial Rancholados",
        nameEn: "Rancholados Special Cholado",
        descEs: "Nuestro cholado con todo: doble fruta, una bola de helado casero encima y chorrito extra de lechera.",
        descEn: "Our everything-cholado: double fruit, a scoop of homemade ice cream on top and an extra drizzle of condensed milk.",
        priceCents: 1595,
        image: "/images/stock/cholado.jpg",
        isAvailable: true,
      },
      {
        id: "maracumango",
        nameEs: "Maracumango (16 oz)",
        nameEn: "Maracumango (16 oz)",
        descEs: "La pareja perfecta: maracuyá y mango en capas bien frías que refrescan hasta el alma.",
        descEn: "The perfect duo: passion fruit and mango in icy layers — refreshment straight to the soul.",
        priceCents: 1295,
        image: "/images/stock/smoothies.jpg",
        isAvailable: true,
      },
      {
        id: "lulada",
        nameEs: "Lulada Caleña",
        nameEn: "Cali-Style Lulada",
        descEs: "Lulo fresco machacado con hielo, limón y azúcar: el refresco más caleño que existe.",
        descEn: "Fresh lulo fruit crushed with ice, lime and sugar — the most Cali drink there is.",
        priceCents: 1195,
        image: "/images/stock/smoothies.jpg",
        isAvailable: true,
      },
    ],
  },
  {
    id: "helados",
    nameEs: "Helados Caseros",
    nameEn: "Homemade Ice Cream",
    slug: "helados",
    image: "/images/stock/ice-cream-scoops.jpg",
    items: [
      {
        id: "cono-sencillo",
        nameEs: "Cono Sencillo (1 bola)",
        nameEn: "Single Scoop Cone",
        descEs: "Una bola de nuestro helado casero del día: guanábana, lulo, maracuyá, mango biche, coco, arequipe o mora.",
        descEn: "One scoop of our homemade ice cream — guanábana, lulo, passion fruit, green mango, coconut, arequipe or blackberry.",
        priceCents: 475,
        image: "/images/stock/ice-cream-scoops.jpg",
        isAvailable: true,
      },
      {
        id: "vaso-doble",
        nameEs: "Vaso Doble (2 bolas)",
        nameEn: "Double Scoop Cup",
        descEs: "Dos bolas, dos sabores: mezcla lo tropical con lo cremoso y arma tu dupla favorita.",
        descEn: "Two scoops, two flavors — pair something tropical with something creamy and build your dream duo.",
        priceCents: 695,
        image: "/images/stock/ice-cream-cup.jpg",
        isAvailable: true,
      },
      {
        id: "banana-split",
        nameEs: "Banana Split Tropical",
        nameEn: "Tropical Banana Split",
        descEs: "Banano, tres bolas de helado casero, fruta fresca, crema y lechera: el clásico con pasaporte colombiano.",
        descEn: "Banana, three scoops of homemade ice cream, fresh fruit, whipped cream and condensed milk — the classic with a Colombian passport.",
        priceCents: 1250,
        image: "/images/stock/ice-cream-cup.jpg",
        isAvailable: true,
      },
      {
        id: "pinta",
        nameEs: "Pinta para Llevar",
        nameEn: "Take-Home Pint",
        descEs: "Tu sabor favorito en pinta para el antojo de medianoche.",
        descEn: "Your favorite flavor in a pint for midnight cravings.",
        priceCents: 1295,
        image: "/images/stock/pink-ice-cream.jpg",
        isAvailable: true,
      },
    ],
  },
  {
    id: "fresas",
    nameEs: "Fresas con Crema y Más",
    nameEn: "Strawberries & Cream and More",
    slug: "fresas",
    image: "/images/stock/fresas-con-crema.jpg",
    items: [
      {
        id: "fresas-con-crema",
        nameEs: "Fresas con Crema",
        nameEn: "Strawberries & Cream",
        descEs: "Fresas frescas ahogadas en nuestra crema dulce casera y coronadas con lechera: puro amor en vaso.",
        descEn: "Fresh strawberries drowned in our sweet homemade cream and crowned with condensed milk — pure love in a cup.",
        priceCents: 1195,
        image: "/images/stock/fresas-con-crema.jpg",
        isAvailable: true,
      },
      {
        id: "fresas-helado",
        nameEs: "Fresas con Crema y Helado",
        nameEn: "Strawberries & Cream with Ice Cream",
        descEs: "Nuestras fresas con crema más una bola de helado casero, para cuando el antojo pide refuerzos.",
        descEn: "Our strawberries and cream topped with a scoop of homemade ice cream — for when the craving calls for backup.",
        priceCents: 1395,
        image: "/images/stock/fresas-con-crema-alt.jpg",
        isAvailable: true,
      },
      {
        id: "duraznos",
        nameEs: "Duraznos con Crema",
        nameEn: "Peaches & Cream",
        descEs: "Duraznos dulces en almíbar con crema batida y lechera: el primo elegante de las fresas.",
        descEn: "Sweet peaches in syrup with whipped cream and condensed milk — the strawberries' fancy cousin.",
        priceCents: 1195,
        image: "/images/stock/fresas-con-crema.jpg",
        isAvailable: true,
      },
    ],
  },
  {
    id: "obleas",
    nameEs: "Obleas",
    nameEn: "Obleas (Colombian Wafer Sandwiches)",
    slug: "obleas",
    image: null,
    items: [
      {
        id: "oblea-clasica",
        nameEs: "Oblea Clásica",
        nameEn: "Classic Oblea",
        descEs: "Dos obleas delgaditas y crocantes abrazando arequipe derretido, como en la esquina del barrio.",
        descEn: "Two thin, crispy wafers hugging melty arequipe caramel, just like the corner stand back home.",
        priceCents: 695,
        image: null,
        isAvailable: true,
      },
      {
        id: "oblea-especial",
        nameEs: "Oblea Especial",
        nameEn: "Special Oblea",
        descEs: "Arequipe, queso rallado, crema, fresas y lechera entre dos obleas: suena raro y sabe a gloria.",
        descEn: "Arequipe, shredded cheese, cream, strawberries and condensed milk between two wafers — sounds odd, tastes like glory.",
        priceCents: 895,
        image: null,
        isAvailable: true,
      },
    ],
  },
  {
    id: "ensaladas",
    nameEs: "Ensaladas de Frutas y Salpicón",
    nameEn: "Fruit Salads & Salpicón",
    slug: "ensaladas",
    image: "/images/stock/fruit-salad.jpg",
    items: [
      {
        id: "ensalada-frutas",
        nameEs: "Ensalada de Frutas (24 oz)",
        nameEn: "Fruit Salad Bowl (24 oz)",
        descEs: "Fruta fresca picada del día con crema, queso rallado, helado y lechera: la única ensalada que se antoja a toda hora.",
        descEn: "Fresh-cut fruit of the day with cream, shredded cheese, ice cream and condensed milk — the one salad you crave at any hour.",
        priceCents: 1350,
        image: "/images/stock/fruit-salad.jpg",
        isAvailable: true,
      },
      {
        id: "salpicon",
        nameEs: "Salpicón Colombiano",
        nameEn: "Colombian Salpicón",
        descEs: "Frutas tropicales picaditas nadando en jugo fresco de sandía, con helado encima si te animas.",
        descEn: "Diced tropical fruit swimming in fresh watermelon juice, topped with ice cream if you're feeling bold.",
        priceCents: 1095,
        image: "/images/stock/fruit-salad.jpg",
        isAvailable: true,
      },
      {
        id: "mango-biche",
        nameEs: "Mango Biche con Limón y Sal",
        nameEn: "Green Mango with Lime & Salt",
        descEs: "Mango verde crujiente con limón, sal y su toque picante: el antojo callejero de toda la vida.",
        descEn: "Crunchy green mango with lime, salt and a spicy kick — the street-corner snack of a lifetime.",
        priceCents: 995,
        image: "/images/stock/mango-chili.jpg",
        isAvailable: true,
      },
    ],
  },
  {
    id: "malteadas",
    nameEs: "Malteadas y Batidos",
    nameEn: "Milkshakes & Smoothies",
    slug: "malteadas",
    image: "/images/stock/milkshake.jpg",
    items: [
      {
        id: "malteada-oreo",
        nameEs: "Malteada de Oreo",
        nameEn: "Oreo Milkshake",
        descEs: "Cremosa, coronada con crema batida y galleta: un capricho refrescante a tu antojo.",
        descEn: "Creamy, crowned with whipped cream and cookie crumble — a refreshing treat, just the way you crave it.",
        priceCents: 1050,
        image: "/images/brand/oreo-shake-promo.jpg",
        isAvailable: true,
      },
      {
        id: "malteada-arequipe",
        nameEs: "Malteada de Arequipe",
        nameEn: "Arequipe (Dulce de Leche) Milkshake",
        descEs: "Helado casero batido con arequipe: dulzura colombiana en cada sorbo.",
        descEn: "Homemade ice cream blended with arequipe caramel — Colombian sweetness in every sip.",
        priceCents: 1050,
        image: "/images/stock/milkshake.jpg",
        isAvailable: true,
      },
      {
        id: "malteada-fresa",
        nameEs: "Malteada de Fresa",
        nameEn: "Strawberry Milkshake",
        descEs: "Fresas de verdad batidas con helado casero: rosadita y feliz como nuestro letrero.",
        descEn: "Real strawberries blended with homemade ice cream — pink and happy, just like our sign.",
        priceCents: 995,
        image: "/images/stock/milkshake.jpg",
        isAvailable: true,
      },
      {
        id: "batido-tropical",
        nameEs: "Batido Tropical",
        nameEn: "Tropical Smoothie",
        descEs: "Tu fruta favorita — mango, guanábana, lulo o mora — batida en leche o agua, fresquita y natural.",
        descEn: "Your favorite fruit — mango, guanábana, lulo or blackberry — blended with milk or water, fresh and natural.",
        priceCents: 895,
        image: "/images/stock/smoothies.jpg",
        isAvailable: true,
      },
    ],
  },
  {
    id: "jugos",
    nameEs: "Jugos Naturales",
    nameEn: "Fresh Natural Juices",
    slug: "jugos",
    image: "/images/stock/mango-juice.jpg",
    items: [
      {
        id: "jugo-lulo",
        nameEs: "Jugo de Lulo",
        nameEn: "Lulo Juice",
        descEs: "Agridulce, vibrante y 100% natural: el jugo que te hace extrañar a Colombia.",
        descEn: "Tart, sweet, vibrant and 100% natural — the juice that makes you miss Colombia.",
        priceCents: 795,
        image: "/images/stock/mango-juice.jpg",
        isAvailable: true,
      },
      {
        id: "jugo-maracuya",
        nameEs: "Jugo de Maracuyá",
        nameEn: "Passion Fruit Juice",
        descEs: "Maracuyá recién licuado, en agua o en leche: chispa tropical para cualquier hora.",
        descEn: "Fresh-blended passion fruit, with water or milk — a tropical spark for any hour.",
        priceCents: 795,
        image: "/images/stock/mango-juice.jpg",
        isAvailable: true,
      },
      {
        id: "jugo-guanabana",
        nameEs: "Jugo de Guanábana",
        nameEn: "Soursop (Guanábana) Juice",
        descEs: "Cremosito y perfumado: el favorito de las abuelas y de todo el que lo prueba.",
        descEn: "Creamy and fragrant — grandma's favorite, and everyone else's after one sip.",
        priceCents: 850,
        image: "/images/stock/smoothies.jpg",
        isAvailable: true,
      },
      {
        id: "limonada-coco",
        nameEs: "Limonada de Coco",
        nameEn: "Coconut Limeade",
        descEs: "Limonada frappé con crema de coco: la playa colombiana en un vaso, sin pasaje de avión.",
        descEn: "Frosty blended limeade with coconut cream — a Colombian beach in a cup, no plane ticket required.",
        priceCents: 850,
        image: "/images/stock/smoothies.jpg",
        isAvailable: true,
      },
    ],
  },
];

export const featuredItemIds = [
  "cholado-clasico",
  "fresas-con-crema",
  "malteada-oreo",
  "ensalada-frutas",
];

export function getAllItems(): MenuItem[] {
  return categories.flatMap((c) => c.items);
}

export function getItemById(id: string): MenuItem | undefined {
  return getAllItems().find((item) => item.id === id);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
