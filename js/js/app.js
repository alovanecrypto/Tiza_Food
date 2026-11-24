/* =====================================================
   Tiza Food - App de comida rápida (Tizayuca, Hidalgo)
   ===================================================== */

/* ---------- DATOS ---------- */

const PRODUCTS_DEFAULT = [
  {
    id: 1,
    name: "Hamburguesa Clásica",
    cat: "Hamburguesas",
    price: 59,
    img: "img/hamburguesa.jpg",
    desc: "Carne de res a la parrilla, queso, lechuga, jitomate y nuestra salsa especial.",
    rating: 4.7,
    reviews: [
      {
        user: "jin s.",
        stars: "⭐⭐⭐⭐⭐",
        comment: "Súper crujientes y calientitas.",
      },
    ],
  },
  {
    id: 2,
    name: "Doble Queso",
    cat: "Hamburguesas",
    price: 79,
    img: "img/doble-queso.jpg",
    desc: "Doble carne, doble queso cheddar, cebolla caramelizada y pan de mantequilla.",
    rating: 5.0,
    reviews: [
      {
        user: "yoongi m.",
        stars: "⭐⭐⭐⭐⭐",
        comment: "Muy buenas la recomiendo.",
      },
    ],
  },
  {
    id: 3,
    name: "Pollo Crujiente",
    cat: "Hamburguesas",
    price: 69,
    img: "img/pollo.jpg",
    desc: "Pechuga empanizada y crujiente con mayonesa de chipotle y lechuga fresca.",
    rating: 5.0,
    reviews: [
      {
        user: "Luis R.",
        stars: "⭐⭐⭐⭐⭐",
        comment: "Súper crujientes y me llegaron en buen estado.",
      },
    ],
  },
  {
    id: 11,
    name: "Hamburguesa BBQ",
    cat: "Hamburguesas",
    price: 75,
    img: "img/bbq.jpg",
    desc: "Carne de res, aros de cebolla, tocino y salsa BBQ ahumada.",
    rating: 4.8,
    reviews: [],
  },
  {
    id: 12,
    name: "Hamburguesa Hawaiana",
    cat: "Hamburguesas",
    price: 72,
    img: "img/hawaiana-burger.jpg",
    desc: "Carne de res con piña asada, jamón y queso derretido.",
    rating: 4.4,
    reviews: [],
  },
  {
    id: 4,
    name: "Hot Dog Jumbo",
    cat: "Snacks",
    price: 39,
    img: "img/hotdog.jpg",
    desc: "Salchicha jumbo, tocino, cebolla, jitomate y aderezos al gusto.",
    rating: 3.7,
    reviews: [
      {
        user: "hoseok j.",
        stars: "⭐⭐⭐⭐⭐",
        comment: "Súper buenas 10/10 y calientitas.",
      },
    ],
  },
  {
    id: 5,
    name: "Papas Grandes",
    cat: "Snacks",
    price: 35,
    img: "img/papas.jpg",
    desc: "Papas doradas y crujientes con sal. Perfectas para compartir.",
    rating: 4.8,
    reviews: [
      {
        user: "jimin p.",
        stars: "⭐⭐⭐⭐⭐",
        comment: "Súper crujientes y calientitas.",
      },
    ],
  },
  {
    id: 6,
    name: "Nuggets (10 pzas)",
    cat: "Snacks",
    price: 55,
    img: "img/Nuggets.jpg",
    desc: "Diez nuggets de pollo con dos salsas a elegir: BBQ o mostaza miel.",
    rating: 5.0,
    reviews: [
      {
        user: "Taehyung k.",
        stars: "⭐⭐⭐⭐⭐",
        comment: "Igual a la imagen, recomiendo 10/10.",
      },
    ],
  },
  {
    id: 7,
    name: "Alitas (8 pzas)",
    cat: "Snacks",
    price: 89,
    img: "img/Alitas.jpg",
    desc: "Ocho alitas bañadas en salsa BBQ o búfalo, con aderezo ranch.",
    rating: 4.5,
    reviews: [
      {
        user: "jungkook j.",
        stars: "⭐⭐⭐⭐⭐",
        comment: "Tienen un sabor bueno pero pueden mejorar.",
      },
    ],
  },
  {
    id: 15,
    name: "Aros de Cebolla",
    cat: "Snacks",
    price: 42,
    img: "img/aros.jpg",
    desc: "Aros empanizados y dorados con aderezo ranch.",
    rating: 4.5,
    reviews: [],
  },
  {
    id: 16,
    name: "Nachos con Queso",
    cat: "Snacks",
    price: 49,
    img: "img/nachos.jpg",
    desc: "Totopos crujientes con queso cheddar derretido y jalapeños.",
    rating: 4.6,
    reviews: [],
  },
  {
    id: 17,
    name: "Tacos al Pastor (5)",
    cat: "Snacks",
    price: 75,
    img: "img/tacos.jpg",
    desc: "Cinco tacos al pastor con piña, cebolla, cilantro y salsa verde.",
    rating: 4.9,
    reviews: [],
  },
  {
    id: 8,
    name: "Pizza de carne",
    cat: "Pizzas",
    price: 120,
    img: "img/pizza.jpg",
    desc: "Pizza individual de carne con mucho queso mozzarella.",
    rating: 4.0,
    reviews: [
      {
        user: "Loki R.",
        stars: "⭐⭐⭐⭐⭐",
        comment: "Muy buena para comer en familia y disfrutar en casa.",
      },
    ],
  },
  {
    id: 8,
    name: "Pizza tradicional/casera",
    cat: "Pizzas",
    price: 100,
    img: "img/Pizza casera.jpg",
    desc: "Pizza casera de peperoni con mucho queso mozzarella y orillas rellenas de queso.",
    rating: 4.5,
    reviews: [],
  },
  {
    id: 13,
    name: "Pizza Hawaiana",
    cat: "Pizzas",
    price: 75,
    img: "img/pizza-hawaiana.jpg",
    desc: "Jamón, piña y queso mozzarella sobre masa recién horneada.",
    rating: 4.3,
    reviews: [],
  },
  {
    id: 14,
    name: "Pizza Mexicana",
    cat: "Pizzas",
    price: 80,
    img: "img/pizza-mexicana.jpg",
    desc: "Chorizo, jalapeño, cebolla y frijoles con queso mozzarella.",
    rating: 4.6,
    reviews: [],
  },
  {
    id: 9,
    name: "Refresco Grande",
    cat: "Bebidas",
    price: 25,
    img: "img/refresco.jpg",
    desc: "Refresco frío de 600 ml. Pregunta por el sabor del día.",
    rating: 3.7,
    reviews: [{ user: "maria R.", stars: "⭐⭐⭐⭐⭐", comment: "Buena" }],
  },
  {
    id: 10,
    name: "Malteada de Fresa",
    cat: "Bebidas",
    price: 45,
    img: "img/malteada.jpg",
    desc: "Malteada cremosa de fresa con crema batida.",
    rating: 4.6,
    reviews: [
      { user: "Luis R.", stars: "⭐⭐⭐⭐⭐", comment: "Súper dulce 10/10." },
    ],
  },
  {
    id: 18,
    name: "Malteada de Chocolate",
    cat: "Bebidas",
    price: 45,
    img: "img/malteada-chocolate.jpg",
    desc: "Malteada espesa de chocolate con crema batida.",
    rating: 4.7,
    reviews: [],
  },
  {
    id: 19,
    name: "Limonada Mineral",
    cat: "Bebidas",
    price: 30,
    img: "img/limonada.jpg",
    desc: "Limonada natural con agua mineral y mucho hielo.",
    rating: 4.4,
    reviews: [],
  },
  {
    id: 20,
    name: "Agua de Horchata",
    cat: "Bebidas",
    price: 28,
    img: "img/horchata.jpg",
    desc: "Horchata fresca de arroz con canela. 600 ml.",
    rating: 4.5,
    reviews: [],
  },
  {
    id: 21,
    name: "Pay de Limón",
    cat: "Postres",
    price: 38,
    img: "img/pay-limon.jpg",
    desc: "Rebanada de pay de limón cremoso con base de galleta.",
    rating: 4.8,
    reviews: [],
  },
  {
    id: 22,
    name: "Frappé de Café",
    cat: "Cafés",
    price: 45,
    img: "img/frappe.jpg",
    desc: "Café frío blended con crema batida y toque de caramelo.",
    rating: 4.9,
    reviews: [],
  },
  {
    name: "Combo Pareja",
    cat: "Combos",
    price: 159,
    img: "img/combopareja.jpg",
    tag: "save",
    tagText: "Ahorra $30",
    short: "2 hamburguesas + papas + 2 refrescos",
    desc: "Dos hamburguesas clásicas, papas grandes para compartir y dos refrescos fríos.",
  },
  {
    name: "Combo Familiar",
    cat: "Combos",
    price: 239,
    img: "img/combofamiliar.jpg",
    tag: "popular",
    tagText: "FAMILIAR",
    short: "Pizza + 8 alitas + refresco 2 L",
    desc: "Pizza grande de pepperoni, ocho alitas BBQ o búfalo y refresco de 2 litros.",
  },

  // ---- MÁS OPCIONES ----

  {
    id: 21,
    name: "Helado de Vainilla",
    cat: "Postres",
    price: 35,
    img: "img/helado.jpg",
    more: true,
    desc: "Tres bolas de helado cremoso de vainilla con galleta.",
    rating: 4.6,
    reviews: [],
  },
  {
    id: 22,
    name: "Brownie con Helado",
    cat: "Postres",
    price: 55,
    img: "img/brownie.jpg",
    more: true,
    desc: "Brownie tibio de chocolate con bola de helado y salsa de chocolate.",
    rating: 4.9,
    reviews: [],
  },
  {
    id: 23,
    name: "Pastel de Chocolate",
    cat: "Postres",
    price: 49,
    img: "img/pastelchot.jpg",
    more: true,
    desc: "Rebanada de pastel de chocolate húmedo con betún cremoso.",
    rating: 4.7,
    reviews: [],
  },
  {
    id: 24,
    name: "Churros (6 pzas)",
    cat: "Postres",
    price: 45,
    img: "img/churros.jpg",
    more: true,
    desc: "Seis churros crujientes con azúcar y canela, con cajeta o chocolate para mojar.",
    rating: 4.8,
    reviews: [],
  },
  {
    id: 25,
    name: "Waffle con Fresas",
    cat: "Postres",
    price: 59,
    img: "img/waffle.jpg",
    more: true,
    desc: "Waffle dorado con fresas, crema batida y miel.",
    rating: 4.5,
    reviews: [],
  },
  {
    id: 26,
    name: "Flan Napolitano",
    cat: "Postres",
    price: 38,
    img: "img/flan.jpg",
    more: true,
    desc: "Flan casero con caramelo, suave y cremoso.",
    rating: 4.4,
    reviews: [],
  },
  {
    id: 27,
    name: "Galletas (3 pzas)",
    cat: "Postres",
    price: 30,
    img: "img/galletas.jpg",
    more: true,
    desc: "Tres galletas grandes con chispas de chocolate, recién horneadas.",
    rating: 4.3,
    reviews: [],
  },
  {
    id: 28,
    name: "Brochetas de frutas",
    cat: "Dulces",
    price: 25,
    img: "img/dulces.webp",
    more: true,
    desc: "Ricas brochetas de frutas con chocolate",
    rating: 5.0,
    reviews: [],
  },
  {
    id: 29,
    name: "Brochetas de Dulce",
    cat: "Dulces",
    price: 25,
    img: "img/dulces.jpg",
    more: true,
    desc: "Mix de gomitas y dulces enchilados.",
    rating: 4.5,
    reviews: [],
  },
  {
    id: 30,
    name: "Revanadas de pastel",
    cat: "Postres",
    price: 30,
    img: "img/revanadas de pastel.jpg",
    more: true,
    desc: "Ricas revanadas de pastel.",
    rating: 3.5,
    reviews: [],
  },
  {
    id: 31,
    name: "Pastel",
    cat: "Postres",
    price: 150,
    img: "img/pastel.jpg",
    more: true,
    desc: "Rico pastel completo de chocolate y fresa.",
    rating: 4.8,
    reviews: [],
  },

  {
    id: 33,
    name: "Té Helado de Durazno",
    cat: "Bebidas",
    price: 28,
    img: "img/te.jpg",
    more: true,
    desc: "Té negro frío con sabor a durazno. 600 ml.",
    rating: 4.2,
    reviews: [],
  },
  {
    id: 34,
    name: "Jugo de Naranja",
    cat: "Bebidas",
    price: 32,
    img: "img/jugo.jpg",
    more: true,
    desc: "Jugo de naranja natural recién exprimido. 500 ml.",
    rating: 4.7,
    reviews: [],
  },
  {
    id: 35,
    name: "Agua Natural",
    cat: "Bebidas",
    price: 15,
    img: "img/agua.jpg",
    more: true,
    desc: "Botella de agua natural de 600 ml.",
    rating: 4.0,
    reviews: [],
  },
  {
    id: 36,
    name: "Frappé de Oreo",
    cat: "Bebidas",
    price: 52,
    emoji: "🥤",
    img: "img/frappe.jpg",
    more: true,
    desc: "Frappé helado de galleta Oreo con crema batida.",
    rating: 4.8,
    reviews: [],
  },
  {
    id: 37,
    name: "Capuchino",
    cat: "Cafés",
    price: 40,
    img: "img/capuchino.jpg",
    desc: "Rico capuchino caliente, algo rico que refresca el alma.",
    rating: 4.9,
    reviews: [],
  },
  {
    id: 38,
    name: "Chocolate caliente",
    cat: "Cafés",
    price: 40,
    img: "img/chocolate.jpg",
    desc: "Rico chocolate caliente, rica bedida para las temporadas de frio .",
    rating: 5.0,
    reviews: [],
  },
  {
    id: 39,
    name: "Cafe frio",
    cat: "Cafés",
    price: 40,
    img: "img/cafefrio.jpg",
    desc: "Rico cafe frio, mucho mas dulce, sin amargar y con doble cafeina.",
    rating: 5.0,
    reviews: [],
  },

  {
    id: 40,
    name: "Hamburguesa Vegetariana",
    cat: "Hamburguesas",
    price: 69,
    img: "img/veggie.jpg",
    more: true,
    desc: "Medallón de lentejas y avena con aguacate, jitomate y lechuga.",
    rating: 4.4,
    reviews: [],
  },
  {
    id: 41,
    name: "Mini Burgers (3 pzas)",
    cat: "Hamburguesas",
    price: 65,
    img: "img/mini-bu.jpg",
    more: true,
    desc: "Tres mini hamburguesas con queso, ideales para compartir.",
    rating: 4.6,
    reviews: [],
  },
  {
    id: 42,
    name: "Esquites",
    cat: "Snacks",
    price: 35,
    img: "img/esquites.jpg",
    more: true,
    desc: "Elote en vaso con mayonesa, queso, chile y limón.",
    rating: 4.5,
    reviews: [],
  },
  {
    id: 43,
    name: "Dedos de Queso (6)",
    cat: "Snacks",
    price: 45,
    img: "img/dedos-queso.jpg",
    more: true,
    desc: "Seis dedos de queso mozzarella empanizados con salsa marinara.",
    rating: 4.6,
    reviews: [],
  },
  {
    id: 44,
    name: "Pizza 4 Quesos",
    cat: "Pizzas",
    price: 85,
    img: "img/pizza-4quesos.jpg",
    more: true,
    desc: "Mozzarella, cheddar, parmesano y queso crema sobre masa artesanal.",
    rating: 4.7,
    reviews: [],
  },
  {
    id: 45,
    name: "Pizza Familiar",
    cat: "Pizzas",
    price: 150,
    img: "img/famili.jpg",
    more: true,
    desc: "Pizza grande de 8 rebanadas, elige tu especialidad.",
    rating: 4.8,
    reviews: [],
  },
  {
    name: "Combo Kids",
    cat: "Combos",
    price: 69,
    img: "img/combo-kids.jpg",
    tag: "bestseller",
    tagText: "KIDS",
    short: "6 nuggets + papas + jugo",
    desc: "Seis nuggets de pollo, papas chicas y jugo. Incluye sorpresa.",
  },
];
PRODUCTS_DEFAULT.push(
  ...[
    {
      name: "Brocheta de Gomitas",
      cat: "Dulces",
      price: 20,
      img: "img/dulces.jpg",
      desc: "Brocheta de gomitas suaves y agridulces de colores. Una pieza.",
      emoji: "🍬",
      id: 46,
      more: false,
    },
    {
      name: "Brocheta de Fresa y Bombón",
      cat: "Dulces",
      price: 30,
      img: "img/dulces.webp",
      desc: "Fresas, bombones y galleta de chocolate con un toque de chocolate blanco. Una brocheta.",
      emoji: "🍓",
      id: 47,
      more: false,
    },
    {
      name: "Pastel de Fresa",
      cat: "Postres",
      price: 45,
      img: "img/revanadas de pastel.jpg",
      desc: "Rebanada de pastel suave con crema y fresa.",
      emoji: "🍰",
      id: 49,
      more: false,
    },
    {
      name: "Café Americano",
      cat: "Bebidas",
      price: 28,
      img: "img/cafe caliente.jpg",
      desc: "Café americano caliente, recién preparado. Vaso de 355 ml.",
      emoji: "☕",
      id: 50,
      more: false,
    },
    {
      name: "Palomitas con Mantequilla",
      cat: "Snacks",
      price: 30,
      img: "img/palomitas-tiza.png",
      desc: "Palomitas recién hechas con mantequilla y una pizca de sal. Porción individual.",
      emoji: "🍿",
      id: 53,
      more: false,
    },
    {
      name: "Papas con Cheddar y Tocino",
      cat: "Snacks",
      price: 49,
      img: "img/papas-cheddar-tiza.png",
      desc: "Papas a la francesa con queso cheddar derretido y trocitos de tocino.",
      emoji: "🍟",
      id: 54,
      more: false,
    },
    {
      name: "Cacahuates Enchilados",
      cat: "Snacks",
      price: 25,
      img: "img/cacahuates-enchilados-tiza.png",
      desc: "Cacahuates crujientes sazonados con chile y limón. Porción de 100 g.",
      emoji: "🥜",
      id: 55,
      more: false,
    },
  ],
);

// Ingredientes extras
const EXTRAS = {
  Hamburguesas: [
    { name: "Extra queso", price: 15 },
    { name: "Carne extra", price: 25 },
    { name: "Tocino crujiente", price: 20 },
    { name: "Aguacate", price: 15 },
    { name: "Jalapeños", price: 8 },
  ],
  Snacks: [
    { name: "Queso cheddar", price: 12 },
    { name: "Salsa extra", price: 5 },
    { name: "Tocino", price: 15 },
    { name: "Aderezo ranch", price: 8 },
  ],
  Pizzas: [
    { name: "Extra queso", price: 20 },
    { name: "Peperoni extra", price: 20 },
    { name: "Champiñones", price: 15 },
    { name: "Orilla rellena", price: 25 },
  ],
  Bebidas: [
    { name: "Crema batida", price: 10 },
    { name: "Shot de chocolate", price: 12 },
    { name: "Tamaño grande", price: 10 },
  ],
  Postres: [
    { name: "Bola de helado", price: 15 },
    { name: "Cajeta", price: 8 },
    { name: "Crema batida", price: 10 },
    { name: "Chispas de chocolate", price: 8 },
  ],
  Combos: [
    { name: "Extra queso", price: 15 },
    { name: "Papas grandes", price: 15 },
    { name: "Salsa extra", price: 5 },
    { name: "Cambiar a malteada", price: 20 },
  ],
  Postres: [
    { name: "fresa extras", price: 14 },
    { name: "mermedala", price: 15 },
    { name: "extra chocolate", price: 9 },
  ],
  Dulces: [
    { name: "fresa extras", price: 10 },
    { name: "chispas", price: 15 },
    { name: "extra dulces", price: 10 },
  ],
  Cafés: [
    { name: "leche", price: 20 },
    { name: "crema batida", price: 19 },
    { name: "mas azucarado", price: 5 },
  ],
};

EXTRAS.Dulces = [];

// Promociones
const PROMOS = [
  {
    name: "Hamburguesa Especial",
    cat: "Hamburguesas",
    price: 85,
    img: "img/hamburguesa.jpg",
    tag: "bestseller",
    tagText: "MÁS VENDIDO",
    short: "Carne de res + Queso + Tocino",
    desc: "Jugosa carne de res a la parrilla con queso fundido, lechuga fresca y jitomate.",
  },
  {
    name: "Pizza Peperoni",
    cat: "Pizzas",
    price: 120,
    img: "img/pizza.jpg",
    tag: "popular",
    tagText: "POPULAR",
    short: "Queso Mozzarella + Peperoni",
    desc: "Masa crujiente horneada al momento con abundante queso mozzarella y peperoni.",
  },
  {
    name: "Papas Preparadas",
    cat: "Snacks",
    price: 45,
    img: "img/papas.jpg",
    tag: "save",
    tagText: "Ahorra hasta el 15%",
    short: "Crujientes con Especias",
    desc: "Papas a la francesa doraditas y sazonadas con especias de la casa.",
  },
  {
    name: "Combo Pareja",
    cat: "Combos",
    price: 159,
    img: "img/combopareja.jpg",
    tag: "save",
    tagText: "Ahorra $30",
    short: "2 hamburguesas + papas + 2 refrescos",
    desc: "Dos hamburguesas clásicas, papas grandes para compartir y dos refrescos fríos.",
  },
  {
    name: "Combo Familiar",
    cat: "Combos",
    price: 239,
    img: "img/combofamiliar.jpg",
    tag: "popular",
    tagText: "FAMILIAR",
    short: "Pizza + 8 alitas + refresco 2 L",
    desc: "Pizza grande de pepperoni, ocho alitas BBQ o búfalo y refresco de 2 litros.",
  },
  {
    name: "Combo Kids",
    cat: "Combos",
    price: 69,
    img: "img/combo-kids.jpg",
    tag: "bestseller",
    tagText: "KIDS",
    short: "6 nuggets + papas + jugo",
    desc: "Seis nuggets de pollo, papas chicas y jugo. Incluye sorpresa.",
  },
  {
    name: "2x1 en Hot Dogs",
    cat: "Snacks",
    price: 59,
    img: "img/hotdog.jpg",
    tag: "save",
    tagText: "2x1",
    short: "Dos hot dogs jumbo",
    desc: "Dos hot dogs jumbo con tocino, cebolla, jitomate y aderezos al gusto.",
  },
  {
    name: "Martes de Alitas",
    cat: "Snacks",
    price: 75,
    img: "img/Alitas.jpg",
    tag: "popular",
    tagText: "-15%",
    short: "8 alitas BBQ o búfalo",
    desc: "Ocho alitas bañadas en la salsa que elijas, con aderezo ranch.",
  },
  {
    name: "Combo Taquero",
    cat: "Combos",
    price: 99,
    img: "img/tacos.jpg",
    tag: "bestseller",
    tagText: "NUEVO",
    short: "5 tacos al pastor + 2 refrescos",
    desc: "Cinco tacos al pastor con piña y salsa verde, más dos refrescos.",
  },
  {
    name: "Helados",
    cat: "Dulces",
    price: 25,
    img: "img/helado.jpg",
    tag: "bestseller",
    tagText: "NUEVO ",
    short: "Helado sabor fresa, vainilla y chocolate",
    desc: "Llevate un helados con el descuento del 10% ",
  },
  {
    name: "Malteada Doble",
    cat: "Bebidas",
    price: 69,
    img: "img/malteada.jpg",
    tag: "save",
    tagText: "Ahorra hasta 25%",
    short: "2 malteadas a elegir",
    desc: "Dos malteadas cremosas con crema batida. Elige fresa o chocolate.",
  },
];

