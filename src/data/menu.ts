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
    nameEs: "Cholados y Raspados",
    nameEn: "Cholados & Shaved Ice",
    slug: "cholados",
    image: "/Cholado.png",
    items: [
      {
        id: "cholado-sencillo",
        nameEs: "Cholado Sencillo",
        nameEn: "Cholado",
        descEs: "Guanábana, lulo, maracuyá, sandía, kiwi, mango, manzana, raspado, leche condensada y dulce de frutos rojos.",
        descEn: "Guanábana, lulo, passion fruit, watermelon, kiwi, mango, apple, shaved ice, condensed milk and red-berry syrup.",
        priceCents: 1600,
        image: "/Cholado.png",
        isAvailable: true,
      },
      {
        id: "cholado-helado",
        nameEs: "Cholado con Helado",
        nameEn: "Cholado with Ice Cream",
        descEs: "El cholado completo con una bola de helado casero encima. El favorito de la casa.",
        descEn: "The full cholado topped with a scoop of homemade ice cream. The house favorite.",
        priceCents: 1800,
        image: "/images/stock/cholado.jpg",
        isAvailable: true,
      },
      {
        id: "raspados",
        nameEs: "Raspados",
        nameEn: "Raspados (Shaved Ice)",
        descEs: "Hielo raspado con syrope: mango, frutos rojos, fresa, kiwi, durazno o piña.",
        descEn: "Shaved ice with your choice of syrup: mango, red berries, strawberry, kiwi, peach or pineapple.",
        priceCents: 800,
        image: "/images/stock/pink-ice-cream.jpg",
        isAvailable: true,
      },
      {
        id: "maracumango",
        nameEs: "Maracumango",
        nameEn: "Maracumango",
        descEs: "Granizado de maracuyá, mango, mucha leche condensada, sal, limón y pimienta.",
        descEn: "Passion fruit and mango slush with lots of condensed milk, salt, lime and a hint of pepper.",
        priceCents: 1600,
        image: "/images/stock/smoothies.jpg",
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
        nameEs: "Fresas con Crema (12 oz)",
        nameEn: "Strawberries & Cream (12 oz)",
        descEs: "Crema de leche, fresas, leche condensada, crema chantilly y queso.",
        descEn: "Fresh cream, strawberries, condensed milk, chantilly cream and cheese.",
        priceCents: 1300,
        image: "/images/stock/fresas-con-crema.jpg",
        isAvailable: true,
      },
      {
        id: "fresas-con-crema-grande",
        nameEs: "Fresas con Crema (20 oz)",
        nameEn: "Strawberries & Cream (20 oz)",
        descEs: "La versión grande, con wafer incluido.",
        descEn: "The large size, wafer included.",
        priceCents: 1700,
        image: "/images/stock/fresas-con-crema-alt.jpg",
        isAvailable: true,
      },
      {
        id: "fresas-dubai",
        nameEs: "Fresas Dubai",
        nameEn: "Dubai Strawberries",
        descEs: "Chocolate negro, Nutella, kataifi, tahini, fresas, crema de pistacho y chocolate Ferrero.",
        descEn: "Dark chocolate, Nutella, kataifi, tahini, strawberries, pistachio cream and Ferrero chocolate.",
        priceCents: 1600,
        image: null,
        isAvailable: true,
      },
      {
        id: "merengon",
        nameEs: "Merengón",
        nameEn: "Merengón",
        descEs: "Merengue crocante con crema y fruta fresca: fresa, kiwi y durazno.",
        descEn: "Crispy meringue layered with cream and fresh fruit: strawberry, kiwi and peach.",
        priceCents: 1700,
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
        descEs: "Fruta tradicional colombiana, crema, queso, galleta wafer y una bola de helado de vainilla.",
        descEn: "Traditional Colombian fruit with cream, cheese, a wafer cookie and a scoop of vanilla ice cream.",
        priceCents: 1500,
        image: "/images/stock/fruit-salad.jpg",
        isAvailable: true,
      },
      {
        id: "ensalada-frutas-grande",
        nameEs: "Ensalada de Frutas (32 oz)",
        nameEn: "Fruit Salad Bowl (32 oz)",
        descEs: "La versión grande para antojo serio.",
        descEn: "The big bowl, for a serious craving.",
        priceCents: 1700,
        image: "/images/stock/fruit-salad.jpg",
        isAvailable: true,
      },
      {
        id: "salpicon",
        nameEs: "Salpicón Sencillo",
        nameEn: "Salpicón",
        descEs: "Fruta tradicional colombiana en jugo de frutos rojos con leche condensada.",
        descEn: "Traditional Colombian fruit in red-berry juice with condensed milk.",
        priceCents: 1200,
        image: "/images/stock/fruit-salad.jpg",
        isAvailable: true,
      },
      {
        id: "salpicon-helado",
        nameEs: "Salpicón con Helado",
        nameEn: "Salpicón with Ice Cream",
        descEs: "El salpicón de la casa con helado encima.",
        descEn: "Our salpicón topped with ice cream.",
        priceCents: 1400,
        image: "/images/stock/fruit-salad.jpg",
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
        id: "oblea-tradicional",
        nameEs: "Oblea Tradicional",
        nameEn: "Traditional Oblea",
        descEs: "Wafer con salsa de frutos rojos, leche condensada, crema chantilly, arequipe y queso.",
        descEn: "Wafer with red-berry sauce, condensed milk, chantilly cream, arequipe and cheese.",
        priceCents: 1000,
        image: null,
        isAvailable: true,
      },
      {
        id: "maracuoblea",
        nameEs: "Maracuoblea",
        nameEn: "Maracuoblea",
        descEs: "La oblea tradicional con nuestro toque de maracuyá.",
        descEn: "The traditional oblea with our passion fruit twist.",
        priceCents: 1300,
        image: null,
        isAvailable: true,
      },
      {
        id: "ranchoblea",
        nameEs: "Ranchoblea",
        nameEn: "Ranchoblea",
        descEs: "Wafer con salsa de frutos rojos, leche condensada, crema chantilly, arequipe, queso, Nutella, fresa, banana, durazno y kiwi.",
        descEn: "Wafer loaded with red-berry sauce, condensed milk, chantilly cream, arequipe, cheese, Nutella, strawberry, banana, peach and kiwi.",
        priceCents: 1700,
        image: null,
        isAvailable: true,
      },
    ],
  },
  {
    id: "postres",
    nameEs: "Postres y Waffles",
    nameEn: "Desserts & Waffles",
    slug: "postres",
    image: "/images/stock/ice-cream-cup.jpg",
    items: [
      {
        id: "waffles",
        nameEs: "Waffles",
        nameEn: "Waffles",
        descEs: "Waffle con una bola de helado de vainilla, 2 frutas a tu preferencia, salsa de chocolate y crema chantilly.",
        descEn: "Waffle with a scoop of vanilla ice cream, 2 fruits of your choice, chocolate sauce and chantilly cream.",
        priceCents: 1400,
        image: null,
        isAvailable: true,
      },
      {
        id: "banana-split",
        nameEs: "Banana Split",
        nameEn: "Banana Split",
        descEs: "3 bolas de helado, banana, salsa de caramelo, mora y arequipe, cerezas, barquillo y queso.",
        descEn: "3 scoops of ice cream, banana, caramel, blackberry and arequipe sauces, cherries, a wafer roll and cheese.",
        priceCents: 1400,
        image: "/images/stock/ice-cream-cup.jpg",
        isAvailable: true,
      },
      {
        id: "brownie-helado",
        nameEs: "Brownie con Helado de Vainilla",
        nameEn: "Brownie with Vanilla Ice Cream",
        descEs: "Brownie tibio con una bola de helado de vainilla.",
        descEn: "Warm brownie topped with a scoop of vanilla ice cream.",
        priceCents: 1400,
        image: null,
        isAvailable: true,
      },
      {
        id: "affogato",
        nameEs: "Affogato",
        nameEn: "Affogato",
        descEs: "Helado y espresso.",
        descEn: "Ice cream and espresso.",
        priceCents: 1400,
        image: null,
        isAvailable: true,
      },
      {
        id: "affogato-brownie",
        nameEs: "Affogato con Brownie",
        nameEn: "Affogato with Brownie",
        descEs: "Brownie, helado, coco rallado y espresso.",
        descEn: "Brownie, ice cream, shredded coconut and espresso.",
        priceCents: 1500,
        image: null,
        isAvailable: true,
      },
    ],
  },
  {
    id: "malteadas",
    nameEs: "Malteadas",
    nameEn: "Milkshakes",
    slug: "malteadas",
    image: "/images/stock/milkshake.jpg",
    items: [
      {
        id: "malteada",
        nameEs: "Malteada (Chocolate, Oreo o Fresa)",
        nameEn: "Milkshake (Chocolate, Oreo or Strawberry)",
        descEs: "Malteada cremosa del sabor que escojas, con crema batida y toppings.",
        descEn: "Creamy milkshake in your favorite flavor, with whipped cream and toppings.",
        priceCents: 1600,
        image: "/images/brand/oreo-shake-promo.jpg",
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
        id: "helados-caseros",
        nameEs: "Helados Caseros",
        nameEn: "Homemade Fruit Pops",
        descEs: "Paletas caseras de fruta natural. Pregunta por los sabores del día.",
        descEn: "Homemade natural fruit pops. Ask about today's flavors.",
        priceCents: 500,
        image: "/images/stock/ice-cream-scoops.jpg",
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
        id: "jugo-agua",
        nameEs: "Jugo Natural en Agua",
        nameEn: "Natural Juice (Water Base)",
        descEs: "Mango, mora, banano, lulo, fresa, kiwi, frutos rojos, maracuyá o limón.",
        descEn: "Mango, blackberry, banana, lulo, strawberry, kiwi, red berries, passion fruit or lime.",
        priceCents: 700,
        image: "/images/stock/mango-juice.jpg",
        isAvailable: true,
      },
      {
        id: "jugo-leche",
        nameEs: "Jugo Natural en Leche",
        nameEn: "Natural Juice (Milk Base)",
        descEs: "Tu fruta favorita batida en leche, bien cremosa.",
        descEn: "Your favorite fruit blended with milk, extra creamy.",
        priceCents: 800,
        image: "/images/stock/mango-juice.jpg",
        isAvailable: true,
      },
    ],
  },
  {
    id: "calientes",
    nameEs: "Bebidas Calientes",
    nameEn: "Hot Drinks",
    slug: "calientes",
    image: null,
    items: [
      {
        id: "chocolate-caliente",
        nameEs: "Chocolate, Milo o Caliente Migao",
        nameEn: "Hot Chocolate, Milo or Caliente Migao",
        descEs: "Con galletas ducales o saladas, tostadas, pan tajado, queso, almojábana, achiras huilenses, pan de yuca, buñuelo, malvavisco o Chocorramo. Topping extra +$3 · Leche de almendras +$3.",
        descEn: "Served with your choice of cookies, toast, sliced bread, cheese, almojábana, achiras, yuca bread, buñuelo, marshmallow or Chocorramo. Extra topping +$3 · Almond milk +$3.",
        priceCents: 1500,
        image: null,
        isAvailable: true,
      },
      {
        id: "canelazo",
        nameEs: "Canelazo",
        nameEn: "Canelazo",
        descEs: "Bebida caliente de canela, bien colombiana.",
        descEn: "Traditional Colombian hot cinnamon drink.",
        priceCents: 1500,
        image: null,
        isAvailable: true,
      },
      {
        id: "tinto",
        nameEs: "Tinto",
        nameEn: "Tinto (Colombian Coffee)",
        descEs: "Espresso con pan de yuca, bono o croissant.",
        descEn: "Espresso with yuca bread, bono cheese bread or a croissant.",
        priceCents: 800,
        image: null,
        isAvailable: true,
      },
    ],
  },
];

export const featuredItemIds = [
  "cholado-helado",
  "fresas-con-crema",
  "malteada",
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
