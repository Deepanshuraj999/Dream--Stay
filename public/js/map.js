const mapDiv = document.getElementById("map");

if (!mapDiv) {
  console.error("Map div not found");
}

const coordinates = JSON.parse(mapDiv.dataset.coordinates);

// Leaflet → [lat, lng]
const lat = coordinates[1];
const lng = coordinates[0];

const map = L.map("map").setView([lat, lng], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  // attribution: "© OpenStreetMap contributors",
}).addTo(map);

L.marker([lat, lng])
  .addTo(map)
  .bindPopup("Bulandshahr Dream stay")
  .openPopup();

  const marker = new mapboxgl.Marker({
    color: "red",
  })
    .setLngLat([coordinates])
    .addTo(map);