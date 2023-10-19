const express = require('express');
const router = express.Router();
const bucketService = require('../service/bucket_service');
const { checkBucketCredential } = require('../middleware/bucket_validation');

// Route for creating a new bucket
router.post("/create", checkBucketCredential(), async (req, res) => {
    await bucketService.createBucket(req, res);
});

// Route for getting a specific bucket
router.get("/get", async (req, res) => {
    await bucketService.getBucket(req, res);
});

// Route for getting all buckets
router.get("/get/all", async (req, res) => {
    await bucketService.getALLBuckets(req, res);
});

// Route for deleting a bucket
router.delete("/delete", async (req, res) => {
    await bucketService.deleteBucket(req, res);
});

// Route for update a bucket
router.put("/update",checkBucketCredential(), async (req, res) => {
    await bucketService.updateBucket(req, res);
});

module.exports = router;