let PRODUCTS = load("tiza_products", PRODUCTS_DEFAULT);
if (!Array.isArray(PRODUCTS)) PRODUCTS = PRODUCTS_DEFAULT.slice();
function guardarProducts() {
  localStorage.setItem("tiza_products", JSON.stringify(PRODUCTS));
}

const BRANCHES = FoodBranches.catalog.slice();

const feeOf = FoodBranches.deliveryFee;
const etaOf = (b) => Math.round(15 + b.km * 4);
const etaText = () => "30–60 min según tu pedido";

const DRIVERS = [
  "Luis Hernández",
  "Mario Cruz",
  "Diego Ramírez",
  "Pedro Sánchez",
  "Carlos Vega",
];

const DEMO_SEGUNDOS = true;
const STAGES = [
  {
    name: "Pedido recibido",
    icon: "✅",
    sub: "Tu pedido llegó a la sucursal",
    at: 0,
    frac: 0,
    art: "receipt",
    hero: "📋",
  },
  {
    name: "En preparación",
    icon: "👨‍🍳",
    sub: "Estamos cocinando tu comida",
    at: 6,
    frac: 0.15,
    art: "cook",
    hero: "👨‍🍳",
  },
  {
    name: "En camino",
    icon: "🛵",
    sub: "El repartidor va hacia tu casa",
    at: 36,
    frac: 0.45,
    art: "bike",
    hero: "🛵",
  },
  {
    name: "Entregado",
    icon: "🎉",
    sub: "¡Que lo disfrutes!",
    at: 96,
    frac: 1,
    art: "done",
    hero: "🎉",
  },
];

/* Mini ilustraciones del seguimiento (SVG embebido, sin archivos extra) */
function stageArt(kind) {
  const common =
    'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40" aria-hidden="true"';
  if (kind === "receipt") {
    return (
      "<svg " +
      common +
      ">" +
      '<rect x="14" y="8" width="36" height="48" rx="6" fill="#fff" stroke="#3b2314" stroke-width="2"/>' +
      '<path d="M20 18h24M20 26h18M20 34h22M20 42h14" stroke="#d62828" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="44" cy="48" r="8" fill="#22c55e"/>' +
      '<path d="M40.5 48l2.2 2.2 4.5-5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
    );
  }
  if (kind === "cook") {
    return (
      "<svg " +
      common +
      ">" +
      '<ellipse cx="32" cy="46" rx="18" ry="6" fill="#f59e0b"/>' +
      '<path d="M16 36c0-10 7-16 16-16s16 6 16 16" fill="#ffb703" stroke="#3b2314" stroke-width="2"/>' +
      '<path d="M20 36h24v6c0 4-5 8-12 8s-12-4-12-8z" fill="#d62828"/>' +
      '<path d="M26 18c0-4 3-7 6-7s6 3 6 7" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="24" cy="28" r="2" fill="#fff"/><circle cx="32" cy="24" r="2.2" fill="#fff"/><circle cx="40" cy="28" r="2" fill="#fff"/>' +
      "</svg>"
    );
  }
  if (kind === "bike") {
    return (
      "<svg " +
      common +
      ">" +
      '<circle cx="18" cy="44" r="10" fill="none" stroke="#3b2314" stroke-width="2.5"/>' +
      '<circle cx="46" cy="44" r="10" fill="none" stroke="#3b2314" stroke-width="2.5"/>' +
      '<circle cx="18" cy="44" r="3.5" fill="#d62828"/><circle cx="46" cy="44" r="3.5" fill="#d62828"/>' +
      '<path d="M18 44 L30 28 L42 28 L46 44 M30 28 L34 40 M34 40 L22 40" fill="none" stroke="#3b2314" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<rect x="36" y="18" width="14" height="12" rx="3" fill="#ffb703" stroke="#3b2314" stroke-width="1.8"/>' +
      '<path d="M38 18c2-6 8-6 10 0" fill="none" stroke="#94a3b8" stroke-width="1.8"/>' +
      "</svg>"
    );
  }
  // done
  return (
    "<svg " +
    common +
    ">" +
    '<rect x="12" y="22" width="40" height="28" rx="6" fill="#ffb703" stroke="#3b2314" stroke-width="2"/>' +
    '<path d="M12 30h40" stroke="#d62828" stroke-width="3"/>' +
    '<path d="M24 22c0-8 16-8 16 0" fill="none" stroke="#3b2314" stroke-width="2.2"/>' +
    '<circle cx="48" cy="18" r="10" fill="#22c55e"/>' +
    '<path d="M43.5 18l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>"
  );
}

function stageHeroArt(kind) {
  const common =
    'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="88" height="88" aria-hidden="true"';
  if (kind === "receipt") {
    return (
      "<svg " +
      common +
      ' class="track-hero-art">' +
      '<circle cx="60" cy="60" r="54" fill="rgba(255,255,255,0.18)"/>' +
      '<rect x="34" y="22" width="52" height="70" rx="10" fill="#fff"/>' +
      '<path d="M44 38h32M44 50h26M44 62h30M44 74h20" stroke="#d62828" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="78" cy="86" r="14" fill="#22c55e"/><path d="M71 86l5 5 10-11" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>' +
      "</svg>"
    );
  }
  if (kind === "cook") {
    return (
      "<svg " +
      common +
      ' class="track-hero-art">' +
      '<circle cx="60" cy="60" r="54" fill="rgba(255,255,255,0.18)"/>' +
      '<ellipse cx="60" cy="88" rx="34" ry="10" fill="#f59e0b"/>' +
      '<path d="M30 68c0-20 12-32 30-32s30 12 30 32" fill="#ffb703"/>' +
      '<path d="M34 68h52v10c0 8-10 16-26 16s-26-8-26-16z" fill="#d62828"/>' +
      '<path d="M48 34c0-8 6-14 12-14s12 6 12 14" fill="none" stroke="#e2e8f0" stroke-width="3"/>' +
      '<circle cx="46" cy="54" r="4" fill="#fff"/><circle cx="60" cy="48" r="4.5" fill="#fff"/><circle cx="74" cy="54" r="4" fill="#fff"/>' +
      "</svg>"
    );
  }
  if (kind === "bike") {
    return (
      "<svg " +
      common +
      ' class="track-hero-art">' +
      '<circle cx="60" cy="60" r="54" fill="rgba(255,255,255,0.18)"/>' +
      '<circle cx="36" cy="78" r="16" fill="none" stroke="#fff" stroke-width="4"/>' +
      '<circle cx="88" cy="78" r="16" fill="none" stroke="#fff" stroke-width="4"/>' +
      '<circle cx="36" cy="78" r="5" fill="#ffb703"/><circle cx="88" cy="78" r="5" fill="#ffb703"/>' +
      '<path d="M36 78 L55 48 L78 48 L88 78 M55 48 L62 70 M62 70 L42 70" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>' +
      '<rect x="70" y="30" width="24" height="18" rx="4" fill="#ffb703"/>' +
      "</svg>"
    );
  }
  return (
    "<svg " +
    common +
    ' class="track-hero-art">' +
    '<circle cx="60" cy="60" r="54" fill="rgba(255,255,255,0.18)"/>' +
    '<rect x="28" y="48" width="64" height="40" rx="10" fill="#ffb703"/>' +
    '<path d="M28 60h64" stroke="#d62828" stroke-width="5"/>' +
    '<path d="M44 48c0-14 32-14 32 0" fill="none" stroke="#fff" stroke-width="4"/>' +
    '<circle cx="86" cy="40" r="16" fill="#22c55e"/><path d="M78 40l5.5 5.5 12-13" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>' +
    "</svg>"
  );
}

/* ----------  mapa regsitro de lugares o sitios ---------- */

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const money = (n) => "$" + Number(n).toFixed(2);

function esc(text) {
  return String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

function setFrame(frame, url) {
  if (frame.dataset.url !== url) {
    frame.dataset.url = url;
    frame.src = url;
  }
}
const enc = encodeURIComponent;
const branchQuery = (b) => b.coords || b.name + ", " + b.zone;
const addressQuery = FoodBranches.addressQuery;
const mapPlaceUrl = (b) =>
  "https://maps.google.com/maps?q=" +
  enc(branchQuery(b)) +
  "&z=14&output=embed";
const destQuery = (d) => (d.coords ? d.coords : addressQuery(d.text));
const mapRouteUrl = (b, d) =>
  "https://maps.google.com/maps?saddr=" +
  enc(branchQuery(b)) +
  "&daddr=" +
  enc(destQuery(d)) +
  "&output=embed";
const mapRouteLink = (b, d) =>
  "https://www.google.com/maps/dir/?api=1&origin=" +
  enc(branchQuery(b)) +
  "&destination=" +
  enc(destQuery(d));

function mediaHTML(p) {
  return (
    '<img src="' +
    esc(FoodManagement.imagePath(p.img)) +
    '" alt="' +
    esc(p.name) +
    '" loading="lazy" data-fallback-emoji="' +
    esc(p.emoji || "🍽️") +
    '">'
  );
}

/* ----------  ESTADO ---------- */

const state = {
  user: load("tizafood_user", null),
  orders: load("tizafood_orders", []),
  reviews: [],
  cart: load("tizafood_cart", []),
  favs: load("tizafood_favs", []),
  branch: 0,
  cat: "Todo",
  query: "",
  menuQuery: "",
  view: "home",
  checkout: null,
};

/* ---------- BASE DE DATOS (db.json) ---------- */

function showImageFallback(img) {
  if (img.hasAttribute("data-hero-photo")) {
    img.style.display = "none";
    img.nextElementSibling.style.display = "grid";
  } else if (img.hasAttribute("data-fallback-emoji")) {
    const icon = document.createElement("span");
    icon.className = "emoji";
    icon.textContent = img.dataset.fallbackEmoji;
    img.replaceWith(icon);
  }
}
document.addEventListener(
  "error",
  (event) => {
    if (event.target instanceof HTMLImageElement)
      showImageFallback(event.target);
  },
  true,
);
const heroPhoto = $("[data-hero-photo]");
if (heroPhoto?.complete && !heroPhoto.naturalWidth)
  showImageFallback(heroPhoto);

let dbSource = "local";

const normReview = (r) => ({
  id: String(r.id),
  user: String(r.user || "Cliente"),
  product: String(r.product || ""),
  comment: String(r.comment || ""),
  date: r.date || null,
  mine: r.mine === true,
  moderated: r.moderated === true,
  verifiedPurchase: r.verifiedPurchase === true,
  productKey: r.productKey || null,
  productId: r.productId == null ? null : r.productId,
  stars: Math.max(1, Math.min(5, Number(r.stars) || 5)),
  kind:
    r.kind === "delivery" || String(r.product || "").indexOf("Entrega") === 0
      ? "delivery"
      : r.kind || "product",
});

let transferConfig = { bank: "", holder: "", clabe: "" };
let trackingConfig = { demo: false };
function applyDB(db) {
  if (!db || typeof db !== "object") return;
  if (db.tracking && typeof db.tracking.demo === "boolean")
    trackingConfig = { demo: db.tracking.demo };
  const put = (arr, src) => {
    if (Array.isArray(src)) arr.splice(0, arr.length, ...src);
  };
  if (db.transfer && typeof db.transfer === "object")
    transferConfig = {
      bank: String(db.transfer.bank || "").trim(),
      holder: String(db.transfer.holder || "").trim(),
      clabe: String(db.transfer.clabe || "").trim(),
      demo: db.transfer.demo === true,
    };
  for (const item of [...(db.products || []), ...(db.promos || [])])
    item.img = FoodManagement.imagePath(item.img);
  put(PRODUCTS, db.products);
  put(PROMOS, db.promos);
  if (db.extras && typeof db.extras === "object") {
    Object.keys(EXTRAS).forEach((k) => delete EXTRAS[k]);
    Object.assign(EXTRAS, db.extras);
  }
  if (Array.isArray(db.reviews)) {
    const list = db.reviews
      .map(normReview)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    state.reviews = list;
  }
  state.branch = Math.max(0, Math.min(state.branch, BRANCHES.length - 1));
}

async function loadDB() {
  if (location.protocol === "file:" && !window.localSchoolDemo) {
    // La vista local utiliza únicamente los datos públicos de demostración.
    const preview = $("#transferDemoConfig");
    if (preview) {
      try {
        const transfer = JSON.parse(preview.textContent);
        if (transfer.demo === true) applyDB({ transfer });
      } catch (e) {
        /* La vista sigue disponible si la configuración no es válida. */
      }
    }
    return;
  }
  for (const url of ["api/db", "db.json"]) {
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) continue;
      applyDB(await r.json());
      dbSource = url === "api/db" ? "api" : "file";
      return;
    } catch (e) {}
  }
}

function dbSend(method, path, body) {
  if (dbSource !== "api") return;
  try {
    fetch("api/" + path, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    }).catch(() => {});
  } catch (e) {
    /* nada */
  }
}
const ownerOf = () =>
  state.user && state.user.email ? state.user.email.toLowerCase() : "";

const dbReady = loadDB();

/* ---------- SONIDO  ---------- */

const Sound = {
  ctx: null,
  on: true,
  pending: null,
  pendingAt: 0,
  ensure() {
    if (!this.ctx) {
      try {
        const C = window.AudioContext || window.webkitAudioContext;
        if (C) this.ctx = new C();
      } catch (e) {}
    }
    return this.ctx;
  },
  tone(freq, t0, dur, type, vol) {
    const c = this.ctx,
      o = c.createOscillator(),
      g = c.createGain(),
      t = c.currentTime + t0;
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  },
  welcome() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      this.tone(f, i * 0.11, 0.5, "triangle", 0.15),
    );
    this.tone(1318.5, 0.5, 0.8, "sine", 0.1);
  },
  pay() {
    this.tone(988, 0, 0.12, "square", 0.06);
    this.tone(1319, 0.1, 0.45, "square", 0.06);
    [659.25, 830.6, 987.77, 1318.5].forEach((f, i) =>
      this.tone(f, 0.35 + i * 0.07, 0.7, "triangle", 0.12),
    );
  },
  tap() {
    this.tone(660, 0, 0.09, "triangle", 0.1);
    this.tone(880, 0.07, 0.12, "triangle", 0.1);
  },
  play(name) {
    if (!this.on) return;
    const c = this.ensure();
    if (!c) return;
    if (c.state === "running") {
      this[name]();
      return;
    }

    this.pending = name;
    this.pendingAt = Date.now();
    c.resume()
      .then(() => {
        if (c.state === "running" && this.pending === name && this.on) {
          this.pending = null;
          this[name]();
        }
      })
      .catch(() => {});
  },
  unlock() {
    const c = this.ensure();
    if (!c) return;
    c.resume()
      .then(() => {
        if (this.pending && Date.now() - this.pendingAt < 20000 && this.on) {
          const n = this.pending;
          this.pending = null;
          this[n]();
        }
        this.pending = null;
      })
      .catch(() => {});
  },
};
["pointerdown", "keydown", "touchstart"].forEach((ev) =>
  window.addEventListener(ev, () => Sound.unlock(), { passive: true }),
);

function paintSound() {
  const b = $("#btnSound");
  b.textContent = Sound.on ? "🔊" : "🔇";
  b.setAttribute("aria-pressed", String(Sound.on));
}
$("#btnSound").addEventListener("click", () => {
  Sound.on = !Sound.on;
  save("tizafood_sound", Sound.on);
  paintSound();
  const bg = document.getElementById("bgMusic");
  if (bg) {
    if (Sound.on) {
      bg.volume = 0.28;
      if (window.TizaBgMusic && window.TizaBgMusic.unlock)
        window.TizaBgMusic.unlock();
      else bg.play().catch(() => {});
      Sound.play("tap");
    } else {
      try {
        bg.pause();
      } catch (e) {}
    }
  } else if (Sound.on) {
    Sound.play("tap");
  }
  toast(
    Sound.on ? "Sonido y música activados" : "Sonido y música desactivados",
  );
});
paintSound();

/* ----------  PANTALLAS: splash, bienvenida, registro, app ---------- */

function startApp() {
  Sound.play("welcome");
  $("#splash").classList.add("leave");
  setTimeout(() => $("#splash").classList.add("hidden"), 900);
  showWelcome();
}

function showWelcome() {
  if (sessionStorage.getItem("tiza_session_expired_notice") === "1") {
    sessionStorage.removeItem("tiza_session_expired_notice");
    authLogin = true;
    staffLoginRole = "";
    renderAuthMode();
    $("#welcome").classList.add("hidden");
    $("#register").classList.remove("hidden");
    $("#registerStatus").textContent =
      "Tu sesión terminó. Las sesiones duran 1 hora; vuelve a iniciar sesión.";
    return;
  }
  if (state.user) {
    $("#welcomeTitle").textContent =
      "¡Qué bueno verte, " + state.user.name.split(" ")[0] + "!";
    $("#welcomeText").textContent =
      "Gracias por elegir nuestra app. Tu comida favorita te está esperando.";
    $("#btnWelcome").textContent = "Entrar a la app";
  }
  $("#welcome").classList.remove("hidden");
}

$("#btnWelcome").addEventListener("click", () => {
  staffLoginRole = "";
  renderAuthMode();
  $("#welcome").classList.add("hidden");
  if (state.user) showApp();
  else $("#register").classList.remove("hidden");
});

$("#btnRegBack").addEventListener("click", () => {
  staffLoginRole = "";
  renderAuthMode();
  $("#register").classList.add("hidden");
  $("#welcome").classList.remove("hidden");
});

async function showApp() {
  await dbReady;
  if (dbSource === "api") {
    try {
      const response = await fetch("api/me", { cache: "no-store" });
      if (!response.ok) throw new Error("Inicia sesión");
      const result = await response.json();
      state.user = result.user;
      FoodSession.watch(result.expiresAt);
      if (state.user.role !== "cliente") {
        window.showStaffPanel(state.user);
        return;
      }
      const [orders, catalog] = await Promise.all([
        fetch("api/orders", { cache: "no-store" }),
        fetch("api/db", { cache: "no-store" }),
      ]);
      if (catalog.ok) applyDB(await catalog.json());
      if (orders.ok) {
        state.orders = (await orders.json()).orders;
        FoodNotifications.observe(state.user.email, state.orders);
        save("tizafood_orders", state.orders);
      }
    } catch (err) {
      state.user = null;
      save("tizafood_user", null);
      $("#register").classList.remove("hidden");
      $("#welcome").classList.add("hidden");
      $("#app").classList.add("hidden");
      return;
    }
  }
  buildApp();
}

function buildApp() {
  $("#welcome").classList.add("hidden");
  $("#register").classList.add("hidden");
  $("#app").classList.remove("hidden");
  state.branch =
    FoodBranches.forAddress({ text: state.user.address }, state.user)?.index ??
    0;
  renderUserChip();
  renderCats();
  renderMenu();
  renderPromos();
  renderHomeBranch();
  const mh = $("#menuHeading");
  if (mh) mh.textContent = "Menú de " + BRANCHES[state.branch].name;
  renderReviews();
  renderBranches();
  renderCart();
  renderFavs();
  updateCartBadge(false);
  showView("home");
  window.scrollTo(0, 0);
  startClientSync();
}

async function finishAuth(user) {
  if (!state.user || state.user.email !== user.email) {
    state.cart = [];
    state.orders = [];
    state.favs = [];
    ["tizafood_cart", "tizafood_orders", "tizafood_favs"].forEach((k) =>
      save(k, []),
    );
  }
  state.user = user;
  save("tizafood_user", state.user);
  $("#rPassword").value = "";
  $("#rPasswordConfirm").value = "";
  hidePassword("rPassword");
  hidePassword("rPasswordConfirm");
  await showApp();
}
function hidePassword(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = "password";
  const button = document.querySelector('[data-password-toggle="' + id + '"]');
  if (button) {
    button.setAttribute("aria-pressed", "false");
    button.setAttribute(
      "aria-label",
      id.endsWith("Confirm")
        ? "Mostrar confirmación de contraseña"
        : "Mostrar contraseña",
    );
  }
}
$$("[data-password-toggle]").forEach((button) =>
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.passwordToggle);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.setAttribute("aria-pressed", String(show));
    button.setAttribute(
      "aria-label",
      show
        ? "Ocultar contraseña"
        : input.id.endsWith("Confirm")
          ? "Mostrar confirmación de contraseña"
          : "Mostrar contraseña",
    );
  }),
);
["registerForm", "employeeForm"].forEach((id) =>
  document.getElementById(id).addEventListener("reset", () => {
    document
      .querySelectorAll("#" + id + " [data-password-toggle]")
      .forEach((button) => hidePassword(button.dataset.passwordToggle));
  }),
);
let authLogin = true,
  ownerSetup = false,
  staffLoginRole = "";
