const Branches = require("./branches");
const { catalogItems } = require("./management");
const { coordinates } = require("./delivery");

function normalize(body, db, customer) {
  const rawAddress = body.address ?? customer.address ?? "";
  if (typeof rawAddress !== "string")
    throw Error("Revisa la dirección de entrega.");
  const address = rawAddress.trim();
  if (address.length > 600 || /[\u0000-\u001f\u007f]/.test(address))
    throw Error("Revisa la dirección de entrega.");
  const coords = coordinates(body.coords) ? body.coords : null;
  const assigned = Branches.forAddress({ address, coords }, customer);
  const branch = assigned?.branch || Branches.catalog[0];
  const branchIdx = assigned?.index ?? 0;
  const items = catalogItems(body.items, db, branchIdx).map((item) =>
    typeof item.img === "string" && item.img.startsWith("data:")
      ? { ...item, img: "" }
      : item,
  );
  return {
    folio: body.folio,
    address,
    coords,
    items,
    branch: branch.name,
    branchIdx,
    branchLocation: {
      name: branch.name,
      zone: branch.zone,
      coords: branch.coords,
    },
    fee: Branches.deliveryFee(branch),
    deliveryNotes: body.deliveryNotes,
    couponCode: body.couponCode,
  };
}
module.exports = normalize;
