// Add interactivity to the navButton
const navButton = document.querySelector(".nav--btn");
const navContainer = document.querySelector(".nav--container");
navButton.addEventListener("click", () => {
  navContainer.classList.toggle("open");
});
// Open if hovering container or child elements
navContainer.addEventListener("pointerover", (e) => {
  if (e.pointerType !== "mouse") return;
  navContainer.classList.add("open");
});
// Close if hovering outside of container
navContainer.addEventListener("pointerout", (e) => {
  if (e.pointerType !== "mouse") return;
  navContainer.classList.remove("open");
});