function renderAuthMode() {
  ownerSetup = false;
  const creating = !authLogin;
  if (!creating) window.FoodCaptcha.cancel();
  $("#registerForm button[type=submit]").textContent = creating
    ? "Continuar"
    : "Entrar a la app";
  $("#confirmPasswordField").classList.toggle("hidden", !creating);
  $("#rPasswordConfirm").disabled = !creating;
  $("#rPasswordConfirm").value = "";
  hidePassword("rPassword");
  hidePassword("rPasswordConfirm");
  $("#btnForgotPassword").classList.toggle("hidden", creating);
  $("#register").classList.toggle("staff-login", !!staffLoginRole);
  $("#registrationDetails").classList.toggle("hidden", !creating);
  $("#registrationContact").classList.toggle("hidden", !creating);
  $("#register h2").textContent = staffLoginRole
    ? staffLoginRole === "dueno"
      ? "Acceso del dueño"
      : "Acceso del empleado"
    : authLogin
      ? "Iniciar sesión"
      : "Crear cuenta de cliente";
  $("#register .muted").textContent = authLogin
    ? "Ingresa con tu correo electrónico y contraseña."
    : "Completa tus datos para crear tu cuenta y recibir pedidos.";
  $("label[for=rUsername]").textContent = authLogin
    ? "Correo electrónico"
    : "Usuario";
  $("#rUsername").type = authLogin ? "email" : "text";
  $("#rUsername").placeholder = authLogin ? "correo@ejemplo.com" : "Tu usuario";
  $("#rPassword").autocomplete = authLogin
    ? "current-password"
    : "new-password";
  $("#btnAuthMode").textContent = authLogin
    ? "Crear cuenta de cliente"
    : "Ya tengo cuenta: iniciar sesión";
  $("#registerError").textContent = "";
  $("#registerStatus").textContent = "";
  $("#btnOwnerSetup").classList.add("hidden");
}
$("#btnAuthMode").addEventListener("click", () => {
  staffLoginRole = "";
  authLogin = !authLogin;
  renderAuthMode();
});
renderAuthMode();
$$("[data-staff-login]").forEach((button) =>
  button.addEventListener("click", () => {
    staffLoginRole = button.dataset.staffLogin;
    authLogin = true;
    $("#welcome").classList.add("hidden");
    $("#register").classList.remove("hidden");
    $("#rUsername").value = "";
    $("#rPassword").value = "";
    renderAuthMode();
    $("#rUsername").focus();
  }),
);
$("#registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const error = $("#registerError");
  error.textContent = "";
  $("#registerStatus").textContent = "";
  const terms = $("#acceptTerms");
  if (!terms.checked) {
    error.textContent = "Acepta los términos y condiciones para continuar.";
    terms.focus();
    return;
  }
  const body = {
    username: $("#rUsername").value.trim(),
    password: $("#rPassword").value,
    authProvider: "firebase",
    remember: $("#rememberSession").checked,
  };
  if (staffLoginRole) body.staffRole = staffLoginRole;
  if (authLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.username)) {
    error.textContent = "Escribe un correo electrónico válido.";
    return;
  }
  if (!body.username || body.password.length < 8) {
    error.textContent =
      "Completa tus datos y escribe una contraseña de al menos 8 caracteres.";
    return;
  }
  if (!authLogin) {
    if (body.password !== $("#rPasswordConfirm").value) {
      error.textContent = "Las contraseñas no coinciden. Vuelve a escribirlas.";
      return;
    }
    body.name = $("#rName").value.trim();
    body.email = $("#rEmail").value.trim();
    body.addressParts = {};
    for (const key of [
      "Street",
      "HouseNumber",
      "Neighborhood",
      "Municipality",
      "State",
      "PostalCode",
    ])
      body.addressParts[key[0].toLowerCase() + key.slice(1)] = $(
        "#r" + key,
      ).value.trim();
    if (
      Object.values(body.addressParts).some((v) => !v) ||
      !/^\d{5}$/.test(body.addressParts.postalCode)
    ) {
      error.textContent =
        "Completa la dirección y escribe un código postal de 5 dígitos.";
      return;
    }
    if (
      body.name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
    ) {
      error.textContent = "Revisa tu nombre y tu correo electrónico.";
      return;
    }
  }
  await dbReady;
  const button = $("#registerForm button[type=submit]");
  if (button.disabled) return;
  button.disabled = true;
  try {
    Object.assign(
      body,
      await window.FoodCaptcha.request(authLogin ? "login" : "register"),
    );
    // El mismo flujo de Firebase se usa para clientes y personal. Así, un
    // dueño o empleado también puede terminar su verificación de correo antes
    // de crear la sesión, sin perder la validación de su rol en el servidor.
    const result = await FoodEmail.authenticate(body, {
      register: !authLogin,
    });
    if (result.requiresNewLogin) {
      authLogin = true;
      renderAuthMode();
      $("#rUsername").value = body.email || body.username;
      $("#registerStatus").textContent = result.message;
      toast(result.message);
      return;
    }
    if (!result.user) throw Error("No se pudo verificar tu acceso.");
    await finishAuth(result.user);
  } catch (err) {
    error.textContent = err.message;
  } finally {
    button.disabled = false;
  }
});
let clientSyncTimer = null,
  clientSyncBusy = false;
window.addEventListener("tiza-session-expired", () => {
  clearInterval(clientSyncTimer);
  state.user = null;
  save("tizafood_user", null);
  state.orders = [];
  save("tizafood_orders", []);
  sessionStorage.setItem("tiza_session_expired_notice", "1");
  location.reload();
});
async function syncClientData() {
  if (
    clientSyncBusy ||
    dbSource !== "api" ||
    !state.user ||
    state.user.role !== "cliente"
  )
    return;
  const email = state.user.email;
  clientSyncBusy = true;
  try {
    const [ordersResponse, dbResponse] = await Promise.all([
      fetch("api/orders", { cache: "no-store" }),
      fetch("api/db", { cache: "no-store" }),
    ]);
    if (ordersResponse.status === 401) {
      FoodSession.expire();
      return;
    }
    if (!ordersResponse.ok || !dbResponse.ok) return;
    const [orderData, db] = await Promise.all([
      ordersResponse.json(),
      dbResponse.json(),
    ]);
    if (!state.user || state.user.email !== email) return;
    const changed = JSON.stringify(PRODUCTS) !== JSON.stringify(db.products);
    applyDB(db);
    FoodNotifications.observe(email, orderData.orders);
    state.orders = orderData.orders.map((order) => {
      const old = state.orders.find((o) => o.folio === order.folio);
      return old ? Object.assign(old, order) : order;
    });
    save("tizafood_orders", state.orders);
    if (changed) {
      renderCats();
      renderMenu();
      renderFavs();
      if (state.view === "search") renderSearch();
    }
    try {
      renderReviews();
    } catch (e) {}
    if ($("#productModal").classList.contains("open")) renderSheetReviews();
    if ($("#accountScreen").classList.contains("open")) renderOrders();
    if ($("#trackScreen").classList.contains("open")) updateTracking();
  } catch (err) {
    /* Conserva la vista actual si no hay conexión. */
  } finally {
    clientSyncBusy = false;
  }
}
function startClientSync() {
  clearInterval(clientSyncTimer);
  clientSyncTimer = setInterval(syncClientData, 5000);
}
window.addEventListener("storage", (e) => {
  if (e.key === "tiza_school_db_v1") syncClientData();
});
window.addEventListener("focus", syncClientData);

/* ---------- 5. NAVEGACIÓN (barra inferior) ---------- */

function showView(name) {
  state.view = name;
  $$(".view").forEach((v) =>
    v.classList.toggle("active", v.id === "view-" + name),
  );
  $$(".nav-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === name),
  );
  if (name === "search") {
    renderSearch();
  }
  if (name === "cart") renderCart();
  if (name === "favs") renderFavs();
  if (name === "places") renderBranches();
  window.scrollTo(0, 0);
}

$$(".nav-btn").forEach((b) =>
  b.addEventListener("click", () => showView(b.dataset.view)),
);

$("#heroSearch").addEventListener("click", () => {
  showView("search");
  setTimeout(() => $("#searchInput").focus(), 50);
});
$("#heroSearch").addEventListener("focus", () => {
  showView("search");
  setTimeout(() => $("#searchInput").focus(), 50);
});
$("#homeBranch").addEventListener("click", () => showView("places"));

function openScreen(id) {
  const s = $(id);
  s.classList.add("open");
  s.setAttribute("aria-hidden", "false");
}
function closeScreen(s) {
  s.classList.remove("open");
  s.setAttribute("aria-hidden", "true");
  if (s.id === "trackScreen") stopTracking();
}
function openModal(id) {
  const m = $(id);
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
}
function closeModal(m) {
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
}

$$(".modal").forEach((m) => {
  m.addEventListener("click", (e) => {
    if (m.id === "emailVerificationModal") return;
    if (m.id === "payModal" && pay.busy) return;
    if (e.target === m || e.target.closest("[data-close]")) closeModal(m);
  });
});
$$(".screen [data-back]").forEach((b) =>
  b.addEventListener("click", () => closeScreen(b.closest(".screen"))),
);

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || pay.busy) return;
  const modals = $$(".modal.open");
  if (modals.length) {
    modals.forEach(closeModal);
    return;
  }
  const screens = $$(".screen.open");
  if (screens.length) closeScreen(screens[screens.length - 1]);
});

/* ----------  INICIO: categorías y menú ---------- */

function renderHomeBranch() {
  $("#homeBranchName").textContent =
    BRANCHES[state.branch].name + " · " + etaText(BRANCHES[state.branch]);
}

const inBranch = (p, idx) =>
  !p.only || p.only.includes(idx === undefined ? state.branch : idx);

function renderCats() {
  const names = [...new Set(PRODUCTS.map((p) => p.cat))];
  const count = (c) =>
    PRODUCTS.filter(
      (p) => inBranch(p) && (c === "Todo" ? !p.more : p.cat === c),
    ).length;
  const cats = ["Todo"].concat(names.filter((c) => count(c) > 0));
  if (!cats.includes(state.cat)) state.cat = "Todo";

  const box = $("#cats");
  box.innerHTML = "";
  cats.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat" + (c === state.cat ? " active" : "");
    btn.innerHTML = esc(c) + ' <span class="cat-count">' + count(c) + "</span>";
    btn.addEventListener("click", () => {
      state.cat = c;
      renderCats();
      renderMenu();
    });
    box.appendChild(btn);
  });

  const hidden = names
    .map((c) => ({
      c: c,
      n: PRODUCTS.filter((p) => inBranch(p) && p.more && p.cat === c).length,
    }))
    .filter((x) => x.n > 0);
  const hint = $("#catHint");
  if (state.cat === "Todo" && hidden.length) {
    hint.innerHTML =
      "✨ Hay más opciones en: " +
      hidden
        .map((x) => "<strong>" + esc(x.c) + "</strong> (+" + x.n + ")")
        .join(", ") +
      ". Toca la categoría para verlas.";
    hint.classList.remove("hidden");
  } else {
    hint.classList.add("hidden");
  }
}

function itemCard(p, i) {
  const el = document.createElement("div");
  const fav = state.favs.includes(p.id);
  el.className = "item" + (p.soldOut ? " sold-out" : "");
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  el.style.animationDelay = i * 0.04 + "s";
  el.innerHTML =
    '<button class="heart" aria-label="Favorito">' +
    (fav ? "♥" : "♡") +
    "</button>" +
    '<div class="item-img">' +
    mediaHTML(p) +
    "</div>" +
    '<div class="item-name">' +
    esc(p.name) +
    "</div>" +
    '<div class="item-price">' +
    money(p.price) +
    "</div>" +
    '<div class="item-add">' +
    (p.soldOut ? "Agotado" : "Personalizar +") +
    "</div>";
  el.addEventListener("click", (e) => {
    if (e.target.closest(".heart")) {
      e.stopPropagation();
      toggleFav(p.id);
      return;
    }
    openSheet(p);
  });
  el.addEventListener("keydown", (e) => {
    if (e.target === el && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openSheet(p);
    }
  });
  return el;
}

function fillGrid(box, list) {
  box.innerHTML = "";
  list.forEach((p, i) => box.appendChild(itemCard(p, i)));
}

function renderMenu() {
  const q = state.menuQuery.toLowerCase();
  const list = PRODUCTS.filter(
    (p) =>
      inBranch(p) &&
      (state.cat === "Todo" ? !p.more || q : p.cat === state.cat) && // lo "más" solo sale en su categoría o al buscar
      (!q || (p.name + " " + p.desc).toLowerCase().includes(q)),
  );
  fillGrid($("#menu"), list);
  $("#noProducts").classList.toggle("hidden", list.length > 0);
  $("#menuCount").textContent =
    list.length + (list.length === 1 ? " producto" : " productos");
}

/* ---------- FAVORITOS ---------- */

function toggleFav(id) {
  const i = state.favs.indexOf(id);
  if (i >= 0) {
    state.favs.splice(i, 1);
    toast("Quitado de favoritos");
  } else {
    state.favs.push(id);
    toast("Guardado en favoritos ♥");
  }
  save("tizafood_favs", state.favs);
  renderMenu();
  renderFavs();
  if (state.view === "search") renderSearch();
  if (sheet.item && sheet.item.id) updateSheetFav();
}

function renderFavs() {
  const list = PRODUCTS.filter((p) => state.favs.includes(p.id));
  fillGrid($("#favList"), list);
  $("#favEmpty").classList.toggle("hidden", list.length > 0);
}

/* ----------  BUSCAR ---------- */

$("#searchInput").addEventListener("input", (e) => {
  state.query = e.target.value.trim();
  renderSearch();
});

function renderSearch() {
  const q = state.query.toLowerCase();
  let prods;
  if (!q) {
    prods = PRODUCTS.filter((p) => inBranch(p) && !p.more)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    $("#searchLabel").textContent = "Populares";
  } else {
    prods = PRODUCTS.filter(
      (p) =>
        inBranch(p) &&
        (p.name + " " + p.cat + " " + p.desc).toLowerCase().includes(q),
    );
    $("#searchLabel").textContent = "Resultados";
  }
  fillGrid($("#searchResults"), prods);

  const box = $("#searchBranches");
  box.innerHTML = "";
  const bl = q
    ? BRANCHES.map((b, i) => ({ b, i })).filter((x) =>
        (x.b.name + " " + x.b.zone).toLowerCase().includes(q),
      )
    : [];
  bl.forEach((x) => box.appendChild(branchCard(x.b, x.i)));
  $("#searchEmpty").classList.toggle(
    "hidden",
    prods.length > 0 || bl.length > 0,
  );
}

/* ----------  SUCURSALES / LUGARES ---------- */

function branchCard(b, i) {
  const card = document.createElement("div");
  card.className = "branch" + (i === state.branch ? " active" : "");
  card.innerHTML =
    "<strong>" +
    esc(b.name) +
    "</strong>" +
    "<small>" +
    esc(b.zone) +
    "</small>" +
    '<div class="branch-meta"><span>' +
    etaText(b) +
    "</span>" +
    '<span class="fee-tag">Envío ' +
    money(feeOf(b)) +
    "</span></div>";
  return card;
}

function assignBranch(destination) {
  const i = FoodBranches.forAddress(destination, state.user)?.index ?? 0;
  if (i === state.branch) return;
  state.branch = i;
  renderBranches();
  renderHomeBranch();
  const mh = $("#menuHeading");
  if (mh) mh.textContent = "Menú de " + BRANCHES[i].name;
  renderCats();
  renderMenu();
  if (state.view === "search") renderSearch();
  renderCart();
}

function renderBranches() {
  const box = $("#branches");
  box.innerHTML = "";
  BRANCHES.forEach((b, i) => box.appendChild(branchCard(b, i)));

  const b = BRANCHES[state.branch];
  $("#plName").textContent = b.name.replace("Sucursal ", "");
  $("#plEta").textContent = etaText(b);
  $("#plFee").textContent = money(feeOf(b));
  if (state.view === "places") setFrame($("#plMap"), mapPlaceUrl(b));
  $("#plLink").href =
    "https://www.google.com/maps/search/?api=1&query=" + enc(branchQuery(b));
}

/* ----------  PROMOCIONES ---------- */

let promosListas = false;

function crearTarjetaPromo(p, esClon) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("role", "button");
  if (esClon) {
    card.setAttribute("aria-hidden", "true");
    card.tabIndex = -1;
  } else {
    card.tabIndex = 0;
  }

  card.innerHTML =
    '<span class="card-tag ' +
    p.tag +
    '">' +
    esc(p.tagText) +
    "</span>" +
    '<img src="' +
    esc(FoodManagement.imagePath(p.img)) +
    '" alt="' +
    esc(p.name) +
    '" class="card-img" draggable="false">' +
    "<h3>" +
    esc(p.name) +
    "</h3>" +
    '<p class="card-desc">' +
    esc(p.short) +
    "</p>" +
    '<div class="card-bottom"><span class="card-price">' +
    money(p.price) +
    "</span>" +
    '<span class="add-btn" aria-hidden="true">+</span></div>';

  const img = card.querySelector(".card-img");
  img.addEventListener("error", () => {
    const e = document.createElement("div");
    e.className = "card-emoji";
    e.textContent = p.emoji;
    img.replaceWith(e);
  });

  const abrir = () => openSheet(p);
  card.addEventListener("click", abrir);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir();
    }
  });
  return card;
}

function renderPromos() {
  if (promosListas) return;
  const track = $("#promoTrack");
  const marquee = $("#promoMarquee");
  promosListas = true;

  PROMOS.forEach((p) => track.appendChild(crearTarjetaPromo(p, false)));
  FoodCarousels.mount($("#promotionsCarousel"), marquee);
  FoodCarousels.mount($("#couponsCarousel"), $("#couponViewport"));
}

$("#couponsCarousel").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-coupon]");
  if (!button) return;
  const code = button.dataset.copyCoupon;
  try {
    await navigator.clipboard.writeText(code);
    toast("Cupón " + code + " copiado. Aplícalo al finalizar tu pedido.");
  } catch (error) {
    toast("Tu código es " + code + ". Escríbelo al finalizar tu pedido.");
  }
});

/* ----------  PRODUCTO: PERSONALIZACIONES  ---------- */

const sheet = { item: null, extras: [], qty: 1 };

function extrasFor(item) {
  return EXTRAS[item.cat] || EXTRAS["Snacks"];
}

function openSheet(item) {
  const current = item.id ? PRODUCTS.find((p) => p.id === item.id) : item;
  if (!current || current.soldOut) {
    toast("Este producto está agotado o ya no está disponible.");
    return;
  }
  item = current;
  sheet.item = item;
  sheet.extras = [];
  sheet.qty = 1;

  $("#pImage").innerHTML = mediaHTML(item);
  $("#pName").textContent = item.name;
  $("#pDesc").textContent = item.desc;
  $("#pPrice").textContent = money(item.price);
  renderSheetReviews();

  $("#pExtras").innerHTML = extrasFor(item)
    .map(
      (x, i) =>
        '<label class="extra"><input type="checkbox" data-i="' +
        i +
        '">' +
        '<span class="extra-name">' +
        esc(x.name) +
        '</span><span class="extra-price">+' +
        money(x.price) +
        "</span></label>",
    )
    .join("");

  $("#pFav").classList.toggle("hidden", !item.id);
  updateSheetFav();
  updateSheet();
  $("#productModal .modal-card").scrollTop = 0;
  openModal("#productModal");
}

function updateSheetFav() {
  const on = sheet.item && state.favs.includes(sheet.item.id);
  $("#pFav").textContent = on ? "♥" : "♡";
}
$("#pFav").addEventListener("click", () => {
  if (sheet.item && sheet.item.id) toggleFav(sheet.item.id);
});

function sheetExtras() {
  const list = extrasFor(sheet.item);
  return $$("#pExtras input:checked").map((cb) => list[Number(cb.dataset.i)]);
}

function updateSheet() {
  sheet.extras = sheetExtras();
  const unit = sheet.item.price + sheet.extras.reduce((s, x) => s + x.price, 0);
  $("#qtyNum").textContent = sheet.qty;
  $("#buyTotal").textContent = money(unit * sheet.qty);
}

$("#pExtras").addEventListener("change", updateSheet);
$("#qtyMinus").addEventListener("click", () => {
  if (sheet.qty > 1) {
    sheet.qty--;
    updateSheet();
  }
});
$("#qtyPlus").addEventListener("click", () => {
  if (sheet.qty < 20) {
    sheet.qty++;
    updateSheet();
  }
});

function lineFromSheet() {
  return {
    productId: sheet.item.id || null,
    name: sheet.item.name,
    emoji: sheet.item.emoji,
    img: sheet.item.img,
    only: sheet.item.only || null,
    base: sheet.item.price,
    extras: sheet.extras.map((x) => ({ name: x.name, price: x.price })),
    qty: sheet.qty,
  };
}

$("#btnAddCart").addEventListener("click", () => {
  if (addToCart(lineFromSheet()) === false) return;
  Sound.play("tap");
  closeModal($("#productModal"));
  toast("Agregado al carrito 🛒");
});

$("#btnBuy").addEventListener("click", () => {
  const line = lineFromSheet();
  closeModal($("#productModal"));
  startCheckout([line], false);
});

/* ---------- CARRITO ---------- */

const unitOf = (l) => l.base + l.extras.reduce((s, x) => s + x.price, 0);
const lineTotal = (l) => unitOf(l) * l.qty;
const itemsSubtotal = (items) => items.reduce((s, l) => s + lineTotal(l), 0);
const lineKey = (l) =>
  l.name +
  "|" +
  l.extras
    .map((x) => x.name)
    .sort()
    .join(",");

