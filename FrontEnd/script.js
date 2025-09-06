let allWorks = [];
const gallery = document.getElementById("gallery");
const filtersContainer = document.getElementById("filters");
const token = localStorage.getItem("token");
const authLink = document.getElementById("auth-link");
const editButton = document.getElementById("edit-button");
const addPhotoBtn = document.getElementById("add-photo-btn");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const modalGallery = document.getElementById("modal-gallery");


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
        button.addEventListener("click", () => {
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
        deleteIcon.addEventListener("click", async (e) => {
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

        // assemble
        thumbContainer.appendChild(img);
        thumbContainer.appendChild(deleteIcon);
        modalGallery.appendChild(thumbContainer);
    });

    // Add divider line
    const galleryActions = document.getElementById("gallery-actions");
    if (!galleryActions.previousElementSibling || 
        !galleryActions.previousElementSibling.classList.contains("modal-divider")) {
        
        const divider = document.createElement("hr");
        divider.classList.add("modal-divider");
        galleryActions.parentNode.insertBefore(divider, galleryActions);
    }
}

function renderAddPhotoForm() {
    // clear gallery
    modalGallery.innerHTML = "";
    addPhotoBtn.style.display = "none";
    
    // Upload box for selecting image
    const uploadBox = document.createElement("div");
    uploadBox.classList.add("upload-box");
    
    // generic image icon 
    const imageIcon = document.createElement("i");
    imageIcon.classList.add("fa-regular", "fa-image", "upload-icon");

    //preview image
    const previewImg = document.createElement("img");
    previewImg.classList.add("preview-img");
    previewImg.style.display = "none;"
    
    // input[type=file] hidden, triggered by button
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png, image/jpeg";
    fileInput.style.display = "none";
    
    // Add photo button
    const fileBtn = document.createElement("button");
    fileBtn.type = "button";
    fileBtn.textContent = "+ Add photo";
    fileBtn.classList.add("button");
    fileBtn.id = "add-photo-UI-btn";
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
                fileBtn.style.display = "none";
                fileInfo.style.display = "none";
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
    
    // First add a placeholder option
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select category";
    categorySelect.appendChild(placeholder);
    
    // Fetch categories from API
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories => {
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;  // the API ID
                option.textContent = cat.name; // display name
                categorySelect.appendChild(option);
            });
        })
        .catch(err => console.error("Failed to load categories:", err));
    
    
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(categoryLabel);
    form.appendChild(categorySelect);

    // Creater divider
    const divider = document.createElement("hr");
    divider.classList.add("modal-divider");

    // Confirm button
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.textContent = "Confirm";
    confirmBtn.classList.add("button", "confirm-btn");
    confirmBtn.disabled = true;

    // Validate form
    function validateAddPhotoForm() {
        const hasImage = previewImg && previewImg.src && previewImg.src !== "";
        const hasTitle = titleInput.value.trim() !== "";
        const hasCategory = categorySelect.value !== "";
    
        confirmBtn.disabled = !(hasImage && hasTitle && hasCategory)
    }

    // Confirm event listeners for validation
    titleInput.addEventListener("input", validateAddPhotoForm);
    categorySelect.addEventListener("change", validateAddPhotoForm);

    confirmBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            await addPhotoToAPI();
            console.log("Photo added successfully");
        } catch (err) {
            console.error("Error adding photo:", err);
        }
    });
    
    // Add everything to modal
    const addPhotoContainer = document.getElementById("add-photo-container");
    addPhotoContainer.innerHTML = "";
    addPhotoContainer.appendChild(uploadBox);
    addPhotoContainer.appendChild(form);
    addPhotoContainer.appendChild(divider);
    addPhotoContainer.appendChild(confirmBtn);
    
}

async function addPhotoToAPI() {
    const container = document.getElementById("add-photo-container");
    const fileInput = container.querySelector('input[type="file"]');
    const titleInput = container.querySelector('input[name="title"]');
    const categorySelect =  container.querySelector('select[name="category"]');

    // Require form be filled out completely
    if (!fileInput.files[0]) return alert("Please select a file.");
    if (!titleInput.value) return alert("Please enter a title.");
    if (!categorySelect.value || categorySelect.value === "select category") 
        return alert("Please select a category.");

    // Assemble form
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Photo added:", data);

            allWorks.push(data);
            populateModalGallery(allWorks);
            renderGallery(allWorks);
            modal.style.display = "none";
        } else {
            console.error("Failed to add photo:", response.status);
        }
    } catch (error) {
        console.error("Error adding photo:", error);
    }
}

//Fetch Works
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        allWorks = works;
        renderGallery(works);
    });

addFilterButtons();

//EVENT LISTENERS

// Check for token
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
editButton.addEventListener("click", () => {
    //Open modal
    modal.style.display = "block";
    document.getElementById("gallery-view").style.display = "block";
    document.getElementById("add-photo-view").style.display = "none";
    populateModalGallery(allWorks);
    addPhotoBtn.style.display = "block";
});

// Close modal
modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Add Photo UI
addPhotoBtn.addEventListener("click", () => {
    const galleryView =  document.getElementById("gallery-view");
    galleryView.style.display = "none";

    const addPhotoView = document.getElementById("add-photo-view");
    addPhotoView.style.display = "flex";

    const addPhotoContainer = document.getElementById("add-photo-container");
    addPhotoContainer.innerHTML = "";
    renderAddPhotoForm();
});

// Back button
document.getElementById("back-to-gallery").addEventListener("click", async (event) => {
   const galleryView = document.getElementById("gallery-view");
    const addPhotoView = document.getElementById("add-photo-view");

    addPhotoView.style.display = "none";
    galleryView.style.display = "block";
    addPhotoBtn.style.display = "block";

    await populateModalGallery();
    
  });
  
















