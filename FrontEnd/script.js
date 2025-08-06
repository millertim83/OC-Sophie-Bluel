const gallery = document.getElementById("gallery");
let allWorks = [];
const filtersContainer = document.getElementById("filters");


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
            allBtn.classList.add("active");
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
            filterButtons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

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

// Populate Thumbnails //
function populateModalGallery() {
    modalGallery.innerHTML = "";

    allWorks.forEach(work => {
        //container for image and delete icon
        const thumbContainer = document.createElement("div");
        thumbContainer.classList.add("thumbnail-container");

        //create image
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        //create delete icon
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
        deleteIcon.addEventListener("click", () => {
            console.log(`Delete item with ID: ${work.id}`);
        });

        //assemble
        thumbContainer.appendChild(img);
        thumbContainer.appendChild(deleteIcon);
        modalGallery.appendChild(thumbContainer);
        
    });
}


fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        allWorks = works;
        renderGallery(works);
    });

addFilterButtons();

const token = localStorage.getItem("token");
const authLink = document.getElementById("auth-link");
const editButton = document.getElementById("edit-button");

if (token) {
    //Hide filters
    const filtersContainer = document.getElementById("filters");
    if (filtersContainer) {
        filtersContainer.style.display = "none";
    }
    //Show logout
    authLink.textContent = "logout";
    authLink.href = "#";
    authLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.reload(); 
    });
    //Show edit button
    if (editButton) {
        editButton.style.display = "inline-block";
    }
    
} else {
    authLink.textContent = "login";
    authLink.href = "login.html";
    editButton.style.display = "none";
}

//***  Modal   ***//

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const modalGallery = document.getElementById("modal-gallery");





editButton.addEventListener("click", () => {
    //Open modal
    modal.style.display = "block";
    populateModalGallery(allWorks);
});

modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});