function addToCart(line) {
  try {
    FoodManagement.available([line], { products: PRODUCTS, promos: PROMOS });
  } catch (err) {
    toast(err.message);
    return false;
  }
  const found = state.cart.find((l) => lineKey(l) === lineKey(line));
  if (found) found.qty = Math.min(20, found.qty + line.qty);
  else state.cart.push(line);
  save("tizafood_cart", state.cart);
  renderCart();
  updateCartBadge(true);
}

function updateCartBadge(animate) {
  const n = state.cart.reduce((s, l) => s + l.qty, 0);
  const b = $("#cartBadge");
  b.textContent = n;
  b.classList.toggle("hidden", n === 0);
  if (animate) {
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
  }
}

function thumbHTML(l) {
  return (
    '<div class="cart-thumb">' +
    mediaHTML({ img: l.img, name: l.name, emoji: l.emoji || "🍽️" }) +
    "</div>"
  );
}

function renderCart() {
  const list = $("#cartList");
  const sum = $("#cartSummary");
  const btn = $("#btnCartCheckout");
  list.innerHTML = "";

  if (state.cart.length === 0) {
    list.innerHTML =
      '<div class="empty">Tu carrito está vacío 🛒<br>Agrega algo rico del menú.<br><br><button class="btn btn-main" id="goMenu">Ver menú</button></div>';
    $("#goMenu").addEventListener("click", () => {
      showView("home");
      setTimeout(
        () => $("#menuSection").scrollIntoView({ behavior: "smooth" }),
        60,
      );
    });
    sum.classList.add("hidden");
    btn.classList.add("hidden");
    updateCartBadge(false);
    return;
  }

  state.cart.forEach((l, i) => {
    const row = document.createElement("div");
    row.className = "cart-line";
    row.innerHTML =
      thumbHTML(l) +
      '<div><div class="cart-name">' +
      esc(l.name) +
      "</div>" +
      (l.extras.length
        ? '<span class="cart-extras">+ ' +
          esc(l.extras.map((x) => x.name).join(", ")) +
          "</span>"
        : "") +
      '<span class="cart-price">' +
      money(lineTotal(l)) +
      "</span></div>" +
      '<div class="cart-ctrl"><div class="mini-qty"><button data-act="minus" data-i="' +
      i +
      '">−</button><span>' +
      l.qty +
      '</span><button data-act="plus" data-i="' +
      i +
      '">+</button></div>' +
      '<button class="cart-remove" data-act="del" data-i="' +
      i +
      '">Quitar</button></div>';
    list.appendChild(row);
  });

  const b = BRANCHES[state.branch];
  const sub = itemsSubtotal(state.cart);
  sum.innerHTML =
    '<div class="sum-row"><span>Subtotal</span><span>' +
    money(sub) +
    "</span></div>" +
    '<div class="sum-row"><span>Envío<small>' +
    esc(b.name) +
    "</small></span><span>" +
    money(feeOf(b)) +
    "</span></div>" +
    '<div class="sum-row total"><span>Total</span><span>' +
    money(sub + feeOf(b)) +
    "</span></div>";
  sum.classList.remove("hidden");
  btn.classList.remove("hidden");
  updateCartBadge(false);
}

$("#cartList").addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const i = Number(b.dataset.i);
  const l = state.cart[i];
  if (!l) return;
  if (b.dataset.act === "plus" && l.qty < 20) l.qty++;
  if (b.dataset.act === "minus") {
    if (l.qty > 1) l.qty--;
    else state.cart.splice(i, 1);
  }
  if (b.dataset.act === "del") state.cart.splice(i, 1);
  save("tizafood_cart", state.cart);
  renderCart();
});

$("#btnCartCheckout").addEventListener("click", () =>
  startCheckout(
    state.cart.map((l) => JSON.parse(JSON.stringify(l))),
    true,
  ),
);

/* ---------- CONFIRMAR ENTREGA (MAPA, TIEMPO, ENVÍO Y LUGAR) ---------- */

const currentCheckoutItems = (items) =>
  FoodManagement.catalogItems(items, {
    products: PRODUCTS,
    promos: PROMOS,
    extras: EXTRAS,
  });

async function startCheckout(items, fromCart) {
  await syncClientData();
  try {
    items = currentCheckoutItems(items);
  } catch (err) {
    toast(err.message);
    return;
  }
  // dest = lugar de entrega de ESTE pedido (por defecto tu dirección; se puede cambiar aquí mismo)
  state.checkout = {
    items,
    fromCart,
    deliveryNotes: "",
    couponCode: "",
    compensation: null,
    walletBalance: 0,
    useWallet: false,
    dest: { text: state.user.address, coords: null },
  };
  $("#deliveryNotes").value = "";
  await loadCheckoutWallet(state.checkout);
  $("#couponInput").value = "";
  $("#couponMessage").textContent = "";
  $("#addrMsg").textContent =
    "También puedes tocar el mapa para marcar el punto exacto.";
  $("#coAddrInput").value = state.user.address;
  assignBranch(state.checkout.dest);
  renderCheckout();
  openScreen("#checkoutScreen");
  $("#checkoutScreen .screen-body").scrollTop = 0;
  setTimeout(initCoMap, 80);
}

function checkoutPricing() {
  const totals = FoodManagement.pricing(
    state.checkout.items,
    feeOf(BRANCHES[state.branch]),
    state.checkout.couponCode,
    state.checkout.compensation,
  );
  const applied = state.checkout.useWallet
    ? Math.min(
        Math.round(totals.total * 100),
        Math.round(state.checkout.walletBalance * 100),
      ) / 100
    : 0;
  return {
    ...totals,
    walletApplied: applied,
    amountDue:
      (Math.round(totals.total * 100) - Math.round(applied * 100)) / 100,
  };
}
async function loadCheckoutWallet(checkout) {
  const account = ownerOf();
  try {
    const response = await fetch("api/support/wallet", {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }),
      data = await response.json();
    if (response.status === 401) {
      FoodSession.expire();
      throw Error("Tu sesión terminó.");
    }
    if (!response.ok)
      throw Error(data.error || "No se pudo consultar tu saldo.");
    if (state.checkout !== checkout || ownerOf() !== account) return;
    checkout.walletBalance = data.wallet.balance;
    checkout.walletError = "";
    $("#clientWalletBalance").textContent =
      "Saldo a favor: " + money(data.wallet.balance);
  } catch (error) {
    if (state.checkout === checkout) {
      checkout.walletBalance = 0;
      checkout.walletError =
        "No se pudo consultar el saldo. Puedes continuar sin aplicarlo e intentar de nuevo después.";
    }
  }
}
function walletSummaryHTML(applied, due) {
  return applied > 0
    ? '<div class="sum-row"><span>Saldo a favor aplicado</span><span>−' +
        money(applied) +
        '</span></div><div class="sum-row total"><span>Resto por pagar</span><span>' +
        money(due) +
        "</span></div>"
    : "";
}
$("#useWallet").addEventListener("change", async (event) => {
  const co = state.checkout;
  if (!co) return;
  const requested = event.target.checked;
  event.target.disabled = true;
  if (requested) await loadCheckoutWallet(co);
  if (state.checkout !== co) return;
  co.useWallet = requested && co.walletBalance > 0;
  renderCheckout();
});
$("#applyCoupon").addEventListener("click", async () => {
  if (!state.checkout) return;
  const checkout = state.checkout,
    account = ownerOf(),
    button = $("#applyCoupon");
  if (button.disabled) return;
  button.disabled = true;
  try {
    const code = $("#couponInput").value.trim().toUpperCase();
    let compensation = null;
    if (code === "ENVIOGRATIS") {
      const response = await fetch("api/coupons/eligibility", {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      const data = await response.json();
      if (response.status === 401) {
        FoodSession.expire();
        return;
      }
      if (!response.ok)
        throw Error(data.error || "No se pudo validar el cupón.");
      if (data.firstPurchase !== true)
        throw Error("ENVIOGRATIS solo está disponible en tu primera compra.");
    }
    if (code.startsWith("TIZA-R-")) {
      const response = await fetch("api/support/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        signal: AbortSignal.timeout(10000),
      });
      const data = await response.json();
      if (response.status === 401) {
        FoodSession.expire();
        return;
      }
      if (!response.ok)
        throw Error(data.error || "No se pudo validar el cupón.");
      compensation = data.benefit;
    }
    if (state.checkout !== checkout || ownerOf() !== account) return;
    const totals = FoodManagement.pricing(
      state.checkout.items,
      feeOf(BRANCHES[state.branch]),
      code,
      compensation,
    );
    if (!totals.couponCode) throw Error("Escribe un código de cupón.");
    state.checkout.couponCode = totals.couponCode;
    state.checkout.compensation = compensation;
    $("#couponInput").value = totals.couponCode;
    $("#couponMessage").textContent =
      "Cupón aplicado: ahorras " + money(totals.discount) + ".";
    renderCheckout();
  } catch (err) {
    $("#couponMessage").textContent = err.message;
  } finally {
    button.disabled = false;
  }
});
$("#couponInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $("#applyCoupon").click();
  }
});
$("#removeCoupon").addEventListener("click", () => {
  if (!state.checkout) return;
  state.checkout.couponCode = "";
  state.checkout.compensation = null;
  $("#couponInput").value = "";
  $("#couponMessage").textContent = "Cupón eliminado.";
  renderCheckout();
});
function summaryHTML(items, fee, discount = 0, couponCode = "") {
  const sub = itemsSubtotal(items);
  return (
    items
      .map(
        (l) =>
          '<div class="sum-row"><span>' +
          l.qty +
          " × " +
          esc(l.name) +
          (l.extras.length
            ? "<small>+ " +
              esc(l.extras.map((x) => x.name || x).join(", ")) +
              "</small>"
            : "") +
          "</span><span>" +
          money(lineTotal(l)) +
          "</span></div>",
      )
      .join("") +
    '<div class="sum-row"><span>Subtotal</span><span>' +
    money(sub) +
    "</span></div>" +
    '<div class="sum-row"><span>Envío</span><span>' +
    money(fee) +
    "</span></div>" +
    (discount > 0
      ? '<div class="sum-row coupon-discount"><span>Cupón ' +
        esc(couponCode) +
        "</span><span>−" +
        money(discount) +
        "</span></div>"
      : "") +
    '<div class="sum-row total"><span>Total</span><span>' +
    money(sub + fee - discount) +
    "</span></div>"
  );
}

function renderCheckout() {
  const co = state.checkout;
  if (!co) return;
  const b = BRANCHES[state.branch];
  const fee = feeOf(b);

  const assigned = FoodBranches.forAddress(co.dest, state.user);
  $("#coBranchName").textContent = assigned ? b.name : "Por asignar";
  $("#coBranchZone").textContent = assigned ? b.zone : "";
  const estimate = FoodManagement.estimate(state.checkout.items, {
    products: PRODUCTS,
    promos: PROMOS,
  });
  $("#coEta").textContent =
    estimate.totalMinutes +
    " min en total · " +
    estimate.preparationMinutes +
    " de preparación + " +
    estimate.deliveryMinutes +
    " de entrega";
  $("#coFee").textContent = money(fee);
  $("#coKm").textContent = !assigned
    ? "Pendiente de ubicar"
    : assigned.source === "postal"
      ? "Por código postal"
      : assigned.km.toFixed(1) + " km aprox.";
  $("#coAddress").textContent = co.dest.text;
  syncCoMapMarker();

  $("#coBranches").textContent = assigned
    ? "Sucursal asignada según tu punto de entrega."
    : "Marca el punto de entrega en el mapa para asignar una sucursal.";

  const bad = co.items.filter((l) => l.only && !l.only.includes(state.branch));
  const warn = $("#coWarn");
  if (bad.length) {
    warn.textContent =
      "⚠️ No disponible en " +
      b.name +
      ": " +
      bad.map((l) => l.name).join(", ") +
      ". Retira esos productos para continuar.";
    warn.classList.remove("hidden");
  } else {
    warn.classList.add("hidden");
  }

  const totals = checkoutPricing();
  $("#removeCoupon").classList.toggle("hidden", !co.couponCode);
  if (co.couponCode)
    $("#couponMessage").textContent =
      "Cupón aplicado: ahorras " + money(totals.discount) + ".";
  $("#coItems").innerHTML =
    summaryHTML(co.items, fee, totals.discount, totals.couponCode) +
    walletSummaryHTML(totals.walletApplied, totals.amountDue);
  $("#useWallet").checked = co.useWallet;
  $("#useWallet").disabled = co.walletBalance <= 0;
  $("#walletBalanceText").textContent =
    "Saldo a favor: " + money(co.walletBalance);
  $("#walletNotice").textContent =
    co.walletError ||
    "Se aplica después del cupón. Completa la diferencia en efectivo; el saldo que sobre permanece en tu cuenta.";
  const fin = $("#btnFinalize");
  fin.disabled = bad.length > 0 || !assigned;
  fin.textContent = "Finalizar pedido · " + money(checkoutPricing().amountDue);
}

const shortLabel = (t) => {
  const s = t.split(",")[0].trim();
  return s.length > 20 ? s.slice(0, 19) + "…" : s;
};
const placesOf = () =>
  [{ label: "Mi dirección", text: state.user.address, coords: null }].concat(
    state.user.places || [],
  );
const sameDest = (a, b) =>
  a.text === b.text && (a.coords || null) === (b.coords || null);

async function updateAccount(route, method, body) {
  const account = ownerOf();
  const response = await fetch("api/me" + route, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json();
  if (response.status === 401) {
    FoodSession.expire();
    throw Error("Tu sesión terminó. Vuelve a iniciar sesión.");
  }
  if (!response.ok)
    throw Error(result.error || "No se pudieron guardar tus datos.");
  if (
    ownerOf() !== account ||
    String(result.user?.email || "").toLowerCase() !== account
  )
    throw Error("La cuenta cambió. Vuelve a intentar desde tu cuenta.");
  state.user = { ...state.user, ...result.user };
  save("tizafood_user", state.user);
}
async function savePlace(pl) {
  await updateAccount("/places", "POST", pl);
  if (state.checkout) renderCoPlaces();
  renderPlacesList();
}

function renderCoPlaces() {
  const co = state.checkout;
  const box = $("#coPlaces");
  box.innerHTML = "";
  placesOf().forEach((pl) => {
    const c = document.createElement("button");
    c.type = "button";
    c.className = "chip" + (sameDest(pl, co.dest) ? " active" : "");
    c.textContent = (pl.coords ? "📍 " : "🏠 ") + pl.label;
    c.addEventListener("click", () => setDest(pl));
    box.appendChild(c);
  });
}

function setDest(d, silent) {
  state.checkout.dest = { text: d.text, coords: d.coords || null };
  assignBranch(state.checkout.dest);
  $("#coAddrInput").value = d.coords ? d.text || "" : d.text;
  $("#addrMsg").textContent = "";
  renderCoPlaces();
  renderCheckout();
  if (!silent) toast("Lugar de entrega actualizado 📍");
}

$("#btnChangeAddr").addEventListener("click", () => {
  const ed = $("#addrEditor");
  ed.scrollIntoView({ behavior: "smooth", block: "nearest" });
  const d = state.checkout.dest;
  $("#coAddrInput").value = d.text || "";
  renderCoPlaces();
  $("#coAddrInput").focus();
});

/* --- Mapa del punto de entrega --- */
const TIZAYUCA = { lat: 19.8603, lng: -98.9764 };
let coMap = null;
let coMarker = null;
let coMapBusy = false;
let addressLookupVersion = 0;

function parseCoords(str) {
  if (!str) return null;
  const p = String(str).split(",").map(Number);
  if (p.length === 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]))
    return { lat: p[0], lng: p[1] };
  return null;
}

function syncCoMapMarker() {
  if (!coMap || typeof L === "undefined") return;
  const d = state.checkout && state.checkout.dest;
  const c = d && parseCoords(d.coords);
  if (c) {
    if (coMarker) coMarker.setLatLng([c.lat, c.lng]);
    else coMarker = L.marker([c.lat, c.lng]).addTo(coMap);
    coMap.setView([c.lat, c.lng], Math.max(coMap.getZoom(), 15));
  }
}

function initCoMap() {
  if (typeof L === "undefined") return;
  const el = $("#coMap");
  if (!el) return;
  if (!coMap) {
    coMap = L.map(el, { zoomControl: true, attributionControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(coMap);
    coMap.on("click", (e) => {
      if (coMapBusy) return;
      pickMapPoint(e.latlng.lat, e.latlng.lng);
    });
  }
  const d = state.checkout && state.checkout.dest;
  const c = (d && parseCoords(d.coords)) || TIZAYUCA;
  coMap.setView([c.lat, c.lng], 14);
  if (coMarker) {
    coMarker.setLatLng([c.lat, c.lng]);
  } else {
    coMarker = L.marker([c.lat, c.lng]).addTo(coMap);
  }
  setTimeout(() => coMap.invalidateSize(), 120);
}

async function reverseGeocode(lat, lng) {
  try {
    const r = await fetch(
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
        lat +
        "&lon=" +
        lng +
        "&accept-language=es",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!r.ok) return null;
    const j = await r.json();
    return (
      (j &&
        (j.display_name ||
          (j.address && (j.address.road || j.address.suburb)))) ||
      null
    );
  } catch (e) {
    return null;
  }
}

async function pickMapPoint(lat, lng) {
  const checkout = state.checkout,
    account = ownerOf(),
    version = ++addressLookupVersion;
  if (!checkout) return;
  coMapBusy = true;
  const coords = lat.toFixed(6) + "," + lng.toFixed(6);
  if (coMarker) coMarker.setLatLng([lat, lng]);
  else if (coMap) coMarker = L.marker([lat, lng]).addTo(coMap);
  $("#addrMsg").textContent = "Buscando dirección…";
  const name = await reverseGeocode(lat, lng);
  if (
    state.checkout !== checkout ||
    ownerOf() !== account ||
    version !== addressLookupVersion
  ) {
    coMapBusy = false;
    return;
  }
  const text =
    name || "Punto en mapa (" + lat.toFixed(4) + ", " + lng.toFixed(4) + ")";
  const shouldSave = $("#coSavePlace").checked;
  setDest({ text: text, coords: coords }, true);
  if (shouldSave) {
    try {
      await savePlace({ label: shortLabel(text), text, coords });
      $("#coSavePlace").checked = false;
    } catch (error) {
      $("#addrMsg").textContent =
        "Punto de entrega actualizado, pero no se pudo guardar: " +
        error.message;
      coMapBusy = false;
      return;
    }
  }
  $("#addrMsg").textContent = shouldSave
    ? "Dirección guardada en Mis direcciones."
    : "Punto marcado en el mapa. Puedes guardar el lugar o cambiarlo.";
  toast("Punto de entrega marcado 📍");
  coMapBusy = false;
}

async function geocodeAddress(text) {
  try {
    const q = encodeURIComponent(addressQuery(text));
    const r = await fetch(
      "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" + q,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!r.ok) return null;
    const arr = await r.json();
    if (!arr || !arr[0]) return null;
    if (
      !Number.isFinite(Number(arr[0].lat)) ||
      !Number.isFinite(Number(arr[0].lon)) ||
      Math.abs(Number(arr[0].lat)) > 90 ||
      Math.abs(Number(arr[0].lon)) > 180
    )
      return null;
    return {
      lat: Number(arr[0].lat),
      lng: Number(arr[0].lon),
      label: arr[0].display_name || text,
    };
  } catch (e) {
    return null;
  }
}

async function applyTypedAddress() {
  const checkout = state.checkout,
    account = ownerOf(),
    version = ++addressLookupVersion;
  if (!checkout) return;
  const text = $("#coAddrInput").value.trim();
  const msg = $("#addrMsg");
  if (text.length < 5) {
    msg.textContent =
      "Escribe una dirección más completa (calle, número y colonia).";
    return;
  }
  msg.textContent = "Buscando en el mapa…";
  const geo = await geocodeAddress(text);
  if (
    state.checkout !== checkout ||
    ownerOf() !== account ||
    version !== addressLookupVersion
  )
    return;
  const coords = geo ? geo.lat.toFixed(6) + "," + geo.lng.toFixed(6) : null;
  const shouldSave = $("#coSavePlace").checked;
  // El mapa solo aporta coordenadas: conserva calle, número y referencias escritas.
  setDest({ text, coords });
  if (shouldSave) {
    try {
      await savePlace({ label: shortLabel(text), text, coords });
      if (state.checkout !== checkout || version !== addressLookupVersion)
        return;
      $("#coSavePlace").checked = false;
    } catch (error) {
      msg.textContent =
        "Dirección de entrega actualizada, pero no se pudo guardar: " +
        error.message;
      return;
    }
  }
  if (geo && coMap) {
    if (coMarker) coMarker.setLatLng([geo.lat, geo.lng]);
    else coMarker = L.marker([geo.lat, geo.lng]).addTo(coMap);
    coMap.setView([geo.lat, geo.lng], 16);
  }
  msg.textContent =
    (shouldSave
      ? "Dirección guardada en Mis direcciones. "
      : "Dirección de entrega actualizada. ") +
    (geo
      ? "Verifica el punto en el mapa."
      : "Conservamos el texto completo, sin coordenadas exactas.");
}
$("#coSavePlace").addEventListener("change", async () => {
  if (!$("#coSavePlace").checked || !state.checkout) return;
  const destination = { ...state.checkout.dest };
  if (
    $("#coAddrInput").value.trim() !== destination.text ||
    destination.text.length < 5
  ) {
    $("#addrMsg").textContent =
      "Pulsa Usar esta dirección para aplicar y guardar los cambios.";
    return;
  }
  try {
    await savePlace({ label: shortLabel(destination.text), ...destination });
    $("#coSavePlace").checked = false;
    $("#addrMsg").textContent = "Dirección guardada en Mis direcciones.";
  } catch (error) {
    $("#addrMsg").textContent =
      "No se pudo guardar la dirección: " + error.message;
  }
});
$("#btnUseAddr").addEventListener("click", applyTypedAddress);
$("#coAddrInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applyTypedAddress();
  }
});

