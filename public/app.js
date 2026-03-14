const input = document.getElementById("query");
const list = document.getElementById("results");

let timerId = -1;
const debounceMs = 300;

input.addEventListener("input", async () => {
  clearTimeout(timerId);
  const query = input.value.trim();
  if (!query) {
    list.innerHTML = "";
    return;
  }
  timerId = setTimeout(async () => {
    const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
    const { results } = await res.json();

    list.innerHTML = results.map((result) => `<li>${result}</li>`).join("");
  }, debounceMs);
});
