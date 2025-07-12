const gallery = document.getElementById("gallery");

fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(works => {
    works.forEach(work => {
      // Create elements
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const caption = document.createElement("figcaption");
      caption.textContent = work.title;

      // Assemble and append
      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });
  })
  .catch(error => {
    console.error("Error loading gallery:", error);
    gallery.innerHTML = "<p>Failed to load portfolio items.</p>";
  });
