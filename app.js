const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Importing necessary modules and services
const { registerUser } = require('./service/user_service');
const { verifyAccessKey, checkUserCredential } = require('./middleware/user_validation');
const { getPath } = require('./repository/files_repository');



// Endpoint to register a user
app.post('/register', checkUserCredential(), async (req, res) => {
    try {
        await registerUser(req, res);
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to download a file
app.get('/download/:fileName', async (req, res) => {
    try {
        const path = await getPath(req.params.fileName);

        if (!(path?.path)) {
            return res.status(404).send('File not found');
        }

        res.setHeader('Content-Disposition', `attachment; filename="${req.params.fileName}"`);
        const fileStream = fs.createReadStream(path?.path);

        fileStream.on('error', (err) => {
            res.status(500).send('Internal Server Error');
        });

        fileStream.pipe(res);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});



// Middleware for checking API key for all requests
app.use(verifyAccessKey);

// Importing routers for specific routes
const bucketRouter = require('./router/bucket_router');
const filesRouter = require('./router/files_router');

app.use('/bucket', bucketRouter);
app.use('/files', filesRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
