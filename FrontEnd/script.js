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


function addFilterButtons() {
    fetch("http://localhost:5678/api/categories") 
        .then(response => response.json())
        .then(categories => {
            const allBtn = document.createElement("button");
            allBtn.textContent = "All";
            allBtn.classList.add("filter-button");
            allBtn.dataset.id = "";
            filtersContainer.appendChild(allBtn);

            categories.forEach(category => {
                const btn = document.createElement("button");
                btn.classList.add("filter-button");
                btn.textContent = category.name;
                btn.dataset.id = category.id;
                filtersContainer.appendChild(btn);
            });

            addFilterButtonEvents();
    });
}

function addFilterButtonEvents() {
    const filterButtons = document.querySelectorAll(".filter-button");
    filterButtons.forEach(button => {
        button.addEventListener("click", event => {
            const categoryId = button.dataset.id;

            if (!categoryId) {
                renderGallery(allWorks);
            } else {
                const filtered = allWorks.filter(work => work.categoryId == categoryId);
                renderGallery(filtered);
            }
        });
    });
}

addFilterButtons();