$("#btnGeo").addEventListener("click", () => {
  const msg = $("#addrMsg");
  if (!navigator.geolocation) {
    msg.textContent =
      "Tu navegador no permite usar la ubicación. Escribe tu dirección o toca el mapa.";
    return;
  }
  msg.textContent = "Buscando tu ubicación…";
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude,
        lng = pos.coords.longitude;
      await pickMapPoint(lat, lng);
    },
    () => {
      msg.textContent =
        "No pudimos obtener tu ubicación. Toca el mapa o escribe tu dirección.";
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
});

$("#btnFinalize").addEventListener("click", () => {
  if (!state.checkout || $("#btnFinalize").disabled) return;
  state.checkout.deliveryNotes = $("#deliveryNotes").value.trim();
  openPay();
});

// "Sí, confirmar" -> ahora primero se pide la tarjeta
$("#btnConfirmOrder").addEventListener("click", () => {
  if (!state.checkout) return;
  if (!FoodBranches.forAddress(state.checkout.dest, state.user)) return;
  closeModal($("#confirmModal"));
  openPay();
});

/* ---------- PAGO CON TARJETA  ---------- */

const pay = { busy: false };
const digitsOf = (s) => String(s).replace(/\D/g, "");
const isAmex = (d) => /^3[47]/.test(d);
const cardLen = (d) => (isAmex(d) ? 15 : 16);

function cardBrand(d) {
  if (/^4/.test(d)) return "VISA";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return "MASTERCARD";
  if (isAmex(d)) return "AMEX";
  return "TARJETA";
}

function groupNumber(d) {
  if (isAmex(d))
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  return (d.match(/.{1,4}/g) || []).join(" ");
}
function paintCard() {
  const d = digitsOf($("#ccNumber").value);
  const len = cardLen(d);
  $("#ccShowNumber").textContent = groupNumber(
    (d + "•".repeat(len)).slice(0, len),
  );
  $("#ccBrand").textContent = cardBrand(d);
  $("#ccShowExp").textContent = $("#ccExp").value || "MM/AA";
  $("#ccShowCvv").textContent = "•".repeat(
    Math.max(3, $("#ccCvv").value.length),
  );
}

$("#ccNumber").addEventListener("input", (e) => {
  const raw = digitsOf(e.target.value);
  e.target.value = groupNumber(raw.slice(0, cardLen(raw)));
  paintCard();
});
$("#ccExp").addEventListener("input", (e) => {
  let d = digitsOf(e.target.value);
  if (d.length === 1 && Number(d) > 1) d = "0" + d;
  d = d.slice(0, 4);
  e.target.value = d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  paintCard();
});
$("#ccCvv").addEventListener("input", (e) => {
  e.target.value = digitsOf(e.target.value).slice(0, 4);
  paintCard();
});

$("#ccCvv").addEventListener("focus", () => $("#ccCard").classList.add("flip"));
["#ccNumber", "#ccExp"].forEach((s) =>
  $(s).addEventListener("focus", () => $("#ccCard").classList.remove("flip")),
);
$("#ccCvv").addEventListener("blur", () =>
  $("#ccCard").classList.remove("flip"),
);

function cardError() {
  const d = digitsOf($("#ccNumber").value);
  if (d.length !== cardLen(d))
    return "Escribe los " + cardLen(d) + " números de tu tarjeta.";
  const m = $("#ccExp").value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return "Escribe la fecha de vencimiento como MM/AA.";
  const mm = Number(m[1]),
    yy = Number(m[2]);
  if (mm < 1 || mm > 12) return "El mes debe ir del 01 al 12.";
  const now = new Date(),
    cy = now.getFullYear() % 100,
    cm = now.getMonth() + 1;
  if (yy < cy || (yy === cy && mm < cm)) return "Esa tarjeta ya venció.";
  const need = isAmex(d) ? 4 : 3;
  if (digitsOf($("#ccCvv").value).length !== need)
    return "El CVV tiene " + need + " números.";
  return "";
}

function cashPayment(amount, total) {
  const text = String(amount).trim();
  const value = Number(text);
  if (
    !/^\d+(?:\.\d{1,2})?$/.test(text) ||
    !Number.isFinite(value) ||
    value <= 0 ||
    !Number.isSafeInteger(Math.round(value * 100))
  ) {
    return { error: "Escribe una cantidad válida con hasta dos decimales." };
  }
  const cents = Math.round(value * 100),
    totalCents = Math.round(total * 100);
  if (cents < totalCents)
    return {
      error:
        "La cantidad debe cubrir el total de " + money(totalCents / 100) + ".",
    };
  return { cashAmount: cents / 100, change: (cents - totalCents) / 100 };
}
function updateCashChange() {
  if (!state.checkout) return;
  const total = checkoutPricing().amountDue;
  const amount = $("#cashAmount").value;
  const result = cashPayment(amount, total);
  $("#cashChange").textContent = !amount.trim()
    ? "Indica la cantidad para calcular tu cambio."
    : result.error || "Tu cambio será: " + money(result.change);
}
$("#cashAmount").addEventListener("input", () => {
  $("#payError").textContent = "";
  updateCashChange();
});
function transferConfigured() {
  return !!(
    transferConfig.bank &&
    transferConfig.holder &&
    (transferConfig.demo === true || /^\d{18}$/.test(transferConfig.clabe))
  );
}
function transferReference(value) {
  const reference = String(value || "").trim();
  return reference.length >= 3 &&
    reference.length <= 100 &&
    !/[\u0000-\u001f\u007f]/.test(reference)
    ? reference
    : "";
}
function updatePaymentMethod() {
  const method = $("#paymentMethod").value;
  $$("[data-payment]").forEach((button) => {
    const selected = button.dataset.payment === method;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  $("#payForm").classList.toggle("hidden", !method);
  $("#payError").textContent = "";
  $("#transferFields").classList.toggle("hidden", method !== "Transferencia");
  const configured = transferConfigured();
  $("#transferDetails").textContent = configured
    ? (transferConfig.demo ? "Datos de prueba.\n" : "") +
      "Banco: " +
      transferConfig.bank +
      "\nTitular: " +
      transferConfig.holder +
      (transferConfig.demo ? "\nNúmero ficticio: " : "\nCLABE: ") +
      transferConfig.clabe
    : "Datos bancarios pendientes de configurar. Contacta a la sucursal antes de transferir.";
  $("#transferReference").disabled = !configured;
  $("#transferReference").placeholder = transferConfig.demo
    ? "Ej. PRUEBA-001"
    : "Referencia de tu transferencia";
  $("#btnPay").disabled = method === "Transferencia" && !configured;
  $("#cashFields").classList.toggle("hidden", method !== "Efectivo");
  if (method === "Efectivo") updateCashChange();
  $("#cardFields").classList.toggle("hidden", method !== "Tarjeta");
  $("#cardInputs").classList.toggle("hidden", method !== "Tarjeta");
  $("#payForm .demo-note").classList.toggle("hidden", method !== "Tarjeta");
  $("#paymentNotice").classList.toggle(
    "hidden",
    !method || method === "Tarjeta",
  );
  $("#paymentNotice").textContent =
    method === "Efectivo"
      ? "Paga en efectivo al recibir tu pedido."
      : "Registra tu referencia de pago para continuar.";
  $("#btnPay").textContent = "Revisar pedido";
}
$$("[data-payment]").forEach((button) =>
  button.addEventListener("click", () => {
    if (pay.busy) return;
    $("#paymentMethod").value = button.dataset.payment;
    updatePaymentMethod();
  }),
);
function openPay() {
  const co = state.checkout;
  if (!co) return;
  const totals = checkoutPricing(),
    total = totals.amountDue;
  if (totals.walletApplied > 0 && total === 0) {
    showOrderReview({ method: "Saldo a favor", status: "Cubierto con saldo" });
    return;
  }
  $$("[data-payment]").forEach((button) => {
    button.disabled =
      totals.walletApplied > 0 && button.dataset.payment !== "Efectivo";
  });
  ["#ccNumber", "#ccExp", "#ccCvv"].forEach((s) => {
    $(s).value = "";
  });
  $("#payError").textContent = "";
  $("#payTotal").textContent = money(total);
  $("#btnPay").textContent = "Revisar pedido";
  $("#ccCard").classList.remove("flip", "shake");
  $("#payOverlay").className = "pay-overlay";
  paintCard();
  $("#transferReference").value = "";
  $("#cashAmount").value = "";
  $("#cashChange").textContent = "";
  $("#paymentMethod").value = "";
  if (totals.walletApplied > 0) $("#paymentMethod").value = "Efectivo";
  updatePaymentMethod();
  openModal("#payModal");
  setTimeout(() => {
    if ($("#payModal").classList.contains("open")) $("[data-payment]").focus();
  }, 350);
}

$("#payForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (pay.busy) return;
  const opening = FoodHours.status(restaurantHours);
  if (!opening.open) {
    $("#payError").textContent = opening.text;
    renderRestaurantHours();
    return;
  }
  const method = $("#paymentMethod").value;
  if (!["Tarjeta", "Efectivo", "Transferencia"].includes(method)) return;
  if (method !== "Tarjeta") {
    if (!state.checkout) return;
    const payment = {
      method,
      status:
        method === "Efectivo"
          ? "Pendiente de cobro"
          : "Pendiente de verificación",
    };
    if (method === "Efectivo") {
      const total = checkoutPricing().amountDue;
      const result = cashPayment($("#cashAmount").value, total);
      if (result.error) {
        $("#payError").textContent = result.error;
        $("#cashAmount").focus();
        return;
      }
      Object.assign(payment, result);
    }
    if (method === "Transferencia") {
      if (!transferConfigured()) {
        $("#payError").textContent =
          "La sucursal aún no configuró sus datos bancarios.";
        return;
      }
      const reference = transferReference($("#transferReference").value);
      if (!reference) {
        $("#payError").textContent =
          "Escribe una referencia válida de 3 a 100 caracteres.";
        $("#transferReference").focus();
        return;
      }
      payment.reference = reference;
      payment.demo = transferConfig.demo === true;
    }
    closeModal($("#payModal"));
    showOrderReview(payment);
    return;
  }
  const err = cardError();
  if (err) {
    $("#payError").textContent = err;
    const c = $("#ccCard");
    c.classList.remove("flip", "shake");
    void c.offsetWidth;
    c.classList.add("shake");
    return;
  }
  $("#payError").textContent = "";

  const d = digitsOf($("#ccNumber").value);
  const payment = {
    method: "Tarjeta",
    brand: cardBrand(d),
    last4: d.slice(-4),
  };
  ["#ccNumber", "#ccExp", "#ccCvv"].forEach((s) => {
    $(s).value = "";
  });

  closeModal($("#payModal"));
  showOrderReview(payment);
});

async function completeOrder(payment) {
  const co = state.checkout;
  if (!co) return;
  const b = BRANCHES[state.branch];
  const fee = feeOf(b);
  const subtotal = itemsSubtotal(co.items);
  const totals = checkoutPricing();

  const order = {
    folio: (co.folio ||=
      "TF-" +
      Date.now() +
      String(crypto.getRandomValues(new Uint32Array(1))[0]).padStart(10, "0")),
    ts: Date.now(),
    date: new Date().toLocaleString("es-MX"),
    items: co.items,
    subtotal: subtotal,
    fee: fee,
    total: totals.total,
    discount: totals.discount,
    couponCode: totals.couponCode,
    useWallet: co.useWallet,
    expectedWalletApplied: totals.walletApplied,
    branch: b.name,
    branchIdx: state.branch,
    etaMin: FoodManagement.estimate(co.items, {
      products: PRODUCTS,
      promos: PROMOS,
    }).totalMinutes,
    address: co.dest.text,
    coords: co.dest.coords,
    deliveryNotes: co.deliveryNotes || "",
    payment: payment,
    status: "Recibido",
    managed: true,
  };

  if (dbSource === "api") {
    if (pay.busy) return;
    pay.busy = true;
    try {
      const response = await fetch("api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, expectedTotal: totals.total }),
      });
      const result = await response.json();
      if (!response.ok && result.code === "COUPON_FIRST_PURCHASE_ONLY") {
        co.couponCode = "";
        co.compensation = null;
        $("#couponInput").value = "";
        $("#couponMessage").textContent = result.error;
      }
      if (!response.ok && result.code === "ORDER_PRICE_CHANGED") {
        await syncClientData();
        co.items = currentCheckoutItems(co.items);
      }
      if (!response.ok)
        throw Error(result.error || "No se pudo guardar el pedido.");
      if (result.order) Object.assign(order, result.order);
      if (Number.isFinite(order.walletBalanceAfter))
        $("#clientWalletBalance").textContent =
          "Saldo a favor: " + money(order.walletBalanceAfter);
    } catch (err) {
      toast(err.message);
      await loadCheckoutWallet(co);
      if (!co.walletBalance) co.useWallet = false;
      renderCheckout();
      openPay();
      return;
    } finally {
      pay.busy = false;
    }
  }
  state.orders.unshift(order);
  save("tizafood_orders", state.orders);

  if (co.fromCart) {
    state.cart = [];
    save("tizafood_cart", state.cart);
    renderCart();
  }
  state.checkout = null;

  closeScreen($("#checkoutScreen"));
  openTracking(order.folio);
  Sound.play("pay");
  toast(
    order.receiptStatus === "pending"
      ? "¡Gracias por tu compra! Tu ticket quedó programado para enviarse por correo."
      : "¡Gracias por tu compra! Tu ticket está en Mis pedidos.",
  );
}

/* ---------- SEGUIMIENTO DEL PEDIDO ---------- */

let trackTimer = null;
let trackFolio = null;

function orderItems(o) {
  if (o.items) return o.items;
  return [
    {
      name: o.product,
      qty: o.qty || 1,
      base: o.unit || 0,
      extras: (o.extras || []).map((x) =>
        typeof x === "string" ? { name: x, price: 0 } : x,
      ),
    },
  ];
}

function stageOf(o) {
  if (o.cancelled || o.status === "Cancelado") return -1;
  const staffIdx = FoodManagement.customerStage(o);
  // Avance automático por tiempo (demo escolar). Si el personal ya avanzó más, se respeta su estado.
  let timeIdx = 3;
  if (o.ts) {
    const elapsed = (Date.now() - o.ts) / 1000;
    const scale = DEMO_SEGUNDOS ? 1 : ((o.etaMin || 25) * 60) / STAGES[3].at;
    timeIdx = 0;
    STAGES.forEach((s, k) => {
      if (elapsed >= s.at * scale) timeIdx = k;
    });
  }
  if (o.managed || dbSource === "api") {
    if (staffIdx < 0) return timeIdx;
    return staffIdx;
  }
  return timeIdx;
}

function progressOf(o) {
  const idx = stageOf(o);
  if (idx < 0) return 0;
  if (idx >= 3) return 100;
  if (FoodManagement.statusOf(o) === "Listo para enviar") return 60;
  if (o.trackingMode === "dispatch" && idx === 2) {
    const duration = o.deliveryDueAt - o.dispatchedAt;
    return duration > 0
      ? 75 +
          24 *
            Math.max(0, Math.min(1, (Date.now() - o.dispatchedAt) / duration))
      : 75;
  }
  if (
    (o.managed || dbSource === "api") &&
    !FoodManagement.usesDemoTracking(o, trackingConfig.demo)
  )
    return (idx + 1) * 25;
  const scale = DEMO_SEGUNDOS ? 1 : ((o.etaMin || 25) * 60) / STAGES[3].at;
  const elapsed = (Date.now() - (o.ts || 0)) / 1000;
  const a = STAGES[idx].at * scale,
    z = STAGES[idx + 1].at * scale;
  if (z <= a) return (idx / 3) * 100;
  return Math.min(
    100,
    ((idx + Math.max(0, Math.min(1, (elapsed - a) / (z - a)))) / 3) * 100,
  );
}

const canCancel = (o) => {
  return ["Recibido", "En preparación"].includes(FoodManagement.statusOf(o));
};
const clock = (ms) =>
  new Date(ms).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
const findOrder = (folio) => state.orders.find((o) => o.folio === folio);

function driverOf(o) {
  let n = 0;
  for (const ch of o.folio) n += ch.charCodeAt(0);
  return DRIVERS[n % DRIVERS.length];
}

function openTracking(folio) {
  syncClientData();
  const o = findOrder(folio);
  if (!o) return;
  trackFolio = folio;
  const b = FoodBranches.forOrder(o);
  const fee = o.fee || 0;

  $("#trackBody").innerHTML =
    '<div class="track-hero">' +
    '<div id="trEmoji" class="track-emoji track-emoji-wrap">' +
    stageHeroArt(STAGES[0].art) +
    "</div>" +
    '<div id="trStatus" class="track-status"></div>' +
    '<div id="trSub" class="track-sub"></div>' +
    '<div class="progress"><div id="trBar" class="progress-bar"></div></div>' +
    "</div>" +
    '<div id="trDeliveryCode" class="delivery-code-card hidden" aria-live="polite"></div>' +
    '<div class="timeline" id="trTimeline">' +
    STAGES.map(
      (s, k) =>
        '<div class="tl-step" data-k="' +
        k +
        '"><span class="tl-icon tl-art" data-art="' +
        s.art +
        '">' +
        stageArt(s.art) +
        "</span>" +
        "<div><strong>" +
        s.name +
        "</strong><small>" +
        s.sub +
        ' · <span class="tl-time">' +
        clock((o.ts || Date.now()) + (o.etaMin || 25) * 60000 * s.frac) +
        "</span></small></div></div>",
    ).join("") +
    "</div>" +
    '<h3 class="sub-title">Tu repartidor</h3>' +
    '<p id="trMapStatus" class="muted" role="status"></p><div id="trMapContainer" class="map-box hidden"><iframe id="trMap" title="Ubicación del repartidor cerca de tu entrega" loading="lazy" referrerpolicy="no-referrer"></iframe></div>' +
    '<div class="driver-card"><span class="avatar">🛵</span><div><strong>' +
    esc(driverOf(o)) +
    "</strong>" +
    '<small class="muted">Sale de ' +
    esc(o.branch) +
    " · " +
    esc(o.address) +
    "</small></div></div>" +
    '<h3 class="sub-title">Detalle del pedido · ' +
    esc(o.folio) +
    "</h3>" +
    '<div class="summary">' +
    summaryHTML(orderItems(o), fee, o.discount || 0, o.couponCode || "") +
    walletSummaryHTML(o.walletApplied || 0, o.amountDue ?? o.total) +
    "</div>" +
    '<div id="trRateBox" class="track-rate-box hidden"></div>' +
    '<div class="track-actions">' +
    '<button id="trTicket" class="btn btn-ghost"> Ver ticket</button>' +
    '<button id="trCancel" class="btn btn-danger">Cancelar pedido</button>' +
    '<button id="trHome" class="btn btn-main">Volver al inicio</button>' +
    "</div>" +
    (o.managed || dbSource === "api"
      ? '<p id="trModeNote" class="demo-note"></p>'
      : "");

  $("#trTicket").addEventListener("click", () => showTicket(o));
  $("#trCancel").addEventListener("click", () => cancelarPedido(o.folio));
  $("#trHome").addEventListener("click", () => {
    closeScreen($("#trackScreen"));
    closeScreen($("#accountScreen"));
    showView("home");
  });

  updateTracking();
  openScreen("#trackScreen");
  clearInterval(trackTimer);
  trackTimer = setInterval(updateTracking, 1000);
}

