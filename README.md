**BOOK REVIEW SUBMISSION WEBSITE:**

This is a simple web application that allows users to submit book reviews. The application consists of a form for submitting reviews, a home page for displaying reviews, and a backend server for storing and retrieving reviews.

**Features**

- Users can submit book reviews with a title, author, review text, and optional book cover image.
- Reviews are displayed on the home page in a swiper carousel.
- Users can edit and delete their own reviews.
- The application uses a backend server to store and retrieve reviews.

**Requirements**

- Node.js (version 14 or higher)
- Express.js (version 4 or higher)
- Multer (version 1 or higher)
- Swiper (version 6 or higher)

**Setup**

- Clone the repository
- Install dependencies
- Start the server: node server.js
- Open the application in your web browser: <http://localhost:3000>




**Usage**

- Submit a review: Fill out the form on the submit review page (http://localhost:3000/form.html) and click the "Submit" button.
- View reviews: Go to the home page (http://localhost:3000/index.html) to view all submitted reviews.
- Edit a review: Click the "Edit" button on a review to edit it.
- Delete a review: Click the "Delete" button on a review to delete it.

**API Endpoints**

- GET /reviews: Retrieve all reviews.
- POST /reviews: Create a new review.
- PUT /reviews/:id: Update a review.
- DELETE /reviews/:id: Delete a review.

**File Structure**

- server.js: The backend server code.
- form.html: The submit review form page.
- index.html: The home page for displaying reviews.
- scripts.js: The frontend JavaScript code.
- styles.css: The CSS styles for the application.
- reviews.json: The file for storing reviews (created automatically by the server).
