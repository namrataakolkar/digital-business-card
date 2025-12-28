document.getElementById("cardForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Clear previous error messages
    document.querySelectorAll('.error').forEach(function (span) {
        span.textContent = ""; // Clear error messages
    });

    // Get form values
    const name = document.getElementById("name").value.trim();
    const title = document.getElementById("title").value.trim();
    const company = document.getElementById("company").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim(); // Get address value
    const website = document.getElementById("website").value.trim();
    const description = document.getElementById("description").value.trim();
    const color = document.getElementById("color").value; // Get selected color

    // Validation flags
    let isValid = true;

    // Validate name (only alphabetic characters and spaces)
    const namePattern = /^[A-Za-z\s]+$/; // Allows only letters and spaces
    if (!name || !namePattern.test(name)) {
        isValid = false;
        document.getElementById("nameError").innerHTML = '<i class="fas fa-exclamation-circle"></i> Name is required and should only contain alphabetic characters.';
        document.getElementById("name").classList.add('error'); // Add error class
    }

    // Validate title (only alphabetic characters and spaces)
    const titlePattern = /^[A-Za-z\s]+$/; // Allows only letters and spaces
    if (!title || !titlePattern.test(title)) {
        isValid = false;
        document.getElementById("titleError").innerHTML = '<i class="fas fa-exclamation-circle"></i> Title is required and should only contain alphabetic characters.';
        document.getElementById("title").classList.add('error'); // Add error class
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
        isValid = false;
        document.getElementById("emailError").innerHTML = '<i class="fas fa-exclamation-circle"></i> A valid email is required.';
        document.getElementById("email").classList.add('error'); // Add error class
    }

    // Validate phone (exactly 10 digits)
    const phonePattern = /^\d{10}$/; // Allows only exactly 10 digits
    if (!phone || !phonePattern.test(phone)) {
        isValid = false;
        document.getElementById("phoneError").innerHTML = '<i class="fas fa-exclamation-circle"></i> A valid phone number is required (10 digits).';
        document.getElementById("phone").classList.add('error'); // Add error class
    }

    // Validate address
    if (!address) {
        isValid = false;
        document.getElementById("addressError").innerHTML = '<i class="fas fa-exclamation-circle"></i> Address is required.';
        document.getElementById("address").classList.add('error'); // Add error class
    }

    // Validate website (optional)
    if (website && !/^https?:\/\/[^\s]+$/.test(website)) {
        isValid = false;
        document.getElementById("websiteError").innerHTML = '<i class="fas fa-exclamation-circle"></i> A valid website URL is required (if provided).';
        document.getElementById("website").classList.add('error'); // Add error class
    }

    // Stop form submission if validation fails
    if (!isValid) {
        return } 

    // Handle profile picture
    const profilePictureInput = document.getElementById("profilePicture");
    const profileImage = document.getElementById("profileImage");
    let profileImageUrl = ""; // Initialize variable for profile image URL

    if (profilePictureInput.files && profilePictureInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profileImage.src = e.target.result; // Set the image source to the uploaded file
            profileImage.style.display = "block"; // Show the image
            profileImageUrl = e.target.result; // Use the base64 data URL for the QR code
        };
        reader.readAsDataURL(profilePictureInput.files[0]); // Read the uploaded file
    }

    const logoInput = document.getElementById("logo");
    const logoImage = document.getElementById("logoImage");
    let logoImageUrl = ""; // Initialize variable for logo image URL

    if (logoInput.files && logoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            logoImage.src = e.target.result; // Set the image source to the uploaded file
            logoImage.style.display = "block"; // Show the image
            logoImageUrl = e.target.result; // Use the base64 data URL for the QR code
        };
        reader.readAsDataURL(logoInput.files[0]); // Read the uploaded file
    }

    // Update the business card with the provided information
    document.getElementById("cardName").textContent = name;
    document.getElementById("cardTitle").textContent = title;
    document.getElementById("cardCompany").textContent = company; // Corrected line
    document.getElementById("cardEmail").querySelector('span').textContent = email; // Update only the span
    document.getElementById("cardPhone").querySelector('span').textContent = phone; // Update only the span
    document.getElementById("cardAddress").querySelector('span').textContent = address; // Update address
    document.getElementById("cardWebsite").querySelector('span').textContent = website; // Update only the span
    document.getElementById("cardDescription").textContent = description; // Corrected line

    // Set card color
    document.getElementById("card").style.backgroundColor = color; // Apply the selected color

    // Optionally, do not reset the form after submission
    profileImage.style.display = "none"; // Hide the profile image after submission

    // Generate QR code with updated vCard data
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${title}
COMPANY:${company}
EMAIL:${email}
TEL:${phone}
ADR:${address}
URL:${website}
DES:${description}
PHOTO;VALUE=URI:${profileImageUrl}
END:VCARD`;

    const qrCodeContainer = document.getElementById("qrcode");
    qrCodeContainer.innerHTML = ""; // Clear previous QR code

    const canvas = document.createElement("canvas");
    qrCodeContainer.appendChild(canvas);

    QRCode.toCanvas(canvas, vCardData, function (error) {
        if (error) console.error(error);
    });
});

document.getElementById("downloadButton").addEventListener("click", function () {
    const cardElement = document.getElementById("card");

    // Scroll to top to avoid canvas cut-off issues
    window.scrollTo(0, 0);

    html2canvas(cardElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // Higher resolution
    }).then(canvas => {
        const dataURL = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "business_card.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(err => {
        console.error("Error capturing card:", err);

        alert("Card downloaded! You can now share it manually via WhatsApp.");

    });
});