function updateTracking() {
  const o = findOrder(trackFolio);
  if (!o || !$("#trStatus")) return;
  const idx = stageOf(o);
  const automatic = FoodManagement.usesDemoTracking(o, trackingConfig.demo);
  updateDeliveryMap(o);
  renderDeliveryCode(o);
  const modeNote = $("#trModeNote");
  if (modeNote)
    modeNote.textContent =
      idx < 0
        ? "Pedido cancelado. El seguimiento se detuvo."
        : automatic
          ? "El estado de tu pedido se actualiza automáticamente."
          : "El restaurante actualiza el estado de tu pedido. Este seguimiento se refresca automáticamente.";

  if (idx < 0) {
    const heroX = $("#trEmoji");
    if (heroX) {
      heroX.classList.add("track-emoji-wrap");
      heroX.innerHTML =
        '<span class="track-cancel-badge" aria-hidden="true">❌</span>';
    }
    $("#trStatus").textContent = "Pedido cancelado";
    const fee = o.cancelFee != null ? o.cancelFee : cancelFeeOf(o.total);
    const refund =
      o.refund != null
        ? o.refund
        : Math.round((Number(o.total) - fee) * 100) / 100;
    $("#trSub").textContent =
      "Cargo por cancelación 20%: " +
      money(fee) +
      " · Reembolso: " +
      money(refund);
    if (o.walletApplied > 0)
      $("#trSub").textContent =
        "Cargo por cancelación: " +
        money(fee) +
        " · Saldo restituido: " +
        money(o.walletRestored || 0) +
        (o.cashCancellationFeeDue > 0
          ? " · Cargo pendiente en efectivo: " + money(o.cashCancellationFeeDue)
          : "");
    $("#trBar").style.width = "0%";
  } else {
    const hero = $("#trEmoji");
    if (hero) {
      hero.classList.add("track-emoji-wrap");
      hero.innerHTML = stageHeroArt(STAGES[idx].art);
    }
    const riderArrived = idx === 2 && o.handoff?.riderArrived;
    $("#trStatus").textContent = riderArrived
      ? "Tu repartidor ya llegó"
      : FoodManagement.statusOf(o) === "Listo para enviar"
        ? "Listo para enviar"
        : STAGES[idx].name;
    $("#trSub").textContent = riderArrived
      ? "El repartidor está afuera. Dale tu código cuando recibas la comida."
      : FoodManagement.statusOf(o) === "Listo para enviar"
        ? "Tu comida está lista; esperamos la salida del repartidor."
        : o.handoff?.required && idx === 2
          ? "Pedido en reparto. Comparte tu código únicamente cuando recibas la comida."
          : o.trackingMode === "gps" && idx === 2
            ? "Tu pedido está en reparto. El mapa se activará cuando esté cerca de tu dirección."
            : o.trackingMode === "dispatch" && idx === 2
              ? "Tu pedido ya salió de la tienda · entrega estimada en " +
                Math.max(1, Math.ceil((o.deliveryDueAt - Date.now()) / 60000)) +
                " min"
              : automatic
                ? STAGES[idx].sub
                : idx === 3
                  ? STAGES[3].sub
                  : STAGES[idx].sub;
    $("#trBar").style.width = progressOf(o) + "%";
  }

  $$("#trTimeline .tl-step").forEach((el) => {
    const k = Number(el.dataset.k);
    el.classList.toggle("done", idx > k);
    el.classList.toggle("active", idx === k);
  });

  if (
    idx === 3 &&
    window.TizaOrderChat &&
    typeof window.TizaOrderChat.notifyDelivered === "function"
  ) {
    try {
      window.TizaOrderChat.notifyDelivered(o);
    } catch (e) {
      /* */
    }
  }
  $$("#trTimeline .tl-time").forEach((el, k) => {
    const name = ["Recibido", "En preparación", "En camino", "Entregado"][k];
    const event = (o.statusHistory || []).find((e) => e.status === name);
    if (event) {
      el.textContent = clock(event.at);
    } else if (k < idx) {
      el.textContent = "Completado";
    } else if (k === idx) {
      el.textContent = clock(Date.now());
    } else {
      el.textContent = automatic
        ? "Estimado · " + clock((o.ts || Date.now()) + STAGES[k].at * 1000)
        : "Pendiente";
    }
  });

  const rateBox = $("#trRateBox");
  if (rateBox) {
    if (idx === 3 && !o.deliveryRating) {
      rateBox.classList.remove("hidden");
      if (!rateBox.querySelector("#trRateSend")) {
        rateBox.dataset.folio = o.folio;
        rateBox.dataset.stars = "0";
        rateBox.innerHTML =
          '<h3 class="sub-title">Calificación del repartidor / pedido</h3>' +
          '<p class="muted">Tu opinión ayuda a mejorar la entrega y el servicio.</p>' +
          '<div class="track-rate-card">' +
          "<p><strong>¿Cómo llegó el producto y el repartidor?</strong></p>" +
          '<div class="delivery-stars track-rate-stars" role="group" aria-label="Estrellas">' +
          [1, 2, 3, 4, 5]
            .map(
              (n) =>
                '<button type="button" class="track-star" data-stars="' +
                n +
                '" aria-label="' +
                n +
                ' estrellas">★</button>',
            )
            .join("") +
          "</div>" +
          '<label for="trRateComment">Tu comentario</label>' +
          '<textarea id="trRateComment" maxlength="300" placeholder="Cuéntanos cómo llegó el producto, el empaque y la atención del repartidor..."></textarea>' +
          '<p id="trRateError" class="error" role="alert"></p>' +
          '<button type="button" id="trRateSend" class="btn btn-main wide">Publicar calificación</button>' +
          "</div>";
        rateBox.querySelectorAll(".track-star").forEach((btn) => {
          btn.addEventListener("click", () => {
            const pick = Number(btn.dataset.stars);
            rateBox.dataset.stars = String(pick);
            rateBox
              .querySelectorAll(".track-star")
              .forEach((b) =>
                b.classList.toggle("on", Number(b.dataset.stars) <= pick),
              );
            const e = $("#trRateError");
            if (e) e.textContent = "";
          });
        });
        $("#trRateSend").addEventListener("click", () => {
          const folio = rateBox.dataset.folio || o.folio;
          const stars = Number(rateBox.dataset.stars || 0);
          submitTrackDeliveryRating(folio, stars);
        });
        $("#trRateComment").addEventListener("input", () => {
          const result = window.FoodReviewModeration.check(
            $("#trRateComment").value,
          );
          $("#trRateComment").setAttribute(
            "aria-invalid",
            String(!result.allowed),
          );
          $("#trRateError").textContent = result.message;
          $("#trRateSend").disabled =
            !result.allowed || $("#trRateSend").dataset.submitting === "true";
        });
      }
    } else if (idx === 3 && o.deliveryRating) {
      rateBox.classList.remove("hidden");
      if (!rateBox.querySelector(".track-rate-thanks")) {
        rateBox.innerHTML =
          '<div class="track-rate-thanks">' +
          '<div class="track-rate-thanks-icon">💚</div>' +
          "<strong>¡Gracias por tu calificación!</strong>" +
          "<p>Agradecemos tu opinión. Intentamos mejorar y haremos lo mejor para mejorar tu experiencia.</p>" +
          '<p class="muted">Tu calificación: ' +
          o.deliveryRating.stars +
          " de 5 ★" +
          (o.deliveryRating.comment
            ? ' · "' + esc(o.deliveryRating.comment) + '"'
            : "") +
          "</p>" +
          "</div>";
      }
    } else {
      if (rateBox.innerHTML) rateBox.innerHTML = "";
      rateBox.classList.add("hidden");
    }
  }
  $("#trCancel").classList.toggle("hidden", !canCancel(o));
  if (idx === 3 || idx < 0) {
    clearInterval(trackTimer);
    trackTimer = null;
  }
}

function renderDeliveryCode(order) {
  const box = $("#trDeliveryCode");
  if (!box) return;
  const code = order.handoff?.deliveryCode;
  const visible =
    FoodManagement.statusOf(order) === "En camino" &&
    /^\d{4}$/.test(code || "");
  box.classList.toggle("hidden", !visible);
  if (!visible) {
    box.replaceChildren();
    return;
  }
  box.innerHTML =
    '<h3>Tu código de entrega</h3><strong class="handoff-code">' +
    esc(code) +
    "</strong><p>Díselo al repartidor únicamente cuando recibas tu comida. Con él se confirma la entrega de este pedido.</p>";
}

function updateDeliveryMap(order) {
  const container = $("#trMapContainer"),
    frame = $("#trMap"),
    message = $("#trMapStatus");
  if (!container || !frame || !message) return;
  const status = FoodManagement.statusOf(order),
    delivery = order.delivery;
  const visible =
    status === "En camino" &&
    delivery?.fresh &&
    delivery?.mapUnlocked &&
    delivery?.location;
  container.classList.toggle("hidden", !visible);
  if (!visible) {
    if (frame.dataset.url) {
      frame.src = "about:blank";
      delete frame.dataset.url;
    }
    message.textContent =
      status === "Entregado"
        ? "Entrega completada. La ubicación del repartidor dejó de compartirse."
        : status === "Cancelado"
          ? "El seguimiento del pedido se detuvo."
          : delivery?.mapUnlocked && !delivery?.fresh
            ? "La señal del repartidor no está disponible. Esperamos una nueva ubicación."
            : "El mapa se activará cuando el repartidor comparta su ubicación y esté a unos 300 metros del punto de entrega.";
    return;
  }
  const source = delivery.location.lat + "," + delivery.location.lng;
  const url =
    "https://maps.google.com/maps?saddr=" +
    enc(source) +
    "&daddr=" +
    enc(order.coords || addressQuery(order.address)) +
    "&output=embed";
  if (
    !frame.dataset.url ||
    Date.now() - Number(frame.dataset.updatedAt || 0) > 15000
  ) {
    setFrame(frame, url);
    frame.dataset.updatedAt = Date.now();
  }
  message.textContent =
    "Ubicación del repartidor · actualizada a las " +
    clock(delivery.location.at) +
    ". La precisión depende de la señal GPS.";
}

function stopTracking() {
  clearInterval(trackTimer);
  trackTimer = null;
}

/* ---------- CANCELAR PEDIDO ---------- */

const CANCEL_FEE_RATE = 0.2;

function cancelFeeOf(total) {
  return Math.round(Number(total) * CANCEL_FEE_RATE * 100) / 100;
}

async function cancelarPedido(folio) {
  const pedido = findOrder(folio);
  if (!pedido || !canCancel(pedido)) {
    toast("Este pedido ya no se puede cancelar");
    return;
  }
  const fee = cancelFeeOf(pedido.total);
  const refund = Math.round((Number(pedido.total) - fee) * 100) / 100;
  const msg =
    "¿Cancelar el pedido " +
    folio +
    "?\n\n" +
    "Política de cancelación:\n" +
    "• Cargo por cancelación (20%): " +
    money(fee) +
    "\n" +
    "• Reembolso que recibes (80%): " +
    money(refund) +
    "\n\n" +
    "El 20% cubre la preparación y pérdida del negocio." +
    (pedido.walletApplied > 0
      ? "\n\nDel saldo usado se descuenta primero ese cargo. Volverán a tu saldo " +
        money(Math.max(0, pedido.walletApplied - fee)) +
        "."
      : "");
  if (!confirm(msg)) return;
  if (dbSource === "api") {
    try {
      const response = await fetch("api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folio: pedido.folio,
          cancelled: true,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      if (result.order) Object.assign(pedido, result.order);
    } catch (err) {
      toast(err.message);
      await syncClientData();
      return;
    }
  }
  pedido.cancelled = true;
  pedido.status = "Cancelado";
  pedido.cancelFee = fee;
  pedido.refund = refund;
  pedido.cancelledAt = new Date().toISOString();
  save("tizafood_orders", state.orders);

  toast(
    pedido.walletApplied > 0
      ? "Cancelado · Saldo restituido: " + money(pedido.walletRestored || 0)
      : "Cancelado · cargo 20% " + money(fee) + " · reembolso " + money(refund),
  );
  renderOrders();
  if (trackFolio === folio) {
    updateTracking();
  }
}

/* ---------- TICKET ---------- */

function showTicket(o) {
  const rows = orderItems(o)
    .map(
      (l) =>
        '<div class="t-row"><span>' +
        l.qty +
        " x " +
        esc(l.name) +
        "</span><span>" +
        money(lineTotal(l)) +
        "</span></div>" +
        (l.extras.length
          ? '<p class="center" style="text-align:left">+ ' +
            esc(l.extras.map((x) => x.name || x).join(", ")) +
            "</p>"
          : ""),
    )
    .join("");

  $("#ticket").innerHTML =
    "<h4>Tiza Food</h4>" +
    '<p class="center">Tizayuca, Hidalgo</p>' +
    "<hr>" +
    '<div class="t-row"><span>Folio</span><span>' +
    esc(o.folio) +
    "</span></div>" +
    '<div class="t-row"><span>Fecha</span><span>' +
    esc(o.date) +
    "</span></div>" +
    '<div class="t-row"><span>Cliente</span><span>' +
    esc(state.user.name) +
    "</span></div>" +
    '<div class="t-row"><span>Sucursal</span><span>' +
    esc(o.branch) +
    "</span></div>" +
    "<hr>" +
    rows +
    "<hr>" +
    '<div class="t-row"><span>Subtotal</span><span>' +
    money(o.subtotal) +
    "</span></div>" +
    '<div class="t-row"><span>Envío</span><span>' +
    money(o.fee) +
    "</span></div>" +
    (o.discount > 0
      ? '<div class="t-row"><span>Cupón ' +
        esc(o.couponCode) +
        "</span><span>−" +
        money(o.discount) +
        "</span></div>"
      : "") +
    '<div class="t-row total"><span>TOTAL</span><span>' +
    money(o.total) +
    "</span></div>" +
    (o.walletApplied > 0
      ? '<div class="t-row"><span>Saldo a favor aplicado</span><span>−' +
        money(o.walletApplied) +
        '</span></div><div class="t-row"><span>Resto por pagar</span><span>' +
        money(o.amountDue) +
        "</span></div>"
      : "") +
    (o.cancelled || o.status === "Cancelado"
      ? '<div class="t-row"><span>Cargo cancelación (20%)</span><span>' +
        money(o.cancelFee != null ? o.cancelFee : cancelFeeOf(o.total)) +
        "</span></div>" +
        '<div class="t-row total"><span>' +
        (o.walletApplied > 0 ? "IMPORTE TRAS CARGO (80%)" : "REEMBOLSO (80%)") +
        "</span><span>" +
        money(
          o.refund != null
            ? o.refund
            : Math.round((o.total - cancelFeeOf(o.total)) * 100) / 100,
        ) +
        "</span></div>"
      : "") +
    (o.payment
      ? '<div class="t-row"><span>Pago</span><span>' +
        (o.payment.method === "Tarjeta"
          ? esc(o.payment.brand) + " •••• " + esc(o.payment.last4)
          : esc(o.payment.method) +
            " · " +
            esc(
              String(o.payment.status || "Pendiente")
                .replace(/\s+simulad[oa]/gi, "")
                .replace(/\s+virtual/gi, ""),
            )) +
        "</span></div>"
      : "") +
    (o.payment && o.payment.method === "Transferencia" && o.payment.demo
      ? '<p class="center">Datos de prueba.</p>'
      : "") +
    (o.payment && o.payment.method === "Transferencia" && o.payment.reference
      ? '<div class="t-row"><span>Referencia</span><span style="overflow-wrap:anywhere;min-width:0;text-align:right">' +
        esc(o.payment.reference) +
        "</span></div>"
      : "") +
    (o.payment &&
    o.payment.method === "Efectivo" &&
    Number.isFinite(o.payment.cashAmount) &&
    Number.isFinite(o.payment.change)
      ? '<div class="t-row"><span>Paga con</span><span>' +
        money(o.payment.cashAmount) +
        '</span></div><div class="t-row"><span>Cambio</span><span>' +
        money(o.payment.change) +
        "</span></div>"
      : "") +
    "<hr>" +
    '<p class="center">Entrega en:<br>' +
    esc(o.address) +
    "</p>" +
    (o.deliveryNotes
      ? "<p>Instrucciones: " + esc(o.deliveryNotes) + "</p>"
      : "") +
    '<p class="t-thanks">' +
    (o.cancelled || o.status === "Cancelado"
      ? "Pedido cancelado · cargo del 20% aplicado"
      : "¡Gracias por tu compra!") +
    "</p>";
  openModal("#ticketModal");
}

$("#btnPrint").addEventListener("click", () => {
  const contenido = $("#ticket").innerHTML;
  if (!contenido.trim()) {
    toast("Primero abre el ticket de un pedido.");
    return;
  }
  const folio = (
    ($("#ticket .t-row span:last-child") || {}).textContent || "ticket"
  )
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "");
  const printWindow = window.open("", "_blank", "width=520,height=760");
  if (!printWindow) {
    toast("Permite la ventana emergente del ticket para guardarlo como PDF.");
    return;
  }
  const html =
    '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>ticket-tizafood-' +
    esc(folio) +
    "</title><style>" +
    "@page{size:A4 portrait;margin:14mm}*{box-sizing:border-box}body{font-family:Courier New,monospace;color:#1f1a17;background:#fff;margin:0;padding:20px}.wrap{max-width:360px;margin:20px auto;overflow-wrap:anywhere}.t-row{display:flex;justify-content:space-between;gap:12px;padding:3px 0;break-inside:avoid}.t-row span:last-child{text-align:right;min-width:0}.t-row.total{font-weight:bold;font-size:1.1rem;margin-top:4px}hr{border:none;border-top:2px dashed #bbb;margin:12px 0}.center{text-align:center;color:#6b625c;font-size:.85rem}.t-thanks{text-align:center;margin-top:12px;font-weight:bold}h4{text-align:center;font-size:1.3rem;margin:0 0 4px}.pdf-tools{font-family:Arial,sans-serif;max-width:420px;margin:0 auto 24px;padding:14px;background:#fff5e6;border-radius:12px;line-height:1.5}.pdf-tools button{padding:10px 16px;background:#d62828;color:white;border:0;border-radius:8px;cursor:pointer}@media print{.pdf-tools{display:none!important}body{padding:0}.wrap{margin:0 auto}}" +
    '</style></head><body><div class="pdf-tools"><p>En Destino elige <strong>Guardar como PDF</strong> y pulsa Guardar.</p><button id="savePdfAgain" type="button">Guardar como PDF / imprimir</button></div><div class="wrap">' +
    contenido +
    "</div></body></html>";
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  const printTicket = () => {
    if (printWindow.closed) return;
    printWindow.focus();
    printWindow.print();
  };
  printWindow.document
    .getElementById("savePdfAgain")
    .addEventListener("click", printTicket);
  printWindow.setTimeout(printTicket, 300);
});

/* ---------- MI CUENTA ---------- */

function setAvatar(el) {
  const u = state.user;
  if (u.photo) {
    el.style.backgroundImage = "url(" + u.photo + ")";
    el.textContent = "";
  } else {
    el.style.backgroundImage = "";
    el.textContent = u.name.trim().charAt(0).toUpperCase();
  }
}

function renderUserChip() {
  $("#helloName").textContent = state.user.name.split(" ")[0];
  setAvatar($("#topAvatar"));
}

function orderStatusText(o) {
  const s = stageOf(o);
  if (FoodManagement.statusOf(o) === "Listo para enviar")
    return "Listo para enviar";
  return s < 0 ? "Cancelado" : STAGES[s].name;
}

function renderOrders() {
  const box = $("#ordersList");
  box.innerHTML = "";

  if (state.orders.length === 0) {
    box.innerHTML =
      '<div class="empty">Aún no has hecho pedidos. ¡Anímate a probar algo! </div>';
  } else {
    state.orders.forEach((o, i) => {
      const s = stageOf(o);
      const cls = s < 0 ? "cancel" : s === 3 ? "" : "work";
      const items = orderItems(o)
        .map((l) => l.qty + " × " + l.name)
        .join(", ");
      const d = document.createElement("div");
      d.className = "order";
      d.style.animationDelay = i * 0.05 + "s";
      d.innerHTML =
        '<div class="order-top"><span>' +
        esc(o.folio) +
        '</span><span class="status-pill ' +
        cls +
        '">' +
        esc(orderStatusText(o)) +
        "</span></div>" +
        "<small>" +
        esc(items) +
        "</small>" +
        "<small>" +
        esc(o.date) +
        " · <strong>" +
        money(o.total) +
        "</strong>" +
        (o.cancelled || o.status === "Cancelado"
          ? " · cargo 20% " +
            money(o.cancelFee != null ? o.cancelFee : cancelFeeOf(o.total)) +
            " · reembolso " +
            money(
              o.refund != null
                ? o.refund
                : Math.round((o.total - cancelFeeOf(o.total)) * 100) / 100,
            )
          : "") +
        "</small>" +
        (o.deliveryRating
          ? "<small>Tu calificación: " +
            o.deliveryRating.stars +
            " de 5 ★" +
            (o.deliveryRating.comment
              ? " · " + esc(o.deliveryRating.comment)
              : "") +
            "</small>"
          : "") +
        '<div class="order-actions">' +
        '<button class="btn btn-ghost" data-track="' +
        esc(o.folio) +
        '">📍 Seguimiento</button>' +
        (FoodManagement.statusOf(o) === "Entregado" && !o.deliveryRating
          ? '<button class="btn btn-main" data-rate-delivery="' +
            esc(o.folio) +
            '">Calificar entrega</button>'
          : "") +
        (reviewableProducts().some((p) => p.orderFolios.includes(o.folio))
          ? '<button class="btn btn-main" data-review-products="' +
            esc(o.folio) +
            '">Reseñar productos</button>'
          : "") +
        (canCancel(o)
          ? '<button class="btn btn-danger" data-cancel="' +
            esc(o.folio) +
            '">Cancelar</button>'
          : "") +
        "</div>";
      box.appendChild(d);
    });
  }
  $("#uStats").textContent =
    state.orders.length + (state.orders.length === 1 ? " pedido" : " pedidos");
}

$("#ordersList").addEventListener("click", (e) => {
  const productReview = e.target.closest("[data-review-products]");
  if (productReview) {
    openReviewModal(null, productReview.dataset.reviewProducts);
    return;
  }
  const rating = e.target.closest("[data-rate-delivery]");
  if (rating) {
    openDeliveryRating(rating.dataset.rateDelivery);
    return;
  }
  const t = e.target.closest("[data-track]");
  if (t) {
    openTracking(t.dataset.track);
    return;
  }
  const c = e.target.closest("[data-cancel]");
  if (c) cancelarPedido(c.dataset.cancel);
});

let ratingFolio = "";
function openDeliveryRating(folio) {
  const order = findOrder(folio);
  if (
    !order ||
    FoodManagement.statusOf(order) !== "Entregado" ||
    order.deliveryRating
  )
    return;
  ratingFolio = folio;
  $("#deliveryRatingForm").reset();
  window.FoodReviewSafety.check("deliveryRatingComment");
  $("#deliveryRatingError").textContent = "";
  $("#deliveryRatingFolio").textContent = "Pedido " + folio;
  openModal("#deliveryRatingModal");
}
$("#deliveryRatingForm").addEventListener("change", (e) => {
  if (e.target.name === "deliveryStars")
    $("#deliveryRatingError").textContent = "";
});

async function submitTrackDeliveryRating(folio, stars) {
  const err = $("#trRateError");
  const comment =
    ($("#trRateComment") && $("#trRateComment").value.trim()) || "";
  if (!stars || stars < 1) {
    if (err) err.textContent = "Elige de 1 a 5 estrellas.";
    return;
  }
  const btn = $("#trRateSend");
  if (btn?.disabled) return;
  const moderation = window.FoodReviewModeration.check(comment);
  if (!moderation.allowed) {
    if (err) err.textContent = moderation.message;
    return;
  }
  if (btn) {
    btn.disabled = true;
    btn.dataset.submitting = "true";
  }
  try {
    const order = findOrder(folio);
    if (!order) throw Error("Pedido no encontrado.");
    const captcha = await window.FoodCaptcha.request("review");
    const response = await fetch(
      "api/orders/" + encodeURIComponent(folio) + "/rating",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars: Number(stars), comment, ...captcha }),
      },
    );
    const result = await response.json();
    if (!response.ok)
      throw Error(result.error || "No se pudo guardar la calificación.");
    Object.assign(order, result.order);
    save("tizafood_orders", state.orders);
    await refreshReviews().catch(() => {});
    try {
      renderReviews();
    } catch (e) {}
    try {
      renderOrders();
    } catch (e) {}
    updateTracking();
    toast("¡Gracias! Agradecemos tu opinión.");
  } catch (e) {
    if (err) err.textContent = e.message;
    else toast(e.message);
  } finally {
    if (btn) {
      delete btn.dataset.submitting;
      btn.disabled = !window.FoodReviewModeration.check(
        $("#trRateComment")?.value || "",
      ).allowed;
    }
  }
}

