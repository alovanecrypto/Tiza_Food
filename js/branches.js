(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FoodBranches = factory();
})(typeof globalThis === "undefined" ? this : globalThis, () => {
  // Puntos de referencia de las zonas, utilizados para la asignación aproximada.
  const catalog = [
    {
      name: "Sucursal Centro",
      zone: "Centro, Tizayuca, Hidalgo",
      postalCode: "43800",
      coords: "19.84149,-98.98037",
      km: 0.8,
    },
    {
      name: "Sucursal Haciendas",
      zone: "Haciendas de Tizayuca, Hidalgo",
      postalCode: "43815",
      coords: "19.874116,-98.959582",
      km: 2.4,
    },
    {
      name: "Sucursal El Carmen",
      zone: "El Carmen, Hueypoxtla, Estado de México",
      postalCode: "55694",
      coords: "19.889197,-98.955556",
      km: 3.9,
    },
    {
      name: "Sucursal Parque Hidalgo",
      zone: "Parque Hidalgo, Tizayuca, Hidalgo",
      postalCode: "43808",
      coords: "19.840996,-98.981009",
      km: 0.8,
    },
  ];
  // Promedios de coordenadas por código postal en Tizayuca y Hueypoxtla.
  // GeoNames (CC BY 4.0), https://download.geonames.org/export/zip/
  const postalPoints = new Map(
    Object.entries({
      43802: "19.85670,-98.96470",
      43803: "19.83255,-98.95155",
      43804: "19.84485,-98.96865",
      43806: "19.84485,-98.96865",
      43807: "19.84475,-98.96340",
      43810: "19.85927,-98.94670",
      43816: "19.86060,-98.94380",
      43820: "19.83195,-98.95850",
      43823: "19.84660,-98.95440",
      43824: "19.85038,-98.92810",
      43825: "19.87960,-98.92690",
      43826: "19.84810,-98.95545",
      55670: "19.91300,-99.07380",
      55673: "19.90700,-99.05485",
      55676: "19.93440,-99.05340",
      55679: "19.97165,-99.04445",
      55680: "20.00170,-99.01400",
      55684: "19.98500,-99.00310",
      55685: "20.02010,-98.99310",
      55689: "20.00170,-99.01400",
      55690: "19.86890,-99.06190",
      55697: "19.86890,-99.06190",
    }),
  );
  for (const branch of catalog)
    postalPoints.set(branch.postalCode, branch.coords);
  function coordinates(value) {
    if (
      typeof value !== "string" ||
      !/^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(value)
    )
      return null;
    const [lat, lng] = value.split(",").map(Number);
    return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
  }
  function nearest(point) {
    if (!point) return null;
    const radians = (value) => (value * Math.PI) / 180;
    let selected = null;
    for (const [index, branch] of catalog.entries()) {
      const location = coordinates(branch.coords);
      const arc =
        Math.sin(radians(location.lat - point.lat) / 2) ** 2 +
        Math.cos(radians(point.lat)) *
          Math.cos(radians(location.lat)) *
          Math.sin(radians(location.lng - point.lng) / 2) ** 2;
      const km = 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, arc)));
      if (!selected || km < selected.km) selected = { index, branch, km };
    }
    return selected;
  }
  function postalCode(address) {
    const matches = String(address || "").match(/\b\d{5}\b/g);
    return matches?.at(-1) || "";
  }
  function byPostalCode(code) {
    const selected = nearest(coordinates(postalPoints.get(String(code))));
    return selected && { ...selected, source: "postal" };
  }
  function forAddress(destination, customer) {
    const address = String(
      destination?.text || destination?.address || "",
    ).trim();
    const primary =
      address && address === String(customer?.address || "").trim();
    const code =
      (primary && customer?.addressParts?.postalCode) || postalCode(address);
    return nearest(coordinates(destination?.coords)) || byPostalCode(code);
  }
  function forOrder(order) {
    if (coordinates(order.branchLocation?.coords)) return order.branchLocation;
    return (
      catalog.find((branch) => branch.name === order.branch) || {
        name: order.branch || "Tiza Food",
        zone: "Tizayuca, Hidalgo",
      }
    );
  }
  function addressQuery(address) {
    const text = String(address || "");
    return /\bméxico\s*$/i.test(text)
      ? text
      : /tizayuca|hueypoxtla|el carmen|\b556\d{2}\b/i.test(text)
        ? text + ", México"
        : text + ", Tizayuca, Hidalgo, México";
  }
  const deliveryFee = (branch) => Math.round(15 + branch.km * 5);
  return {
    catalog,
    byPostalCode,
    forAddress,
    forOrder,
    addressQuery,
    deliveryFee,
  };
});
