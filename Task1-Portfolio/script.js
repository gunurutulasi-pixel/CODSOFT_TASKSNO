// Mobile Navigation Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu on link click for mobile view
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Contact Form Validation & Submission Feedback
const contactForm = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if(name === "" || email === "" || message === "") {
        formMsg.style.color = "#dc2626";
        formMsg.textContent = "Please fill out all fields before submitting.";
    } else {
        formMsg.style.color = "#16a34a";
        formMsg.textContent = "Thank you! Your message has been sent successfully.";
        contactForm.reset();
    }
});

// Resume Download Simulation Button
document.getElementById('download-resume').addEventListener('click', (e) => {
    e.preventDefault();
    alert("Resume download triggered! (You can attach a real PDF file path here later).");
});