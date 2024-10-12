const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // Import the file system module
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const reviewsFilePath = path.join(__dirname, 'reviews.json');
let reviews = [];

// Load reviews from the JSON file on server start
fs.readFile(reviewsFilePath, (err, data) => {
    if (err) {
        console.error('Could not read reviews file:', err);
        reviews = []; // Initialize with an empty array if the file doesn't exist
    } else {
        reviews = JSON.parse(data); // Populate the reviews array with data from the file
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

function saveReviews() {
    fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), (err) => {
        if (err) {
            console.error('Could not save reviews:', err);
        }
    });
}

// Post new review
app.post('/reviews', upload.single('cover'), (req, res) => {
    const { title, author, review } = req.body;
    const reviewId = Date.now();
    const reviewData = {
        id: reviewId,
        title,
        author,
        review,
        cover: req.file ? req.file.path : null,
    };
    reviews.push(reviewData);
    saveReviews(); // Save to file
    res.status(201).send('Review saved');
});

// Get all reviews
app.get('/reviews', (req, res) => {
    res.json(reviews);
});

// Update review
app.put('/reviews/:id', upload.single('cover'), (req, res) => {
    const reviewId = parseInt(req.params.id);
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);

    if (reviewIndex !== -1) {
        const { title, author, review } = req.body;
        const updatedReview = {
            id: reviewId,
            title,
            author,
            review,
            cover: req.file ? req.file.path : reviews[reviewIndex].cover,
        };
        reviews[reviewIndex] = updatedReview;
        saveReviews(); // Save to file
        res.send('Review updated');
    } else {
        res.status(404).send('Review not found');
    }
});

// Delete review
app.delete('/reviews/:id', (req, res) => {
    const reviewId = parseInt(req.params.id);
    reviews = reviews.filter(review => review.id !== reviewId);
    saveReviews(); // Save to file
    res.send('Review deleted');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
