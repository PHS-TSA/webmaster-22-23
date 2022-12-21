const container = document.getElementById("importmap");
const script = document.createElement("script");
script.setAttribute("type", "importmap");
script.innerHTML = `{
    "imports": {
      "@popperjs/core": "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js",
      "bootstrap": "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.esm.min.js"
    }`;
var contain = container.appendChild(script);
