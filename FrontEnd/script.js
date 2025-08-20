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
        deleteIcon.addEventListener("click", async () => {
            try {
                const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method: "DELETE",
                    headers: {
                        "accept": "*/*",
                        "Authorization": "Bearer " + localStorage.getItem("token") // use stored token
                    }
                });
        
                if (response.ok) {
                    // remove from UI
                    thumbContainer.remove();
        
                    // update local array
                    allWorks = allWorks.filter(w => w.id !== work.id);
        
                    console.log(`Work with ID ${work.id} deleted successfully`);
                } else {
                    console.error("Failed to delete:", response.status);
                }
            } catch (err) {
                console.error("Error deleting work:", err);
            }
        });
        

        //assemble
        thumbContainer.appendChild(img);
        thumbContainer.appendChild(deleteIcon);
        modalGallery.appendChild(thumbContainer);
    });
}


function renderAddPhotoForm() {
    // clear gallery
    modalGallery.innerHTML = "";
    
    // --- Upload box ---
    const uploadBox = document.createElement("div");
    uploadBox.classList.add("upload-box");
    
    // generic image icon 
    const imageIcon = document.createElement("i");
    imageIcon.classList.add("fa-regular", "fa-image", "upload-icon");

    //preview image
    const previewImg = document.createElement("img");
    imageIcon.classList.add("preview-img");
    previewImg.style.display = "none;"
    
    // input[type=file] hidden, triggered by button
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png, image/jpeg";
    fileInput.style.display = "none";
    
    const fileBtn = document.createElement("button");
    fileBtn.type = "button";
    fileBtn.textContent = "+ Add photo";
    fileBtn.classList.add("button");
    fileBtn.addEventListener("click", () => fileInput.click());
    
    const fileInfo = document.createElement("p");
    fileInfo.textContent = "jpg, png: max 4 MB";

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                previewImg.src = e.target.result;
                previewImg.style.display = "block";
                imageIcon.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });
    
    uploadBox.appendChild(imageIcon);
    uploadBox.appendChild(previewImg);
    uploadBox.appendChild(fileBtn);
    uploadBox.appendChild(fileInput);
    uploadBox.appendChild(fileInfo);
    
    // --- Form ---
    const form = document.createElement("form");
    form.classList.add("add-photo-form");
    
    // Title input
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    
    // Category dropdown
    const categoryLabel = document.createElement("label");
    categoryLabel.textContent = "Category";
    const categorySelect = document.createElement("select");
    categorySelect.name = "category";
    ["Select category", "Objects", "Apartments", "Hotels & restauraunts"].forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.toLowerCase();
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
    
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(categoryLabel);
    form.appendChild(categorySelect);

    //Confirm button
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.textContent = "Confirm";
    confirmBtn.classList.add("button", "confirm-btn");

    confirmBtn.addEventListener("click", () => {
        console.log("Form submitted!");
    })
    
    // Add everything to modal
    modalGallery.appendChild(uploadBox);
    modalGallery.appendChild(form);
    modalGallery.appendChild(confirmBtn);
    
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
const addPhotoBtn = document.getElementById("add-photo-btn");

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

addPhotoBtn.addEventListener("click", () => {
    renderAddPhotoForm();
});