$("#deliveryRatingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!window.FoodReviewSafety.check("deliveryRatingComment")) return;
  const selected = document.querySelector(
    'input[name="deliveryStars"]:checked',
  );
  if (!selected) {
    $("#deliveryRatingError").textContent = "Elige de 1 a 5 estrellas.";
    return;
  }
  const button = $("#saveDeliveryRating");
  if (button.disabled) return;
  button.dataset.submitting = "true";
  button.disabled = true;
  try {
    const stars = Number(selected.value),
      comment = $("#deliveryRatingComment").value.trim(),
      folio = ratingFolio,
      captcha = await window.FoodCaptcha.request("review");
    const response = await fetch(
      "api/orders/" + encodeURIComponent(folio) + "/rating",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, comment, ...captcha }),
      },
    );
    const result = await response.json();
    if (!response.ok) throw Error(result.error);
    const order = findOrder(ratingFolio);
    if (order) Object.assign(order, result.order);
    save("tizafood_orders", state.orders);
    await refreshReviews().catch(() => {});
    renderOrders();
    try {
      renderReviews();
    } catch (e) {}
    closeModal($("#deliveryRatingModal"));
    toast(
      "Agradecemos tu opinión. Intentamos mejorar y haremos lo mejor para mejorar tu experiencia.",
    );
  } catch (err) {
    $("#deliveryRatingError").textContent = err.message;
  } finally {
    delete button.dataset.submitting;
    window.FoodReviewSafety.check("deliveryRatingComment");
  }
});

function openAccount() {
  syncClientData();
  const u = state.user;
  $("#uName").value = u.name;
  $("#uEmail").value = u.email;
  $("#uAddress").value = u.address;
  $("#uNameTop").textContent = u.name;
  $("#profileMsg").textContent = "";
  setAvatar($("#bigAvatar"));
  renderPlacesList();
  renderOrders();
  openScreen("#accountScreen");
  $("#clientWalletBalance").textContent = "Saldo a favor: consultando…";
  window.dispatchEvent(new Event("tiza-account-open"));
  $("#accountScreen .screen-body").scrollTop = 0;
}
$("#btnUser").addEventListener("click", openAccount);
$("#btnClientPanel").addEventListener("click", openAccount);

$("#profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#uName").value.trim();
  const email = $("#uEmail").value.trim();
  const address = $("#uAddress").value.trim();
  const msg = $("#profileMsg");
  msg.style.color = "";
  if (name.length < 2) {
    msg.textContent = "Escribe tu nombre.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = "Escribe un correo válido.";
    return;
  }
  if (address.length < 5) {
    msg.textContent = "Escribe tu dirección para el envío.";
    return;
  }

  const button = $("#profileForm button[type=submit]");
  if (button.disabled) return;
  button.disabled = true;
  try {
    await updateAccount("", "PATCH", { name, address });
    renderUserChip();
    renderPlacesList();
    $("#uNameTop").textContent = state.user.name;
    setAvatar($("#bigAvatar"));
    toast("Datos guardados en tu cuenta");
  } catch (error) {
    msg.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

// Foto de usuario
$("#btnPhoto").addEventListener("click", () => $("#photoInput").click());
$("#bigAvatar").addEventListener("click", () => $("#photoInput").click());
$("#photoInput").addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast("Elige una imagen");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 240;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const side = Math.min(img.width, img.height);
      c.getContext("2d").drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size,
      );
      state.user.photo = c.toDataURL("image/jpeg", 0.82);
      save("tizafood_user", state.user);
      renderUserChip();
      setAvatar($("#bigAvatar"));
      toast("Foto actualizada 📷");
    };
    img.onerror = () => toast("No se pudo leer esa imagen");
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  e.target.value = "";
});

$("#btnLogout").addEventListener("click", async () => {
  if (
    !confirm(
      "¿Cerrar sesión? Se borrarán tus datos y pedidos de este dispositivo.",
    )
  )
    return;
  if (dbSource === "api") {
    try {
      await fetch("api/logout", { method: "POST" });
    } catch (err) {
      toast("No se pudo cerrar sesión. Intenta otra vez.");
      return;
    }
  }
  [
    "tizafood_user",
    "tizafood_orders",
    "tizafood_cart",
    "tizafood_favs",
    "tizafood_branch",
  ].forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch (e) {
      /* nada */
    }
  });
  location.reload();
});

/* ---------- IMAGEN ROTATIVA DEL INICIO ---------- */

const comidaImagenes = [
  "img/hamburguesa.jpg",
  "img/cathamburgesa.jpg",
  "img/comidat.jpg",
  "img/ejemplo2.png",
];
const imagenesValidas = [];
comidaImagenes.forEach((src) => {
  const im = new Image();
  im.onload = () => {
    if (!imagenesValidas.includes(src)) imagenesValidas.push(src);
  };
  im.src = src;
});

setInterval(() => {
  const heroImg = $(".animated-food-logo");
  if (!heroImg || imagenesValidas.length < 2) return;
  const actual = imagenesValidas.findIndex((s) => heroImg.src.endsWith(s));
  const siguiente = imagenesValidas[(actual + 1) % imagenesValidas.length];
  heroImg.style.opacity = "0";
  setTimeout(() => {
    heroImg.src = siguiente;
    heroImg.style.opacity = "1";
  }, 300);
}, 5000);

/* ----------  RESEÑAS ---------- */
// La lista procede de la API compartida, nunca de la caché de otra cuenta.
function allReviews() {
  return state.reviews
    .slice()
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}
const reviewsFor = (name) =>
  allReviews().filter((r) => r.kind === "product" && r.product === name);
async function refreshReviews() {
  const response = await fetch("api/reviews", { cache: "no-store" }),
    result = await response.json();
  if (!response.ok)
    throw Error(result.error || "No se pudieron cargar las reseñas.");
  state.reviews = result.reviews.map(normReview);
}
function reviewableProducts() {
  if (!state.user || state.user.role !== "cliente") return [];
  const done = new Set(
    state.reviews
      .filter((r) => r.mine && r.kind === "product")
      .map((r) => r.productKey),
  );
  const targets = new Map();
  for (const order of state.orders) {
    if (
      FoodManagement.statusOf(order) !== "Entregado" ||
      String(order.owner || "").toLowerCase() !== ownerOf()
    )
      continue;
    for (const item of orderItems(order)) {
      if (!(Number(item.qty) > 0)) continue;
      const product =
        item.productId != null
          ? PRODUCTS.find((p) => String(p.id) === String(item.productId))
          : PRODUCTS.find((p) => p.name === item.name);
      const productId = product
        ? product.id
        : item.productId == null
          ? null
          : item.productId;
      const name = product ? product.name : item.name,
        key =
          productId != null ? "product:" + String(productId) : "name:" + name;
      if (done.has(key)) continue;
      const previous = targets.get(key);
      if (previous) previous.orderFolios.push(order.folio);
      else
        targets.set(key, {
          key,
          product: name,
          productId,
          orderFolios: [order.folio],
        });
    }
  }
  return [...targets.values()];
}

// Calificación
function ratingInfo(name) {
  const all = reviewsFor(name);
  if (!all.length) return { avg: null, n: 0 };
  return {
    avg: all.reduce((s, r) => s + r.stars, 0) / all.length,
    n: all.length,
  };
}

const starsHTML = (n) =>
  '<span class="stars" aria-label="' +
  n +
  ' de 5">' +
  "★".repeat(Math.round(n)) +
  "☆".repeat(5 - Math.round(n)) +
  "</span>";
const AVATAR_COLORS = [
  "#d62828",
  "#ff8c00",
  "#16a34a",
  "#7e22ce",
  "#0ea5e9",
  "#b45309",
];
function colorOf(name) {
  let n = 0;
  for (const ch of name) n += ch.charCodeAt(0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}
const shortName = (full) => {
  const p = full.trim().split(/\s+/);
  return p.length > 1 ? p[0] + " " + p[1].charAt(0).toUpperCase() + "." : p[0];
};

function renderSheetReviews() {
  const item = sheet.item;
  if (!item) return;
  const info = ratingInfo(item.name);
  const eligible = reviewableProducts().some((p) => p.product === item.name);
  $("#pWrite").disabled = !eligible;
  $("#pWrite").title = eligible
    ? "Reseñar este producto"
    : "Disponible después de recibir este producto, una reseña por producto.";
  $("#pRating").textContent = info.avg ? info.avg.toFixed(1) : "Nuevo";
  $("#pReviewCount").textContent = info.n
    ? "(" + info.n + (info.n === 1 ? " reseña)" : " reseñas)")
    : "";
  const rl = $("#pReviewsList");
  const list = reviewsFor(item.name);
  rl.classList.remove("hidden");
  rl.innerHTML = list.length
    ? list
        .map(
          (r) =>
            "<p>" +
            starsHTML(r.stars) +
            " <strong>" +
            esc(r.user) +
            '</strong><br><em>"' +
            esc(r.comment) +
            '"</em>' +
            (r.moderated
              ? '<br><small class="muted">Editada por moderación</small>'
              : "") +
            "</p>",
        )
        .join("")
    : '<p class="muted">Aún no hay reseñas. ¡Sé el primero en opinar!</p>';
}

function renderReviews() {
  const all = allReviews();
  $("#btnWriteReview").disabled = reviewableProducts().length === 0;
  const sel = $("#reviewFilter");
  const names = [...new Set(all.map((r) => r.product))];
  const cur = sel.value;
  sel.innerHTML =
    '<option value="">Todos los productos (' +
    all.length +
    ")</option>" +
    names
      .map((n) => '<option value="' + esc(n) + '">' + esc(n) + "</option>")
      .join("");
  if (names.includes(cur)) sel.value = cur;

  const shown = sel.value ? all.filter((r) => r.product === sel.value) : all;
  const avg = shown.length
    ? shown.reduce((s, r) => s + r.stars, 0) / shown.length
    : 0;

  const bars = [5, 4, 3, 2, 1]
    .map((s) => {
      const c = shown.filter((r) => r.stars === s).length;
      const pct = shown.length ? Math.round((c / shown.length) * 100) : 0;
      return (
        '<div class="rv-bar"><span>' +
        s +
        '</span><div class="rv-track"><div class="rv-fill" style="width:' +
        pct +
        '%"></div></div><span>' +
        c +
        "</span></div>"
      );
    })
    .join("");

  $("#rvSummary").innerHTML =
    '<div class="rv-big"><strong>' +
    (shown.length ? avg.toFixed(1) : "—") +
    "</strong>" +
    starsHTML(avg) +
    "<small>" +
    shown.length +
    (shown.length === 1 ? " reseña" : " reseñas") +
    '</small></div><div class="rv-bars">' +
    bars +
    "</div>";

  const box = $("#rvList");
  if (!shown.length) {
    box.innerHTML =
      '<div class="empty">Todavía no hay reseñas de este producto. ¡Escribe la primera!</div>';
  } else {
    box.innerHTML = shown
      .map(
        (r) =>
          '<article class="rv-card' +
          (r.mine ? " mine" : "") +
          (r.kind === "delivery" ||
          String(r.product || "").indexOf("Entrega") === 0
            ? " delivery-review"
            : "") +
          '">' +
          '<span class="avatar" style="background:' +
          colorOf(r.user) +
          '">' +
          esc(r.user.charAt(0).toUpperCase()) +
          "</span>" +
          '<div><div class="rv-top"><strong>' +
          esc(r.user) +
          (r.mine ? ' <span class="rv-you">Tu reseña</span>' : "") +
          (r.kind === "delivery" ||
          String(r.product || "").indexOf("Entrega") === 0
            ? ' <span class="rv-delivery-tag">Entrega / repartidor</span>'
            : "") +
          "</strong>" +
          starsHTML(r.stars) +
          "</div>" +
          '<div class="rv-meta"><span class="rv-prod">' +
          esc(r.product) +
          "</span>" +
          (r.date
            ? " · " +
              new Date(r.date).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "") +
          "</div>" +
          '<p class="rv-text">' +
          esc(r.comment) +
          "</p>" +
          (r.verifiedPurchase
            ? '<small class="muted">Compra verificada · Pedido entregado</small>'
            : "") +
          (r.moderated
            ? '<br><small class="muted">Editada por moderación</small>'
            : "") +
          (r.mine && r.kind === "product"
            ? '<button class="mini-link danger" data-del-review="' +
              esc(r.id) +
              '">Eliminar</button>'
            : "") +
          "</div></article>",
      )
      .join("");
  }
}

$("#reviewFilter").addEventListener("change", renderReviews);
$("#rvList").addEventListener("click", async (e) => {
  const d = e.target.closest("[data-del-review]");
  if (!d) return;
  if (!confirm("¿Eliminar tu reseña?")) return;
  d.disabled = true;
  try {
    const response = await fetch(
        "api/reviews/" + encodeURIComponent(d.dataset.delReview),
        { method: "DELETE" },
      ),
      result = await response.json();
    if (!response.ok)
      throw Error(result.error || "No se pudo eliminar tu reseña.");
    state.reviews = state.reviews.filter(
      (r) => String(r.id) !== d.dataset.delReview,
    );
    renderReviews();
    renderOrders();
    if (sheet.item) renderSheetReviews();
    toast("Reseña eliminada");
  } catch (error) {
    toast(error.message);
  } finally {
    d.disabled = false;
  }
});

// --- Modal para escribir reseña ---
let rvStars = 0;
let rvProducts = [],
  rvOrderFolio = "";

function paintStars() {
  $$("#rvStars button").forEach((b) =>
    b.classList.toggle("on", Number(b.dataset.s) <= rvStars),
  );
}

async function openReviewModal(productName, orderFolio) {
  try {
    const response = await fetch("api/reviews/eligible", { cache: "no-store" }),
      result = await response.json();
    if (!response.ok)
      throw Error(result.error || "No se pudieron comprobar tus compras.");
    rvProducts = result.products.filter(
      (p) =>
        (!productName || p.product === productName) &&
        (!orderFolio || p.orderFolios.includes(orderFolio)),
    );
    if (!rvProducts.length) {
      toast(
        "Solo puedes reseñar productos de pedidos entregados que aún no hayas reseñado.",
      );
      return;
    }
    rvOrderFolio = orderFolio || "";
    const sel = $("#rvProduct");
    sel.innerHTML = rvProducts
      .map(
        (p) =>
          '<option value="' + esc(p.key) + '">' + esc(p.product) + "</option>",
      )
      .join("");
    sel.value = rvProducts[0].key;
    rvStars = 0;
    paintStars();
    $("#rvText").value = "";
    $("#rvCount").textContent = "0 / 220";
    $("#rvError").textContent = "";
    window.FoodReviewSafety.check("rvText");
    openModal("#reviewModal");
  } catch (error) {
    toast(error.message);
  }
}

$("#rvStars").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  rvStars = Number(b.dataset.s);
  paintStars();
});
$("#rvText").addEventListener("input", (e) => {
  $("#rvCount").textContent = e.target.value.length + " / 220";
});

$("#btnSendReview").addEventListener("click", async () => {
  if (!window.FoodReviewSafety.check("rvText")) return;
  const text = $("#rvText").value.trim();
  const err = $("#rvError");
  if (!rvStars) {
    err.textContent = "Elige tus estrellas.";
    return;
  }
  if (text.length < 5) {
    err.textContent = "Cuéntanos un poco más (mínimo 5 letras).";
    return;
  }

  const product = rvProducts.find((p) => p.key === $("#rvProduct").value);
  if (!product) {
    err.textContent = "Selecciona un producto de tus pedidos entregados.";
    return;
  }
  const button = $("#btnSendReview");
  if (button.disabled) return;
  button.dataset.submitting = "true";
  button.disabled = true;
  err.textContent = "";
  try {
    const reviewBody = {
      productKey: product.key,
      orderFolio: rvOrderFolio || undefined,
      stars: rvStars,
      comment: text,
      ...(await window.FoodCaptcha.request("review")),
    };
    const response = await fetch("api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewBody),
      }),
      result = await response.json();
    if (!response.ok)
      throw Error(result.error || "No se pudo guardar la reseña.");
    state.reviews.unshift(normReview(result.review));
    Sound.play("tap");
    closeModal($("#reviewModal"));
    renderReviews();
    renderOrders();
    if (sheet.item) renderSheetReviews();
    toast("¡Gracias por tu reseña!");
  } catch (error) {
    err.textContent =
      error.message || "No se pudo guardar. Intenta nuevamente.";
  } finally {
    delete button.dataset.submitting;
    window.FoodReviewSafety.check("rvText");
  }
});

$("#btnWriteReview").addEventListener("click", () => openReviewModal());
$("#pWrite").addEventListener("click", () =>
  openReviewModal(sheet.item && sheet.item.name),
);

/* ----------  LUGARES DE ENTREGA  ---------- */

function renderPlacesList() {
  const box = $("#placesList");
  const saved = state.user.places || [];
  box.innerHTML =
    '<div class="order"><div class="order-top"><span> Mi dirección</span></div><small>' +
    esc(state.user.address) +
    "</small></div>" +
    saved
      .map(
        (p, i) =>
          '<div class="order"><div class="order-top"><span>' +
          (p.coords ? "📍 " : "🏠 ") +
          esc(p.label) +
          '</span><button type="button" class="mini-link danger" data-place="' +
          i +
          '">Eliminar</button></div><small>' +
          esc(p.text) +
          "</small></div>",
      )
      .join("") +
    (saved.length
      ? ""
      : '<small class="muted">Cuando cambies el lugar de entrega en un pedido, marca “Guardar este lugar” y aparecerá aquí.</small>');
}
$("#placesList").addEventListener("click", async (e) => {
  const d = e.target.closest("[data-place]");
  if (!d) return;
  const place = state.user.places?.[Number(d.dataset.place)];
  if (!place || d.disabled) return;
  d.disabled = true;
  try {
    await updateAccount("/places", "DELETE", { text: place.text });
    renderPlacesList();
    if (state.checkout) renderCoPlaces();
  } catch (error) {
    d.disabled = false;
    toast(error.message);
  }
});

/* ---------- MÚSICA DE FONDO little-things ---------- */
function initBgMusic() {
  const m = document.getElementById("bgMusic");
  if (!m) return;
  m.volume = 0.3;
  m.loop = true;
  m.preload = "auto";

  const playIt = () => {
    m.play()
      .then(() => {
        console.log("SONANDO Little Things");
      })
      .catch((e) => {
        console.log("Esperando click", e);
      });
  };

  // intenta al inicio
  playIt();

  // si Chrome lo bloquea, suena al primer click/touch/tecla
  ["click", "touchstart", "keydown", "scroll"].forEach((evt) => {
    document.addEventListener(evt, playIt, { once: true });
  });
}
document.addEventListener("DOMContentLoaded", initBgMusic);

