const express = require('express');
const router = express.Router();
const filesService = require('../service/files_service');

// Route for uploading a file
router.post("/upload", filesService.checkBucket, filesService.singleupload().single("myFiles"), async (req, res) => {
    await filesService.uploadFiles(req, res);
});

// Route for getting all files
router.get("/get/all", async (req, res) => {
    await filesService.getALLFiles(req, res);
});

// Route for deleting a file
router.delete("/delete", async (req, res) => {
    await filesService.deleteFiles(req, res);
});

module.exports = router;
