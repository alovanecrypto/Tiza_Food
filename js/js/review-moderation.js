// Reglas compartidas: también se comprueban en servidor antes de escribir JSON.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FoodReviewModeration = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const message =
    "Reescribe tu comentario sin insultos, amenazas ni expresiones de odio. Puedes contar qué salió mal con la comida o el servicio.";
  const substitutions = {
    0: "o",
    1: "i",
    3: "e",
    4: "a",
    5: "s",
    7: "t",
    8: "b",
    "@": "a",
    $: "s",
    "!": "i",
    а: "a",
    е: "e",
    о: "o",
    і: "i",
    с: "c",
    р: "p",
    х: "x",
    у: "y",
  };
  function normalize(text) {
    return String(text || "")
      .normalize("NFKD")
      .replace(/\p{M}|\p{Cf}/gu, "")
      .toLowerCase()
      .replace(/(?<=[a-z])!(?=[a-z])/g, "i")
      .replace(/[0134578@$аеоісрху]/g, (c) => substitutions[c])
      .replace(/([a-z])\1+/g, "$1")
      .replace(/\s+/g, " ");
  }
  const insults = [
    "pendejo",
    "pendeja",
    "pendejos",
    "pendejas",
    "idiota",
    "idiotas",
    "imbecil",
    "imbeciles",
    "estupido",
    "estupida",
    "estupidos",
    "estupidas",
    "cabron",
    "cabrona",
    "cabrones",
    "cabronas",
    "culero",
    "culera",
    "culeros",
    "culeras",
    "naco",
    "naca",
    "nacos",
    "nacas",
    "pendejada",
    "pendejo",
    "pendejadas",
    "malnacido",
    "malnacida",
    "malnacidos",
    "malnacidas",
    "mal parido",
    "hijo de la gran muralla",
    "pelan",
    "hijos de su madre",
    "hijos de mais",
    "pinche",
    "pinches",
    "chingada",
    "chingado",
    "chingadera",
    "ojala te mueras",
    "chinguen",
    "puto",
    "puta",
    "putos",
    "putas",
    "mierda",
    "mierdota",
    "gilipollas",
    "chingatumadre",
    "hijodeputa",
    "hijosdeputa",
    "hdp",
    "fuck",
    "fucking",
    "shit",
    "bitch",
    "asshole",
    "motherfucker",
    "verga",
    "vergazos",
    "puñetas",
    "mamaguevo",
    "mama huevo",
    "comemierda",
    "come pito",
    "chupame esta",
    "chupame esto",
    "chupameesta",
    "chupamela",
    "maldito",
    "maldita",
    "malditos",
    "malditas",
    "mamada",
    "mamadas",
    "mamon",
    "mamona",
    "mamones",
    "mamonas",
    "chingar",
    "chinga tu puticima madre",
    "chingas",
    "chingados",
    "chingadas",
    "chingadera",
    "chingaderas",
    "carajo",
    "carajos",
    "joder",
    "jodete",
    "jodanse",
    "cojones",
    "concha de tu madre",
    "pelotudo",
    "pelotuda",
    "boludo",
    "boluda",
    "zorra",
    "zorras",
    "prostituta",
    "prostitutas",
    "bastardo",
    "bastarda",
    "bastardos",
    "bastardas",
    "porqueria humana",
    "imbesil",
    "imbesiles",
    "porno",
    "pornografia",
    "pornografico",
    "pornografica",
    "porno infatil",
    "viva el porno",
    "xxx",
    "nopor",
    "putamadre",
    "chingatumadre",
    "chinguenasumadre",
    "chinga tu madre",
    "niño con sindrome de donw",
    "wey con sindrome de donw",
    "puto con sindrome de donw",
    "no mames",
    "no mamen",
    "no chingues",
    "no chinguen",
    "vale madre",
    "vale madres",
    "valen madre",
    "valen madres",
    "valiendo madre",
    "valiendo madres",
    "a la madre",
    "de la verga",
    "de la chingada",
    "hijo de perra",
    "hija de perra",
  ];
  const slurs = [
    "maricon",
    "maricones",
    "joto",
    "geys",
    "gey",
    "geis",
    "jeis",
    "jeys",
    "jotos",
    "puton",
    "nigger",
    "nigga",
    "faggot",
  ];
  const letters = (word) =>
    [...normalize(word).replace(/[^a-z]/g, "")].join("[^a-z]{0,3}");
  const spaced = (word) =>
    new RegExp("(?:^|[^a-z])" + letters(word) + "(?=$|[^a-z])", "u");
  const sequence = (...parts) =>
    new RegExp(
      "(?:^|[^a-z])" +
        parts
          .map(
            (part) =>
              "(?:" +
              (Array.isArray(part) ? part : [part]).map(letters).join("|") +
              ")",
          )
          .join("[^a-z]{0,8}") +
        "(?=$|[^a-z])",
      "u",
    );
  const insultRules = insults.map(spaced),
    hateRules = slurs.map(spaced);
  const people = [
    "empleado",
    "empleados",
    "empleada",
    "empleadas",
    "repartidor",
    "repartidores",
    "repartidora",
    "repartidoras",
    "personal",
    "dueno",
    "duenos",
    "duena",
    "duenas",
    "cocinero",
    "cocineros",
    "mesero",
    "meseros",
    "ustedes",
    "ellos",
    "ellas",
  ];
  const personalInsults = [
    "maldito",
    "maldita",
    "malditos",
    "chichis",
    "chichotas",
    "me la traes",
    "me la chupas",
    "malditas",
    "inutil",
    "inutiles",
    "escoria",
    "basura",
    "bueno para nada",
    "buenos para nada",
    "perro",
    "perra",
    "perros",
    "perras",
    "animal",
    "animales",
    "rata",
    "ratas",
  ];
  const personalAttacks = [
    sequence(personalInsults, people),
    sequence(
      personalInsults,
      ["sean", "sean los", "sean las", "son esos", "son esas"],
      people,
    ),
    sequence(people, personalInsults),
    sequence(
      people,
      ["son", "son unos", "son unas", "de", "eres", "es un", "es una"],
      personalInsults,
    ),
  ];
  const harmfulImperatives = [
    "pudranse",
    "pudrete",
    "pudrase",
    "mueranse",
    "muerete",
    "negro",
    "negrura",
    "oscuridad",
    "blancura",
    "teibol",
    "teidol",
    "judio",
    "tu familia no amanesca",
    "perro estupido",
    "suicidate",
    "suicidense",
  ];
  const imperativeRules = harmfulImperatives.map(spaced);
  function oneEditApart(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0,
      j = 0,
      edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) {
        i++;
        j++;
        continue;
      }
      if (++edits > 1) return false;
      if (a.length >= b.length) i++;
      if (b.length >= a.length) j++;
    }
    return edits + Number(i < a.length || j < b.length) <= 1;
  }
  function harmfulImperative(value) {
    if (imperativeRules.some((rule) => rule.test(value))) return true;
    // La tolerancia de una letra se limita a estos imperativos: no a vocabulario de comida.
    return (value.match(/[a-z]+/g) || []).some(
      (word) =>
        word.length >= 7 &&
        harmfulImperatives.some((verb) => oneEditApart(word, verb)),
    );
  }
  const sexualAbuse = [
    sequence(
      [
        "come",
        "coman",
        "comete",
        "comanse",
        "cometeun",
        "comanun",
        "traga",
        "traguen",
        "tragate",
        "tragense",
        "atragantate",
        "tocame esta",
        "tocame",
        "chupa",
        "chupen",
        "chupame",
        "chupate",
        "mama",
        "mamamela",
        "chupatela",
        "chupatelo",
        "me la galo",
        "te la tragas entera",
        "semen",
        "orgia",
        "orjia",

        "mamen",
        "mamame",
      ],
      [
        "pito",
        "pitos",
        "pene",
        "penes",
        "verga",
        "vergas",
        "polla",
        "pollas",
        "pollones",
        "pija",
        "pijas",
        "dick",
        "cock",
      ],
    ),
    sequence(
      ["come", "coman", "chupa", "chupen", "mama", "mamen"],
      ["el", "mi", "un", "la", "una", "mucho", "puro"],
      ["pito", "pene", "verga", "polla", "pija", "culo"],
    ),
    ...[
      "comepitos",
      "comepollas",
      "hijo de puta",
      "hija de puta",
      "hijos de puta",
      "hijas de puta",
      "hijo de la chingada",
      "hijos de la chingada",
      "vete a la chingada",
      "vayan a la chingada",
      "chinguen a su madre",
      "chinga tu madre",
      "vete a la mierda",
    ].map(spaced),
  ];
  const harm = [
    "matar",
    "matarte",
    "matarlos",
    "matarlas",
    "matarlosatodos",
    "golpear",
    "golpearte",
    "golpearlos",
    "violar",
    "violarte",
    "violarlos",
    "quemar",
    "quemarte",
    "quemarlos",
    "apuñalar",
    "apuñalarte",
    "apuñalarlos",
    "balear",
    "balearte",
    "balearlos",
    "asesinar",
    "asesinarte",
    "asesinarlos",
    "secuestrar",
    "secuestrarte",
    "secuestrarlos",
    "disparar",
    "dispararte",
    "dispararles",
    "descuartizar",
    "descuartizarte",
    "degollar",
    "degollarte",
    "romperlacara",
    "partirlamadre",
  ];
  const harmWishes = [
    "mueras",
    "mueran",
    "muera",
    "pudras",
    "pudran",
    "pudra",
    "maten",
    "violen",
    "atropellen",
    "quemen",
    "suiciden",
    "ahoguen",
    "desangren",
  ];
  const threats = [
    /\b(?:te|los|las|les)\s+voy\s+a\s+(?:matar|quemar|golpear)\b/,
    /\b(?:muerete|mueranse)\b/,
    /\bojala\s+(?:(?:te|se)\s+)?(?:mueras|mueran)\b/,
    /\b(?:mereces|merecen|deberian)\s+morir\b/,
    sequence(["te", "los", "las", "les"], ["voy", "vamos"], "a", harm),
    sequence(["voy", "vamos", "quiero"], "a", harm),
    sequence(
      ["voy", "vamos"],
      "a",
      ["ir", "buscar", "buscarte", "buscarlos"],
      "a",
      harm,
    ),
    sequence(["quiero", "pienso", "planeo"], harm),
    sequence(
      ["te", "los", "las"],
      [
        "matare",
        "mataremos",
        "violaremos",
        "violare",
        "violar",
        "golpeare",
        "quemare",
        "baleare",
        "apuñalare",
      ],
    ),
    sequence(
      ["los", "las", "te"],
      ["quiero", "queremos"],
      ["muerto", "muertos", "muerta", "muertas"],
    ),
    sequence(["ojala", "que"], ["te", "se", "los", "las", "les"], harmWishes),
    sequence(
      ["ojala", "que"],
      ["te", "les", "le"],
      ["de cancer", "de sida", "de un infarto"],
    ),
    sequence(
      ["que", "ojala", "ojale te"],
      ["mueras", "mueran", "mueratodos", "muerantodos"],
    ),
    sequence(
      ["mereces", "merecen", "deberias", "deberian"],
      ["morir", "muerete", "mueras", "quemarse", "morirse", "serviolados"],
    ),
    sequence(
      ["te", "les", "le"],
      ["rompo", "parto", "rompere", "partire"],
      ["la madre", "la cara", "las piernas"],
    ),
    ...[
      "muerete",
      "mal parido",
      "mueranse",
      "matate",
      "matense",
      "suicidate",
      "suicidense",
      "matenlos",
      "matalos",
      "matenlas",
      "matalas",
      "kill yourself",
      "kill yourselves",
      "i will kill you",
      "i will rape you",
      "hope you die",
    ].map(spaced),
  ];
  const hatred =
    /\b(?:odio|exterminar|matar|malditos|fuera|expulsen)\b(?:\s+[a-z]+){0,4}\s+(?:migrantes|inmigrantes|judios|musulmanes|homosexuales|lesbianas|negros|indigenas|mujeres|discapacitados|mexicanos)\b/;
  const discrimination = [
    sequence(
      [
        "noatiendan",
        "nosirvan",
        "nocontraten",
        "nosenecesitan",
        "nonecesitamos",
      ],
      ["a", "alos", "alas", "aestos", "aestas"],
      [
        "migrantes",
        "inmigrantes",
        "judios",
        "musulmanes",
        "homosexuales",
        "lesbianas",
        "negros",
        "indigenas",
        "discapacitados",
      ],
    ),
  ];
  function threatFound(value) {
    return threats.some((rule) => {
      let offset = 0;
      while (offset < value.length) {
        const match = rule.exec(value.slice(offset));
        if (!match) return false;
        const start = offset + match.index;
        // Una negación no autoriza amenazas posteriores en el mismo comentario.
        const prefix = value.slice(Math.max(0, start - 50), start);
        if (
          !/\b(?:no(?:\s+(?:quiero|queremos|deseo|esperamos|espero|te|los|las|les))?|evitar)\s*$/.test(
            prefix,
          )
        )
          return true;
        offset = start + Math.max(1, match[0].length);
      }
      return false;
    });
  }
  function check(text) {
    const value = normalize(text),
      phrase = value.replace(/[^a-z]+/g, " ");
    let code = "";
    if (harmfulImperative(value) || threatFound(value)) code = "THREAT";
    else if (
      hateRules.some((r) => r.test(value)) ||
      hatred.test(phrase) ||
      discrimination.some((r) => r.test(value))
    )
      code = "HATE_SPEECH";
    else if (
      insultRules.some((r) => r.test(value)) ||
      personalAttacks.some((r) => r.test(value)) ||
      sexualAbuse.some((r) => r.test(value))
    )
      code = "OFFENSIVE_LANGUAGE";
    return code
      ? { allowed: false, code, message }
      : { allowed: true, code: "", message: "" };
  }
  function assertAllowed(text) {
    const result = check(text);
    if (!result.allowed) {
      const error = Error(result.message);
      error.status = 400;
      error.code = result.code;
      throw error;
    }
  }
  return Object.freeze({ check, assertAllowed });
});