/* ---------- CHAT DE ESTADO DEL PEDIDO ---------- */
function refreshStoredRefundMessages(list, records) {
  let changed = false;
  const updated = list.map((message) => {
    if (
      !message ||
      message.role !== "bot" ||
      message.formatVersion === 2 ||
      typeof message.text !== "string"
    )
      return message;
    const parts = message.text.split(/\n\n(?=Solicitud )/);
    let matched = false;
    const text = parts
      .map((part) => {
        const record = records.find((r) =>
          part.startsWith(
            "Solicitud " + r.id.slice(0, 8) + " · " + r.folio + "\n",
          ),
        );
        if (!record) return part;
        matched = true;
        return record.text;
      })
      .join("\n\n");
    if (!matched) return message;
    changed = true;
    return { ...message, text, formatVersion: 2 };
  });
  return changed ? updated : list;
}
(function initOrderChat() {
  const panel = $("#orderChatPanel");
  const log = $("#orderChatLog");
  const form = $("#orderChatForm");
  const input = $("#orderChatInput");
  const btn = $("#btnOrderChat");
  if (!panel || !log || !form || !btn) return;

  const clockChat = () =>
    new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const chatKey = () => "tizafood_order_chat_v1:" + (ownerOf() || "guest");
  const deliveredKey = (folio) =>
    "tizafood_chat_delivered_v1:" + (ownerOf() || "guest") + ":" + folio;
  const DELIVERED_IMG = "img/pedido-entregado.jpg";

  function loadChat() {
    try {
      const raw = localStorage.getItem(chatKey());
      const list = raw ? JSON.parse(raw) : null;
      if (Array.isArray(list) && list.length) return list;
    } catch (e) {
      /* */
    }
    return [
      {
        role: "bot",
        text: "¡Hola! 😊 Soy el asistente de Tiza Food. Puedo decirte el estado de tu pedido, recomendarte platillos, contarte promociones o ayudarte si algo salió mal.",
        time: clockChat(),
      },
    ];
  }
  let messages = loadChat();

  function saveChat() {
    try {
      localStorage.setItem(chatKey(), JSON.stringify(messages.slice(-100)));
    } catch (e) {
      /* */
    }
  }

  function renderChat() {
    log.innerHTML = messages
      .map((m) => {
        let body = "";
        if (m.image) {
          body +=
            '<img class="order-chat-img" src="' +
            esc(m.image) +
            '" alt="' +
            esc(m.imageAlt || "Pedido entregado") +
            '" loading="lazy">';
        }
        if (m.text)
          body += '<div class="order-chat-text">' + esc(m.text) + "</div>";
        return (
          '<div class="order-chat-msg ' +
          (m.role === "me" ? "me" : "bot") +
          (m.image ? " has-image" : "") +
          '">' +
          body +
          '<span class="meta">' +
          esc(m.time || "") +
          "</span></div>"
        );
      })
      .join("");
    log.scrollTop = log.scrollHeight;
  }

  function pickOrder(text) {
    const orders = (state.orders || [])
      .slice()
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));
    if (!orders.length) return null;
    const upper = String(text || "").toUpperCase();
    return (
      orders.find((o) => upper.includes(String(o.folio || "").toUpperCase())) ||
      orders[0]
    );
  }

  function statusLabel(order) {
    if (!order) return "";
    if (typeof orderStatusText === "function") return orderStatusText(order);
    return order.status || "Recibido";
  }

  function itemsBrief(order) {
    const list = (
      typeof orderItems === "function"
        ? orderItems(order)
        : (order && order.items) || []
    )
      .map((l) => l.qty + "× " + l.name)
      .slice(0, 4);
    return list.join(", ");
  }

  function friendlyStatus(order) {
    const st = statusLabel(order);
    const items = itemsBrief(order);
    const low = String(st).toLowerCase();
    let line;
    if (low.includes("cancel")) {
      line = "Tu pedido " + order.folio + " fue cancelado.";
    } else if (low.includes("entreg")) {
      line =
        "¡Ya entregamos tu pedido " +
        order.folio +
        "! Esperamos que lo hayas disfrutado.";
    } else if (low.includes("camino")) {
      line =
        "Tu pedido " +
        order.folio +
        " ya va en camino con el repartidor. En unos minutos debería llegar.";
    } else if (low.includes("prepar")) {
      line =
        "Estamos preparando tu pedido " +
        order.folio +
        " en la cocina. Apenas esté listo sale a entrega.";
    } else {
      line =
        "Recibimos tu pedido " +
        order.folio +
        " y la sucursal ya lo tiene en cola.";
    }
    if (items) line += " Llevas: " + items + ".";
    line += " También puedes seguirlo en Mis pedidos.";
    return line;
  }

  function topPromos(n) {
    const list = (
      typeof PROMOS !== "undefined" && Array.isArray(PROMOS) ? PROMOS : []
    ).slice(0, n || 3);
    if (!list.length)
      return "Hoy te recomiendo revisar Inicio: ahí verás las promociones activas de Tiza Food.";
    return list
      .map(
        (p, i) =>
          i +
          1 +
          ". " +
          p.name +
          (p.price != null ? " · $" + Number(p.price).toFixed(0) : "") +
          (p.tagText ? " (" + p.tagText + ")" : "") +
          (p.short ? " — " + p.short : ""),
      )
      .join("\n");
  }

  function recommendDishes(msg) {
    const pool = (
      typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) ? PRODUCTS : []
    ).filter((p) => p && p.name && !p.soldOut);
    if (!pool.length)
      return "Explora el menú en Inicio y Buscar: ahí tienes hamburguesas, snacks, pizzas y más.";
    let filtered = pool;
    if (/(hamburg|burger)/.test(msg))
      filtered = pool.filter(
        (p) => /hamburg|burger/i.test(p.name) || p.cat === "Hamburguesas",
      );
    else if (/(pizza)/.test(msg))
      filtered = pool.filter(
        (p) => /pizza/i.test(p.name) || p.cat === "Pizzas",
      );
    else if (/(papa|snack|alita|nugget|hot dog)/.test(msg))
      filtered = pool.filter(
        (p) =>
          /Snacks/i.test(p.cat || "") ||
          /papa|alita|nugget|hot dog/i.test(p.name),
      );
    else if (/(bebida|refresco|malteada|agua)/.test(msg))
      filtered = pool.filter((p) => /Bebidas/i.test(p.cat || ""));
    else if (/(postre|helado|brownie|dulce)/.test(msg))
      filtered = pool.filter((p) => /Postres|Dulces/i.test(p.cat || ""));
    else {
      filtered = pool
        .slice()
        .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }
    const picks = filtered.slice(0, 3);
    if (!picks.length) picks.push(...pool.slice(0, 3));
    return (
      "Te recomiendo:\n" +
      picks
        .map(
          (p, i) =>
            i +
            1 +
            ". " +
            p.name +
            " · $" +
            Number(p.price).toFixed(0) +
            (p.rating ? " ★" + p.rating : ""),
        )
        .join("\n") +
      "\nPuedes agregarlos desde Inicio o Buscar."
    );
  }

  function orderStatusReply(text) {
    const raw = String(text || "").trim();
    const msg = raw
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (
      /^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|que tal|holi)\b/.test(
        msg,
      ) ||
      msg.length < 3
    ) {
      const order = pickOrder(raw);
      if (order) {
        return (
          "¡Hola! 😊 ¿En qué te ayudo? Puedo decirte cómo va " +
          order.folio +
          ", recomendarte algo del menú o contarte las promociones."
        );
      }
      return "¡Hola! 😊 Soy el asistente de Tiza Food. Pregúntame por tu pedido, promociones o qué te recomiendo pedir.";
    }

    if (
      /(gracias|thank|muy amable|perfecto|ok gracias|listo gracias)/.test(msg)
    ) {
      return "¡Con gusto! Gracias por preferir Tiza Food. Si se te antoja algo más, aquí estoy. ¡Buen provecho! 🍔";
    }

    if (
      /(reembolso|devolucion|danad|derram|equivocad|mal estado|incompleto|frio|quemad|crudo)/.test(
        msg,
      )
    ) {
      return "Lamento el problema con tu comida. Pulsa “Solicitar reembolso”, elige un producto de un pedido entregado y adjunta una foto con la descripción. Podrás consultar el estado en “Mis solicitudes”. La aprobación queda pendiente hasta que el restaurante realice la devolución.";
    }

    // Promociones
    if (/(promo|oferta|descuento|cupon|cupón|especial|2x1|combo)/.test(msg)) {
      let extra = "";
      if (/(cupon|cupón|codigo|código)/.test(msg)) {
        extra =
          "\nCupones disponibles: TIZA10 (10% en comida), ENVIOGRATIS (solo en tu primera compra) y AHORRA20 (desde $100 de comida).";
      }
      return (
        "Estas son algunas promociones destacadas:\n" +
        topPromos(4) +
        extra +
        "\nLas ves también en la sección de inicio."
      );
    }

    // Recomendaciones
    if (
      /(recomiend|suger|que me pido|qué me pido|que pedir|qué pedir|sugerencia|menu|menú|hambre|antojo)/.test(
        msg,
      ) ||
      (/(hamburg|pizza|papa|alita|malteada|postre|bebida)/.test(msg) &&
        /(quiero|deseo|me gusta|prefiero|algo de)/.test(msg))
    ) {
      return recommendDishes(msg);
    }
    if (
      /(hamburg|pizza|papa|alita|nugget|malteada|postre)/.test(msg) &&
      msg.split(/\s+/).length <= 4
    ) {
      return recommendDishes(msg);
    }

    // Horario / sucursal
    if (/(horario|abierto|cerrado|a que hora|a qué hora)/.test(msg)) {
      const el = document.getElementById("restaurantStatus");
      if (el && el.textContent)
        return (
          el.textContent +
          " Si está cerrado, igual puedes explorar el menú y pedir cuando abramos."
        );
      return "El horario lo ves en el aviso de la tienda (arriba en Inicio). Si está cerrado, no se pueden confirmar pedidos nuevos.";
    }
    if (/(sucursal|donde estan|dónde están|ubicacion|ubicación)/.test(msg)) {
      return "Tenemos sucursales en Centro, Haciendas, Tizayuca Sur y Ex Hacienda. Al pedir eliges la más cercana y ves el costo de envío.";
    }

    // Quejas
    const cold =
      /(frio|fria|helad|tibio|tibia|no caliente|lleg[oó] frio|comida fria)/.test(
        msg,
      );
    const late =
      /(tarda|tard[oó]|demora|lento|no llega|donde esta|cuanto falta|retraso|atrasad)/.test(
        msg,
      );
    const wrong =
      /(mal|equivocad|incorrect|no pedi|falt[oó]|incompleto|otro producto|error|arruinad|quemad|crudo|feo|horrible|pesimo|asco|no sirve)/.test(
        msg,
      );
    const missing = /(falta|no trajeron|no vino|olvidaron)/.test(msg);
    const complaint =
      cold ||
      late ||
      wrong ||
      missing ||
      /(problema|queja|reclamo|molesto|enojad|salio mal|salió mal|esta mal|está mal)/.test(
        msg,
      );

    if (complaint) {
      const order = pickOrder(raw);
      const folio = order ? order.folio : "tu pedido";
      if (cold) {
        return (
          "Lamentamos mucho que " +
          folio +
          " haya llegado frío 😔. Califica la entrega en Mis pedidos para que el restaurante lo vea. Si aún no está marcado como entregado, dime el folio y lo revisamos."
        );
      }
      if (missing || wrong) {
        return (
          "Sentimos el inconveniente con " +
          folio +
          ". Revisa el ticket en Mis pedidos y califica la entrega contando qué faltó o qué llegó mal. El personal ve esas notas."
        );
      }
      if (late) {
        if (order) {
          return (
            "Entiendo la demora 🙏. Ahora " +
            folio +
            " está en: " +
            statusLabel(order) +
            ". Síguelo en Mis pedidos; si se queda mucho tiempo en la misma etapa, el restaurante puede avanzar el estado."
          );
        }
        return "Entiendo la demora. Dime el folio o revisa Mis pedidos para ver en qué etapa va.";
      }
      return (
        "Lamentamos que la experiencia con " +
        folio +
        " no haya sido buena 😔. Déjanos detalles en la calificación de entrega (Mis pedidos)."
      );
    }

    // Estado del pedido
    if (
      /(estado|pedido|folio|seguimiento|donde|va mi|como va|cómo va|ya sale|ya va|en camino|preparacion|preparación|entregado|recibido)/.test(
        msg,
      ) ||
      /TF-?\d+/i.test(raw)
    ) {
      const order = pickOrder(raw);
      if (!order)
        return "Aún no veo pedidos en esta cuenta. Cuando confirmes uno, aquí te cuento en qué va 🛵.";
      return friendlyStatus(order);
    }

    if (/(ayuda|help|que puedes|qué puedes|opciones)/.test(msg)) {
      return "Puedo ayudarte con:\n• Estado de tu pedido\n• Promociones y cupones\n• Recomendaciones del menú\n• Problemas con la entrega (frío, incompleto, demora)\nEscribe lo que necesites 😊";
    }

    const order = pickOrder(raw);
    if (order) {
      return (
        "Te leo. Tu pedido más reciente es " +
        order.folio +
        " (" +
        statusLabel(order) +
        "). También puedo recomendarte platillos o contarte promociones."
      );
    }
    return "Puedo ayudarte con el estado de pedidos, promociones o recomendaciones. Prueba: “¿cómo va mi pedido?”, “¿qué promociones hay?” o “recomiéndame una hamburguesa”.";
  }

  function pushAppNotification(folio, text) {
    try {
      const email =
        ownerOf() ||
        (state.user && (state.user.email || state.user.username)) ||
        "";
      if (!email) return;
      const key = "tiza_notifications_v1:" + email;
      let data;
      try {
        data = JSON.parse(localStorage.getItem(key) || "null");
      } catch (e) {
        data = null;
      }
      if (!data || !Array.isArray(data.items))
        data = { seen: (data && data.seen) || {}, items: [] };
      data.items = [
        { folio: String(folio || "Chat"), text, at: Date.now(), read: false },
        ...data.items,
      ].slice(0, 50);
      localStorage.setItem(key, JSON.stringify(data));
      const countEl = document.getElementById("notificationCount");
      const unread = data.items.filter((n) => !n.read).length;
      if (countEl) countEl.textContent = unread ? String(unread) : "";
      const btnN = document.getElementById("btnNotifications");
      if (btnN)
        btnN.setAttribute(
          "aria-label",
          "Notificaciones" + (unread ? ", " + unread + " sin leer" : ""),
        );
      const popup = document.getElementById("notificationPopup");
      const popupText = document.getElementById("notificationPopupText");
      if (popup && popupText) {
        popupText.textContent = "Pedido " + folio + ": " + text;
        popup.classList.remove("hidden");
        clearTimeout(window.__tizaNotifTimer);
        window.__tizaNotifTimer = setTimeout(
          () => popup.classList.add("hidden"),
          8000,
        );
      }
      if (
        window.FoodNotifications &&
        typeof window.FoodNotifications.observe === "function" &&
        state.user
      ) {
        try {
          window.FoodNotifications.observe(email, state.orders || []);
        } catch (e) {
          /* */
        }
      }
    } catch (e) {
      /* */
    }
  }

  function markChatUnread() {
    btn.classList.add("has-chat-unread");
    let badge = btn.querySelector(".chat-unread-dot");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "chat-unread-dot";
      badge.setAttribute("aria-hidden", "true");
      btn.appendChild(badge);
    }
  }
  function clearChatUnread() {
    btn.classList.remove("has-chat-unread");
    const badge = btn.querySelector(".chat-unread-dot");
    if (badge) badge.remove();
  }

  function postBotMessage(msg, opts) {
    opts = opts || {};
    messages.push({
      role: "bot",
      text: msg.text || "",
      image: msg.image || "",
      imageAlt: msg.imageAlt || "",
      time: clockChat(),
      ...(opts.refundId ? { refundId: opts.refundId, formatVersion: 2 } : {}),
    });
    saveChat();
    renderChat();
    if (opts.notify) {
      pushAppNotification(
        opts.folio || "Chat",
        opts.notifyText || msg.text || "Tienes un mensaje nuevo en el chat",
      );
      if (panel.classList.contains("hidden")) markChatUnread();
    }
  }

  function notifyDeliveredOrder(order) {
    if (!order || !order.folio) return;
    try {
      if (localStorage.getItem(deliveredKey(order.folio)) === "1") return;
      localStorage.setItem(deliveredKey(order.folio), "1");
    } catch (e) {
      /* */
    }
    const items = itemsBrief(order);
    const text =
      "¡Tu pedido " +
      order.folio +
      " ha llegado! 🎉\n" +
      (items ? "Incluye: " + items + ".\n" : "") +
      "Gracias por usar nuestra app Tiza Food. ¡Que lo disfrutes tu pedido!";
    postBotMessage(
      { text, image: DELIVERED_IMG, imageAlt: "Pedido entregado — Tiza Food" },
      {
        notify: true,
        folio: order.folio,
        notifyText: "Tu pedido fue entregado. Revisa el chat 💬",
      },
    );
  }

  function scanDeliveredOrders() {
    const orders = state.orders || [];
    for (const o of orders) {
      if (!o || o.cancelled) continue;
      let delivered = false;
      try {
        if (typeof stageOf === "function") delivered = stageOf(o) === 3;
        else delivered = /entreg/i.test(String(o.status || ""));
      } catch (e) {
        delivered = /entreg/i.test(String(FoodManagement.statusOf(o)));
      }
      if (delivered) notifyDeliveredOrder(o);
    }
  }

  function openChat() {
    messages = loadChat();
    renderChat();
    panel.classList.remove("hidden");
    panel.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    clearChatUnread();
    window.dispatchEvent(new Event("tiza-chat-open"));
    try {
      input.focus();
    } catch (e) {
      /* */
    }
  }
  function closeChat() {
    panel.classList.add("hidden");
    panel.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (panel.classList.contains("hidden")) openChat();
    else closeChat();
  });
  const closeBtn = $("#orderChatClose");
  if (closeBtn) closeBtn.addEventListener("click", closeChat);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.classList.contains("hidden")) closeChat();
  });
  document.addEventListener("click", (e) => {
    if (panel.classList.contains("hidden")) return;
    if (panel.contains(e.target) || btn.contains(e.target)) return;
    closeChat();
  });

  let sendingChat = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = (input.value || "").trim();
    if (!text || sendingChat) return;
    const account = ownerOf(),
      submit = form.querySelector('[type="submit"]');
    sendingChat = true;
    submit.disabled = true;
    input.disabled = true;
    messages.push({ role: "me", text, time: clockChat() });
    input.value = "";
    renderChat();
    saveChat();
    try {
      const response = await fetch("api/support/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
          signal: AbortSignal.timeout(22000),
        }),
        data = await response.json();
      if (response.status === 401) {
        FoodSession.expire();
        return;
      }
      if (!response.ok)
        throw Error(data.error || "No se pudo consultar el chat.");
      if (ownerOf() === account) postBotMessage({ text: data.reply });
    } catch (error) {
      if (ownerOf() === account)
        postBotMessage({
          text:
            "No pude consultar el servidor en este momento. " +
            orderStatusReply(text),
        });
    } finally {
      sendingChat = false;
      submit.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });

  window.TizaOrderChat = {
    refreshRefundMessages: (records) => {
      const stored = loadChat(),
        updated = refreshStoredRefundMessages(stored, records);
      messages = updated;
      if (updated !== stored) {
        saveChat();
        renderChat();
      }
    },
    notifyDelivered: notifyDeliveredOrder,
    scanDelivered: scanDeliveredOrders,
    open: openChat,
    post: (text, options) => postBotMessage({ text }, options),
    customerAccount: () =>
      state.user && (state.user.role || "cliente") === "cliente"
        ? ownerOf()
        : "",
  };
  setTimeout(scanDeliveredOrders, 1500);
  setInterval(scanDeliveredOrders, 4000);
  window.addEventListener("focus", scanDeliveredOrders);
})();

/* ---------- ARRANCAR ---------- */

window.addEventListener("load", () => setTimeout(startApp, 2800));

let restaurantHours = null;
function renderRestaurantHours() {
  const status = FoodHours.status(restaurantHours);
  const target = document.getElementById("restaurantStatus");
  target.textContent = status.text;
  target.classList.toggle("closed", !status.open);
}
async function refreshRestaurantHours() {
  try {
    const r = await fetch("api/db", { cache: "no-store" });
    if (r.ok) {
      const db = await r.json();
      restaurantHours = db.hours || null;
      renderRestaurantHours();
    }
  } catch (e) {
    /* La API comprueba el horario al confirmar. */
  }
}
dbReady.then(refreshRestaurantHours);
setInterval(refreshRestaurantHours, 30000);
window.addEventListener("focus", refreshRestaurantHours);
window.addEventListener("restaurant-hours-changed", refreshRestaurantHours);

let reviewedPayment = null;
function showOrderReview(payment) {
  if (!state.checkout) return;
  reviewedPayment = payment;
  const co = state.checkout,
    totals = checkoutPricing();
  $("#orderReviewItems").innerHTML = co.items
    .map(
      (item, i) =>
        '<div class="review-item"><strong>' +
        esc(item.name) +
        "</strong><small>" +
        esc((item.extras || []).map((e) => e.name).join(", ")) +
        '</small><label>Cantidad <input type="number" min="1" max="20" value="' +
        item.qty +
        '" data-review-qty="' +
        i +
        '"></label></div>',
    )
    .join("");
  $("#orderReviewTotals").innerHTML =
    summaryHTML(co.items, totals.fee, totals.discount, totals.couponCode) +
    walletSummaryHTML(totals.walletApplied, totals.amountDue);
  $("#orderReviewAddress").textContent = co.dest.text;
  $("#orderReviewNotes").textContent = co.deliveryNotes
    ? "Instrucciones: " + co.deliveryNotes
    : "Sin instrucciones adicionales.";
  $("#orderReviewPayment").textContent =
    payment.method +
    (payment.method === "Efectivo"
      ? " · pagas con " + money(payment.cashAmount)
      : payment.method === "Tarjeta"
        ? " · terminación " + payment.last4
        : payment.reference
          ? " · referencia " + payment.reference
          : "");
  $("#orderReviewError").textContent = "";
  $("#reviewConfirm").textContent =
    "Confirmar pedido · " + money(totals.amountDue);
  openModal("#orderReviewModal");
}
$("#orderReviewItems").addEventListener("change", (e) => {
  if (!e.target.matches("[data-review-qty]") || !state.checkout) return;
  const qty = Number(e.target.value),
    i = Number(e.target.dataset.reviewQty);
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
    e.target.value = state.checkout.items[i].qty;
    $("#orderReviewError").textContent = "La cantidad debe ser de 1 a 20.";
    return;
  }
  const old = state.checkout.items[i];
  if (old.qty === qty) return;
  state.checkout.items[i] = { ...old, qty };
  try {
    checkoutPricing();
    renderCheckout();
    showOrderReview(reviewedPayment);
  } catch (err) {
    state.checkout.items[i] = old;
    e.target.value = old.qty;
    $("#orderReviewError").textContent = err.message;
  }
});
$("#reviewEditAddress").addEventListener("click", () => {
  closeModal($("#orderReviewModal"));
  renderCheckout();
  $("#btnChangeAddr").click();
});
$("#reviewEditPayment").addEventListener("click", () => {
  closeModal($("#orderReviewModal"));
  openPay();
});
$("#deliveryNotes").addEventListener("input", (e) => {
  if (state.checkout) state.checkout.deliveryNotes = e.target.value.trim();
});
$("#reviewConfirm").addEventListener("click", async () => {
  if (pay.busy || !state.checkout || !reviewedPayment) return;
  const button = $("#reviewConfirm");
  button.disabled = true;
  try {
    const status = FoodHours.status(restaurantHours);
    if (!status.open) throw Error(status.text);
    FoodManagement.available(state.checkout.items, {
      products: PRODUCTS,
      promos: PROMOS,
    });
    if (reviewedPayment.method === "Efectivo") {
      const result = cashPayment(
        String(reviewedPayment.cashAmount),
        checkoutPricing().amountDue,
      );
      if (result.error)
        throw Error(result.error + " Cambia el pago para corregir el importe.");
      Object.assign(reviewedPayment, result);
    }
    if (
      reviewedPayment.method === "Saldo a favor" &&
      checkoutPricing().amountDue > 0
    )
      throw Error(
        "El saldo ya no cubre todo el pedido. Cambia el pago para completar en efectivo.",
      );
    closeModal($("#orderReviewModal"));
    await completeOrder({ ...reviewedPayment });
  } catch (err) {
    $("#orderReviewError").textContent = err.message;
  } finally {
    button.disabled = false;
  }
});
