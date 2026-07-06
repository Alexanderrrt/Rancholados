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
    image: "/Cholado.png",
    items: [
      {
        id: "cholado-clasico",
        nameEs: "Cholado Clásico (20 oz)",
        nameEn: "Classic Cholado (20 oz)",
        descEs: "Hielo raspado con jarabes de fruta, fruta fresca picada, lechera, coco rallado y oblea encima.",
        descEn: "Shaved ice with fruit syrups, fresh-cut fruit, condensed milk, shredded coconut and a wafer on top.",
        priceCents: 1395,
        image: "/Cholado.png",
        isAvailable: true,
      },
      {
        id: "cholado-especial",
        nameEs: "Cholado Especial Rancholados",
        nameEn: "Rancholados Special Cholado",
        descEs: "El cholado con todo: doble fruta, helado casero encima y más lechera.",
        descEn: "The loaded cholado: double fruit, homemade ice cream on top and extra condensed milk.",
        priceCents: 1595,
        image: "/Cholado.png",
        isAvailable: true,
      },
      {
        id: "maracumango",
        nameEs: "Maracumango (16 oz)",
        nameEn: "Maracumango (16 oz)",
        descEs: "Maracuyá y mango en capas bien frías. Refrescante de verdad.",
        descEn: "Passion fruit and mango layered over ice. Super refreshing.",
        priceCents: 1295,
        image: "/images/stock/smoothies.jpg",
        isAvailable: true,
      },
      {
        id: "lulada",
        nameEs: "Lulada Caleña",
        nameEn: "Cali-Style Lulada",
        descEs: "Lulo fresco machacado con hielo, limón y azúcar. Bien caleño.",
        descEn: "Fresh lulo fruit crushed with ice, lime and sugar. Straight from Cali.",
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
        descEs: "Una bola de helado casero. Sabores: guanábana, lulo, maracuyá, mango biche, coco, arequipe o mora.",
        descEn: "One scoop of homemade ice cream. Flavors: guanábana, lulo, passion fruit, green mango, coconut, arequipe or blackberry.",
        priceCents: 475,
        image: "/images/stock/ice-cream-scoops.jpg",
        isAvailable: true,
      },
      {
        id: "vaso-doble",
        nameEs: "Vaso Doble (2 bolas)",
        nameEn: "Double Scoop Cup",
        descEs: "Dos bolas, dos sabores. Escoge tu combinación.",
        descEn: "Two scoops, two flavors. Pick your combo.",
        priceCents: 695,
        image: "/images/stock/ice-cream-cup.jpg",
        isAvailable: true,
      },
      {
        id: "banana-split",
        nameEs: "Banana Split Tropical",
        nameEn: "Tropical Banana Split",
        descEs: "Banano, tres bolas de helado casero, fruta fresca, crema batida y lechera.",
        descEn: "Banana, three scoops of homemade ice cream, fresh fruit, whipped cream and condensed milk.",
        priceCents: 1250,
        image: "/images/stock/ice-cream-cup.jpg",
        isAvailable: true,
      },
      {
        id: "pinta",
        nameEs: "Pinta para Llevar",
        nameEn: "Take-Home Pint",
        descEs: "Tu sabor favorito en pinta. Pregunta por los sabores del día.",
        descEn: "Your favorite flavor in a pint. Ask about today's flavors.",
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
        descEs: "Fresas frescas con nuestra crema dulce casera y lechera por encima.",
        descEn: "Fresh strawberries with our homemade sweet cream and condensed milk on top.",
        priceCents: 1195,
        image: "/images/stock/fresas-con-crema.jpg",
        isAvailable: true,
      },
      {
        id: "fresas-helado",
        nameEs: "Fresas con Crema y Helado",
        nameEn: "Strawberries & Cream with Ice Cream",
        descEs: "Las mismas fresas con crema pero con una bola de helado casero encima.",
        descEn: "Same strawberries and cream but with a scoop of homemade ice cream on top.",
        priceCents: 1395,
        image: "/images/stock/fresas-con-crema-alt.jpg",
        isAvailable: true,
      },
      {
        id: "duraznos",
        nameEs: "Duraznos con Crema",
        nameEn: "Peaches & Cream",
        descEs: "Duraznos en almíbar con crema batida y lechera.",
        descEn: "Peaches in syrup with whipped cream and condensed milk.",
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
        descEs: "Dos obleas crocantes con arequipe derretido adentro.",
        descEn: "Two crispy wafers with melted arequipe caramel inside.",
        priceCents: 695,
        image: null,
        isAvailable: true,
      },
      {
        id: "oblea-especial",
        nameEs: "Oblea Especial",
        nameEn: "Special Oblea",
        descEs: "Arequipe, queso rallado, crema, fresas y lechera entre dos obleas.",
        descEn: "Arequipe, shredded cheese, cream, strawberries and condensed milk between two wafers.",
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
        descEs: "Fruta fresca picada del día con crema, queso rallado, helado y lechera.",
        descEn: "Fresh-cut fruit of the day with cream, shredded cheese, ice cream and condensed milk.",
        priceCents: 1350,
        image: "/images/stock/fruit-salad.jpg",
        isAvailable: true,
      },
      {
        id: "salpicon",
        nameEs: "Salpicón Colombiano",
        nameEn: "Colombian Salpicón",
        descEs: "Frutas tropicales picaditas en jugo fresco de sandía. Se le puede agregar helado.",
        descEn: "Diced tropical fruit in fresh watermelon juice. Add ice cream if you want.",
        priceCents: 1095,
        image: "/images/stock/fruit-salad.jpg",
        isAvailable: true,
      },
      {
        id: "mango-biche",
        nameEs: "Mango Biche con Limón y Sal",
        nameEn: "Green Mango with Lime & Salt",
        descEs: "Mango verde crujiente con limón, sal y un toque picante.",
        descEn: "Crunchy green mango with lime, salt and a little spice.",
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
        descEs: "Cremosa con crema batida y galleta Oreo encima.",
        descEn: "Creamy with whipped cream and Oreo cookie on top.",
        priceCents: 1050,
        image: "/images/brand/oreo-shake-promo.jpg",
        isAvailable: true,
      },
      {
        id: "malteada-arequipe",
        nameEs: "Malteada de Arequipe",
        nameEn: "Arequipe (Dulce de Leche) Milkshake",
        descEs: "Helado casero batido con arequipe.",
        descEn: "Homemade ice cream blended with arequipe caramel.",
        priceCents: 1050,
        image: "/images/stock/milkshake.jpg",
        isAvailable: true,
      },
      {
        id: "malteada-fresa",
        nameEs: "Malteada de Fresa",
        nameEn: "Strawberry Milkshake",
        descEs: "Fresas de verdad batidas con helado casero.",
        descEn: "Real strawberries blended with homemade ice cream.",
        priceCents: 995,
        image: "/images/stock/milkshake.jpg",
        isAvailable: true,
      },
      {
        id: "batido-tropical",
        nameEs: "Batido Tropical",
        nameEn: "Tropical Smoothie",
        descEs: "Escoge tu fruta: mango, guanábana, lulo o mora. En leche o en agua.",
        descEn: "Pick your fruit: mango, guanábana, lulo or blackberry. With milk or water.",
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
        descEs: "Agridulce y 100% natural.",
        descEn: "Sweet-tart and 100% natural.",
        priceCents: 795,
        image: "/images/stock/mango-juice.jpg",
        isAvailable: true,
      },
      {
        id: "jugo-maracuya",
        nameEs: "Jugo de Maracuyá",
        nameEn: "Passion Fruit Juice",
        descEs: "Maracuyá recién licuado. En agua o en leche.",
        descEn: "Fresh-blended passion fruit. With water or milk.",
        priceCents: 795,
        image: "/images/stock/mango-juice.jpg",
        isAvailable: true,
      },
      {
        id: "jugo-guanabana",
        nameEs: "Jugo de Guanábana",
        nameEn: "Soursop (Guanábana) Juice",
        descEs: "Cremoso y natural. Uno de los más pedidos.",
        descEn: "Creamy and natural. One of our most popular.",
        priceCents: 850,
        image: "/images/stock/smoothies.jpg",
        isAvailable: true,
      },
      {
        id: "limonada-coco",
        nameEs: "Limonada de Coco",
        nameEn: "Coconut Limeade",
        descEs: "Limonada frappé con crema de coco.",
        descEn: "Frosty blended limeade with coconut cream.",
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
