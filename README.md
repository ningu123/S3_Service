# S3_Service
## Overview

This repository contains a Node.js application that emulates the basic functionality of AWS S3. It allows users to manage buckets and upload/download files. The service relies on a PostgreSQL database for user data storage and access key validation.

## Prerequisites

Before getting started, ensure you have the following prerequisites installed:

1. **Node.js**: Ensure you have Node.js installed. You can download it from the [official website](https://nodejs.org/).

2. **PostgreSQL (psql)**: Install PostgreSQL from the [official website](https://www.postgresql.org/download/).

3. **Configuration File**: Update a `config.json` in config folder file in the project directory with your 
PostgreSQL connection details:

   ```json
   {
     "db_postgres": {
       "user": "your_username",
       "host": "localhost",
       "database": "your_database_name",
       "password": "your_password",
       "port": 5432
     }
   }


### Create Database Tables

Before you can use the S3-Like Service, you need to create the necessary database tables. Use the following SQL queries to create the tables for user data, buckets, and files. Replace `your_username` and `your_database_name` with your actual PostgreSQL credentials as configured in the `config.json` file:

1. Create a table for user, buckets and files data:

```sql

CREATE TABLE usermanagement (
    user_id SERIAL PRIMARY KEY,
    access_key VARCHAR UNIQUE,
    user_name VARCHAR,
expiry boolean
);
CREATE TABLE buckets (
    bucket_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    bucket_name VARCHAR,
    UNIQUE(user_id, bucket_name),
    FOREIGN KEY (user_id) REFERENCES usermanagement(user_id)
);
CREATE TABLE files (
   file_id SERIAL PRIMARY KEY,
   bucket_id INT NOT NULL,
file_name varchar,
   path varchar, 
type varchar,
   FOREIGN KEY (bucket_id) REFERENCES buckets(bucket_id)
);
```
4. **Start The Project** : To run the project, navigate to the "S3_Service" folder and enter the following command in your terminal
```
node app
```
## Endpoints and Usage

### Register a User

Endpoint: `localhost:3000/register`

- **Description**: Register a new user and obtain an access key.

- **Usage**:
  - Send a POST request to `/register` with the following JSON data:
    ```json
    {
      "userName": "your_username"
    }
    ```
  - After a successful registration, the response will include an access key, which you will need for other endpoints.

### Create a Bucket

Endpoint: `localhost:3000/bucket/create`

- **Description**: Create a new bucket.

- **Usage**:
  - Send a POST request to `/bucket/create` with the following JSON data:
    ```json
    {
      "bucketName": "your_bucket_name"
    }
    ```
  - Include the access key in the query parameter: `?accessKey=your_access_key`.

### List All Buckets

Endpoint: `localhost:3000/bucket/get/all`

- **Description**: Retrieve a list of all buckets associated with your user.

- **Usage**:
  - Send a GET request to `/bucket/get/all` with the access key in the query parameter: `?accessKey=your_access_key`.

### Get Bucket by ID

Endpoint: `localhost:3000/bucket/get`

- **Description**: Retrieve a specific bucket by its ID.

- **Usage**:
  - Send a GET request to `/bucket/get` with the access key and bucket ID in the query parameters:
    `?accessKey=your_access_key&bucketId=your_bucket_id`.

### Update a Bucket

Endpoint: `localhost:3000/bucket/update`

- **Description**: Update the name of an existing bucket.

- **Usage**:
  - Send a PUT request to `/bucket/update` with the following JSON data, specifying the old and new bucket names and including the access key in the query parameter:
    ```json
    {
      "bucketName": "your_old_bucket_name",
      "newBucketName": "your_new_bucket_name"
    }
    ```
  - Include the access key in the query parameter: `?accessKey=your_access_key`.
  
  - The response will indicate whether the bucket name was updated successfully.

This endpoint allows users to change the name of an existing bucket. The `bucketName` field specifies the current name of the bucket, and the `newBucketName` field specifies the desired new name.
### Delete a Bucket

Endpoint: `localhost:3000/bucket/delete`

- **Description**: Delete a bucket by its ID.

- **Usage**:
  - Send a DELETE request to `/bucket/delete` with the access key and bucket ID in the query parameters:
    `?accessKey=your_access_key&bucketId=your_bucket_id`.

### Upload Files

Endpoint: `localhost:3000/files/upload`

- **Description**: Upload files to a specific bucket.

- **Usage**:
  - Send a POST request to `/files/upload` with a `multipart/form-data` request. Include the file(s) to upload, the bucket name, and the access key in the query parameters:
    `?accessKey=your_access_key&bucketName=your_bucket_name`.

### List All Files in a Bucket

Endpoint: `localhost:3000/files/get/all`

- **Description**: Retrieve a list of all files in a specific bucket.

- **Usage**:
  - Send a GET request to `/files/get/all` with the access key and bucket name in the query parameters:
    `?accessKey=your_access_key&bucketName=your_bucket_name`.

### Delete a File

Endpoint: `localhost:3000/files/delete`

- **Description**: Delete a file from a bucket.

- **Usage**:
  - Send a DELETE request to `/files/delete` with the access key, bucket name, and file name in the query parameters:
    `?accessKey=your_access_key&bucketName=your_bucket_name&fileName=your_file_name`.

### Download a File

Endpoint: `localhost:3000/download/:fileName`

- **Description**: Download a specific file.

- **Usage**:
  - Access the file for download by visiting `/download/your_file_name`. The file will be downloaded in the browser.

Remember to replace `your_username`, `your_access_key`, `your_bucket_name`, `your_bucket_id`, and `your_file_name` with actual values.

These endpoints provide the core functionality of the S3-Like Service, allowing you to manage buckets and files. You can use these endpoints to interact with the service as needed for your application.

For more details and comprehensive information, refer to the detailed README in the repository.
