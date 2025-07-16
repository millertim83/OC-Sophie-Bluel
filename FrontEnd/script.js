const gallery = document.getElementById("gallery");
let allWorks = [];
const filtersContainer = document.getElementById("filters");

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        allWorks = works;
        renderGallery(works);
    });

function renderGallery(works) {
    gallery.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        const caption = document.createElement("figcaption");
        caption.textContent = work.title;

        figure.appendChild(img)
        figure.appendChild(caption);
        gallery.appendChild(figure);
    });
    }

fetch("http://localhost:5678/api/categories") 
    .then(response => response.json())
    .then(categories => {
        const allBtn = document.createElement("button");
        allBtn.textContent = "All";
        filtersContainer.appendChild(allBtn);

        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            filtersContainer.appendChild(btn);
        })
    })


function filterCategory(category) {
    
}