/* Reseñas verificadas: la compra se comprueba con los pedidos del servidor. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Moderation = require("./review-moderation");
const Management = require("./management");
const email = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();
const shortName = (value) => {
  const words = String(value || "Cliente")
    .trim()
    .split(/\s+/);
  return (
    words[0] +
    (words.length > 1 ? " " + words[1].charAt(0).toUpperCase() + "." : "")
  );
};
function problem(message, status = 400) {
  const error = Error(message);
  error.status = status;
  throw error;
}
function requireCustomer(user) {
  if (!user) problem("Inicia sesión para escribir reseñas.", 401);
  if (user.role !== "cliente")
    problem("Solo los clientes pueden reseñar sus compras.", 403);
}
function requireStaff(user) {
  if (!user) problem("Inicia sesión.", 401);
  if (!["empleado", "dueno"].includes(user.role))
    problem("No tienes permiso para moderar reseñas.", 403);
}
function textField(value, min, max, label) {
  const text = typeof value === "string" ? value.trim() : "";
  if (
    text.length < min ||
    text.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)
  )
    problem(`${label} debe tener entre ${min} y ${max} caracteres.`);
  return text;
}
function assertPosting(data, user) {
  requireCustomer(user);
  if (data.reviewBlocks.some((block) => block.owner === email(user.email)))
    problem(
      "Tu cuenta está suspendida para publicar reseñas y calificaciones. Puedes seguir usando tus pedidos.",
      403,
    );
}
function targets(db, user) {
  const result = new Map();
  if (!user || user.role !== "cliente") return [];
  for (const order of db.orders || []) {
    if (
      email(order.owner) !== email(user.email) ||
      Management.statusOf(order) !== "Entregado"
    )
      continue;
    for (const item of order.items || []) {
      if (!item || !String(item.name || "").trim() || !(Number(item.qty) > 0))
        continue;
      const product =
        item.productId != null
          ? (db.products || []).find(
              (p) => String(p.id) === String(item.productId),
            )
          : (db.products || []).find((p) => p.name === item.name);
      const productId = product
        ? product.id
        : item.productId == null
          ? null
          : item.productId;
      const name = String(product ? product.name : item.name).trim();
      const key =
        productId != null ? "product:" + String(productId) : "name:" + name;
      const existing = result.get(key);
      if (existing) {
        if (!existing.orderFolios.includes(order.folio))
          existing.orderFolios.push(order.folio);
      } else
        result.set(key, {
          key,
          productId,
          product: name,
          orderFolios: [order.folio],
        });
    }
  }
  return [...result.values()];
}
function eligible(db, user, reviews) {
  const done = new Set(
    reviews
      .filter(
        (r) =>
          r.kind === "product" && email(r.owner) === email(user && user.email),
      )
      .map((r) => r.productKey),
  );
  return targets(db, user).filter((item) => !done.has(item.key));
}
function createProduct(db, user, body, reviews) {
  requireCustomer(user);
  if (body.kind && body.kind !== "product")
    problem("Califica la entrega desde tu pedido.");
  const product = targets(db, user).find((item) =>
    body.productKey
      ? item.key === body.productKey
      : body.productId != null
        ? String(item.productId) === String(body.productId)
        : item.product === body.product,
  );
  if (!product)
    problem("Solo puedes reseñar productos de tus pedidos entregados.", 403);
  if (body.orderFolio && !product.orderFolios.includes(body.orderFolio))
    problem("Ese producto no pertenece a tu pedido entregado.", 403);
  if (
    reviews.some(
      (r) =>
        r.kind === "product" &&
        email(r.owner) === email(user.email) &&
        r.productKey === product.key,
    )
  )
    problem("Ya escribiste una reseña de este producto.", 409);
  const stars = Number(body.stars),
    comment = typeof body.comment === "string" ? body.comment.trim() : "";
  if (
    !Number.isInteger(stars) ||
    stars < 1 ||
    stars > 5 ||
    comment.length < 5 ||
    comment.length > 220 ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(comment)
  )
    problem(
      "Elige de 1 a 5 estrellas y escribe un comentario de 5 a 220 caracteres.",
    );
  Moderation.assertAllowed(comment);
  return {
    id: crypto.randomUUID(),
    kind: "product",
    productKey: product.key,
    productId: product.productId,
    product: product.product,
    orderFolio: body.orderFolio || product.orderFolios[0],
    owner: email(user.email),
    user: shortName(user.name),
    stars,
    comment,
    date: new Date().toISOString(),
    verifiedPurchase: true,
  };
}
function deliveryReview(order) {
  const rating = order.deliveryRating;
  if (rating && !Moderation.check(rating.comment).allowed) return null;
  if (
    Management.statusOf(order) !== "Entregado" ||
    !rating ||
    !Number.isInteger(rating.stars) ||
    rating.stars < 1 ||
    rating.stars > 5 ||
    !email(order.owner)
  )
    return null;
  const date =
    Number.isFinite(rating.at) && rating.at > 0
      ? new Date(rating.at)
      : new Date();
  return {
    id: crypto.randomUUID(),
    kind: "delivery",
    product: "Entrega",
    orderFolio: order.folio,
    owner: email(order.owner),
    user: shortName(order.customer),
    stars: rating.stars,
    comment:
      String(rating.comment || "").slice(0, 300) ||
      "Calificación de la entrega: " + rating.stars + " de 5.",
    date: date.toISOString(),
    verifiedPurchase: true,
  };
}
function publicReview(review, viewer) {
  return {
    id: review.id,
    kind: review.kind,
    productKey: review.productKey || null,
    productId: review.productId == null ? null : review.productId,
    product: review.product,
    user: review.user,
    stars: review.stars,
    comment: review.comment,
    date: review.date,
    verifiedPurchase: true,
    mine: !!(viewer && email(viewer.email) === email(review.owner)),
    ...(review.editedAt ? { moderated: true } : {}),
  };
}
function store(directory, initialDB) {
  const file = path.join(directory, "resenas.json");
  function write(data) {
    try {
      fs.writeFileSync(file + ".tmp", JSON.stringify(data, null, 2), "utf8");
      fs.renameSync(file + ".tmp", file);
    } catch (error) {
      throw Error(
        "No se pudieron guardar las reseñas en data/resenas.json. Revisa los permisos de la carpeta data.",
      );
    }
  }
  function read() {
    try {
      const data = JSON.parse(
        fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""),
      );
      if (
        !data ||
        !Array.isArray(data.reviews) ||
        (data.legacyReviews !== undefined &&
          !Array.isArray(data.legacyReviews)) ||
        (data.reviewBlocks !== undefined && !Array.isArray(data.reviewBlocks))
      )
        throw Error("Formato inválido");
      return {
        ...data,
        legacyReviews: data.legacyReviews || [],
        reviewBlocks: data.reviewBlocks || [],
      };
    } catch (error) {
      throw Error(
        "No se pudo leer data/resenas.json. El archivo se conserva sin reemplazar tus reseñas.",
      );
    }
  }
  if (!fs.existsSync(file)) {
    const data = {
      reviews: [],
      legacyReviews: [],
      _info:
        "Reseñas verificadas de productos y entregas. El propietario y el folio son privados; la API muestra las reseñas a todas las cuentas.",
    };
    for (const legacy of initialDB.reviews || []) {
      try {
        if (
          legacy.kind === "delivery" ||
          String(legacy.product || "").startsWith("Entrega")
        )
          throw Error("Calificación histórica");
        const customer = {
          role: "cliente",
          email: legacy.owner,
          name:
            (initialDB.orders || []).find(
              (o) => email(o.owner) === email(legacy.owner),
            )?.customer || legacy.user,
        };
        const review = createProduct(initialDB, customer, legacy, data.reviews);
        review.date = legacy.date || review.date;
        data.reviews.push(review);
      } catch (error) {
        data.legacyReviews.push(legacy);
      }
    }
    write(data);
  }
  function syncDeliveries(db) {
    const data = read();
    let changed = false;
    for (const order of db.orders || []) {
      if (
        data.reviews.some(
          (r) =>
            r.kind === "delivery" &&
            r.orderFolio === order.folio &&
            email(r.owner) === email(order.owner),
        )
      )
        continue;
      const review = deliveryReview(order);
      if (review) {
        data.reviews.push(review);
        changed = true;
      }
    }
    if (changed) write(data);
    return data;
  }
  syncDeliveries(initialDB);
  return {
    public(db, viewer) {
      return syncDeliveries(db)
        .reviews.filter((r) => !r.hidden && Moderation.check(r.comment).allowed)
        .map((r) => publicReview(r, viewer))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    eligible(db, user) {
      const data = read();
      assertPosting(data, user);
      return eligible(db, user, data.reviews);
    },
    assertPosting(user) {
      assertPosting(read(), user);
    },
    create(db, user, body) {
      const data = read();
      assertPosting(data, user);
      const review = createProduct(db, user, body, data.reviews);
      data.reviews.push(review);
      write(data);
      return publicReview(review, user);
    },
    remove(user, id) {
      requireCustomer(user);
      const data = read(),
        review = data.reviews.find((r) => String(r.id) === id);
      if (!review) problem("La reseña ya no existe.", 404);
      if (email(review.owner) !== email(user.email))
        problem("Esa reseña pertenece a otra cuenta.", 403);
      if (review.kind !== "product")
        problem("La calificación de la entrega se conserva con el pedido.");
      if (review.hidden) problem("La reseña ya está retirada.", 409);
      data.reviews = data.reviews.filter((r) => String(r.id) !== id);
      write(data);
    },
    staffList(db, user) {
      requireStaff(user);
      const data = syncDeliveries(db);
      return {
        reviews: data.reviews
          .map((review) => ({
            ...publicReview(review),
            orderFolio: review.orderFolio,
            hidden: review.hidden === true,
            reason: review.moderation?.reason || "",
            suspended: data.reviewBlocks.some(
              (block) => block.owner === email(review.owner),
            ),
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)),
        blocks: data.reviewBlocks.map(({ id, user, reason, at }) => ({
          id,
          user,
          reason,
          at,
        })),
      };
    },
    moderate(user, id, body) {
      requireStaff(user);
      const data = read();
      const review = data.reviews.find((row) => row.id === id);
      if (!review) problem("Reseña no encontrada.", 404);
      if (!["edit", "hide", "restore", "suspend"].includes(body?.action))
        problem("Acción de moderación inválida.");
      const reason = textField(body.reason, 5, 240, "El motivo");
      const at = new Date().toISOString();
      if (body.action === "suspend") {
        if (!email(review.owner))
          problem("La reseña no está vinculada a una cuenta.");
        if (
          data.reviewBlocks.some((block) => block.owner === email(review.owner))
        )
          problem("Esta cuenta ya está suspendida para reseñar.", 409);
        data.reviewBlocks.push({
          id: crypto.randomUUID(),
          owner: email(review.owner),
          user: review.user,
          by: user.email,
          reason,
          at,
        });
      } else {
        if (body.action === "edit") {
          const comment = textField(
            body.comment,
            5,
            review.kind === "delivery" ? 300 : 220,
            "El comentario",
          );
          Moderation.assertAllowed(comment);
          review.originalComment ??= review.comment;
          review.comment = comment;
          review.editedAt = at;
        } else review.hidden = body.action === "hide";
        review.moderation = { action: body.action, reason, by: user.email, at };
      }
      write(data);
    },
    liftBlock(user, id) {
      requireStaff(user);
      const data = read();
      const index = data.reviewBlocks.findIndex((block) => block.id === id);
      if (index < 0) problem("No se encontró la suspensión.", 404);
      data.reviewBlocks.splice(index, 1);
      write(data);
    },
  };
}
module.exports = store;
module.exports.targets = targets;
