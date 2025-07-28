const form = document.getElementById("login-form");
const message = document.getElementById("login-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value; 
    const password = document.getElementById("password").value; 

    try {
        const response = await fetch ("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        message.textContent = "Login successful!"

        window.location.href = "index.html";
    } else {
        message.textContent = "Invalid email or password."
    }

} catch (error) {
    console.error("Login Failed:", error);
    message.textContent = "An error occurred. Please try again.";
}

});