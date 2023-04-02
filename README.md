## Description

This code is for converting csv to database 

## Prerequisit
Each row in csv should have delimeter as "," (Comma)

Below are the fields which has been consider as CSV columns 
1. name.firstName 
2. name.lastName
3. age
4. address.xxxx *anything under address would be mapped under address as json format into postgres table*
5. additional_info.xxx *anything apart from name, address, and age would be added in this column as json format *

*Mandatory field are name, age, if csv doesn't have these values progress would eventaully break*


## Requirement
1. Postgres Local database
2. Nodejs v18.x.x

## Installation
1. Take checkout of project 
2. Navigate to this project and install using *npm install*
3. Setup and install postgres on local machine
4. Create database name *public*
5. Run project using *npm start*


## There are 2 ways to execute this program
1. CSV is present in csv folder with 2 sample examples
2. Upload CSV through swagger api url -> http://localhost:3000/api


## To get % wise distribution there is an api localhost:3000/age/distribution


## File processing has been tested till 2 lac records with a file size of of 50mb

## Implementation
Have used read stream which reads line one by one, since I've not found anything which helps in batch processing in nestjs. This could be solved using worker thread which can store data in batches and chunks into database. 


## Query for getting age wise distribution in percentage
```

WITH c AS (
SELECT
 CASE
  WHEN (age < 20) then '< 20'
  WHEN (age >= 20 and age < 40) then  '20 to 40'
  WHEN (age >= 40 and age < 60) then '40 to 60'
  WHEN (age >= 60) then '> 60'
 END AS "Age-Group",
  count(*) AS cnt
FROM users
GROUP BY "Age-Group"
)
SELECT
  "Age-Group",
  round(100.0 * cnt / (SELECT sum(cnt) FROM c), 2) AS "% Distribution"
FROM c;
```

