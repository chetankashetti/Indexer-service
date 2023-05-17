# Indexer-service
A blockchain indexer which scans each and every block and stores all details.
The service indexes data from FROM_BLOCK to TO_BLOCK and exposes api for transactions of an address. 

# How to Run
Provide these values in the .env file.
NODE_ENDPOINT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=


# Use the below command to run
node index.js

# System Architecture
<img width="758" alt="Screenshot 2023-05-17 at 10 30 27 PM" src="https://github.com/chetankashetti/Indexer-service/assets/24208057/de51e48a-df6e-4101-ac4c-9150b3078b76">
