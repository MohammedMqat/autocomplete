const input = document.getElementById('query');
const list = document.getElementById('results');

input.addEventListener('input', async () => {
  const q = input.value.trim();
  if (!q) { list.innerHTML = ''; return; }

  const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
  const { results } = await res.json();

  list.innerHTML = results.map(r => `<li>${r}</li>`).join('');
});
