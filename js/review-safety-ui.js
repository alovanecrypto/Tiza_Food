(() => {
  const forms = {
    rvText: { message: "rvModerationMessage", button: "btnSendReview" },
    deliveryRatingComment: {
      message: "deliveryModerationMessage",
      button: "saveDeliveryRating",
    },
  };
  function check(id) {
    const config = forms[id],
      input = document.getElementById(id),
      button = document.getElementById(config.button);
    const result = window.FoodReviewModeration.check(input.value);
    document.getElementById(config.message).textContent = result.message;
    input.setAttribute("aria-invalid", String(!result.allowed));
    button.disabled = !result.allowed || button.dataset.submitting === "true";
    return result.allowed;
  }
  for (const id of Object.keys(forms))
    document.getElementById(id).addEventListener("input", () => check(id));
  window.FoodReviewSafety = { check };
})();
