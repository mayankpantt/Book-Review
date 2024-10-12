document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display reviews on the home page
    if (window.location.pathname.endsWith('index.html')) {
        fetchReviews();
        initializeSwiper();
    }

    // Handle review form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const reviewId = urlParams.get('id');

        if (reviewId) {
            // We're in edit mode
            populateForm(reviewId);
            document.getElementById('submitButton').style.display = 'none';
            document.getElementById('updateButton').style.display = 'block';
            document.getElementById('updateButton').addEventListener('click', handleReviewUpdate);
        } else {
            // We're in create mode
            reviewForm.addEventListener('submit', handleReviewFormSubmit);
        }
    }

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // Handle search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
});

async function populateForm(reviewId) {
    const response = await fetch(`/reviews`);
    const reviews = await response.json();
    console.log('Fetched reviews:', reviews); // Debug log
    const review = reviews.find(review => review.id === parseInt(reviewId));

    if (review) {
        console.log('Populating form with review:', review); // Debug log
        document.getElementById('reviewId').value = review.id;
        document.getElementById('title').value = review.title;
        document.getElementById('author').value = review.author;
        document.getElementById('review').value = review.review;
    } else {
        console.error('Review not found for ID:', reviewId); // Debug log
    }
}


async function handleReviewUpdate(event) {
    event.preventDefault();
    const reviewId = parseInt(document.getElementById('reviewId').value);
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const reviewText = document.getElementById('review').value;
    const cover = document.getElementById('cover').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('review', reviewText);
    if (cover) {
        formData.append('cover', cover);
    }

    await fetch(`/reviews/${reviewId}`, {
        method: 'PUT',
        body: formData,
    });
    alert('Review updated successfully!');
    window.location.href = 'index.html';
}

async function fetchReviews() {
    // Fetch reviews from the backend and display them
    const response = await fetch('/reviews');
    const reviews = await response.json();
    displayReviews(reviews);
}

function displayReviews(reviews) {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML = ''; // Clear existing slides
    reviews.forEach(review => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="card">
                <img src="${review.cover || 'default-cover.jpg'}" alt="${review.title}" onerror="this.onerror=null;this.src='default-cover.jpg';">
                <h3>${review.title}</h3>
                <p>by ${review.author}</p>
                <p>${review.review}</p>
                <div class="button-group">
                    <button onclick="editReview(${review.id})">Edit</button>
                    <button onclick="deleteReview(${review.id})">Delete</button>
                </div>
            </div>
        `;
        swiperWrapper.appendChild(slide);
    });
}

function initializeSwiper() {
    new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

async function handleReviewFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const review = document.getElementById('review').value;
    const cover = document.getElementById('cover').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('review', review);
    if (cover) {
        formData.append('cover', cover);
    }

    await fetch('/reviews', {
        method: 'POST',
        body: formData,
    });

    window.location.href = 'index.html';
}

// async function handleContactFormSubmit(event) {
//     event.preventDefault();
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const message = document.getElementById('message').value;

//     // Send email using backend service (e.g., Nodemailer, EmailJS)
//     const response = await fetch('/send-email', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ name, email, message })
//     });

//     const data = await response.json();
//     if (data.success) {
//         alert('Email sent successfully!');
//     } else {
//         alert('Failed to send email.');
//     }
// }

let debounceTimer;

async function handleSearchInput(event) {
    const query = event.target.value.toLowerCase();

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        const response = await fetch('/reviews');
        const reviews = await response.json();
        const filteredReviews = reviews.filter(review => review.title.toLowerCase().includes(query));
        displayReviews(filteredReviews);
        initializeSwiper(); // Reinitialize Swiper to update the slider
    }, 300); // Adjust the delay (300ms) as necessary
}




async function editReview(id) {
    const response = await fetch(`/reviews`);
    const reviews = await response.json();
    const review = reviews.find(review => review.id === id);
    console.log('Editing review with ID:', id);

    if (review) {
        // Redirect to the form page with the review ID as a query parameter
        window.location.href = `form.html?id=${id}`;
    } else {
        alert('Review not found.');
    }
}


async function deleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        await fetch(`/reviews/${id}`, {
            method: 'DELETE'
        });
        window.location.reload();
    }
}
