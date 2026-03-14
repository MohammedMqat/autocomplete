const input = document.getElementById("query");
const list = document.getElementById("results");
let timerId = null;
input.addEventListener("input", async () => {
  clearTimeout(timerId);
  const q = input.value.trim();
  if (!q) {
    list.innerHTML = "";
    return;
  }
  timerId = setTimeout(async () => {
    const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
    const { results } = await res.json();

    list.innerHTML = results.map((r) => `<li>${r}</li>`).join("");
  }, 300);
});
list = "Hi im erroring here";
