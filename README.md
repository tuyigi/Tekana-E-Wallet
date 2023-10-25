
## Tekana E-Wallet Backend Solution


## Mission

Rebuild from scratch a back-end solution for a legacy platform that serves 1 million customers around the world.



## Scope of the project

This project's scope encompasses the planning and creation of a replacement for the existing back-end solution.

The following tasks will be part of this endeavor:

- Investigating and evaluating the present technology stack and requirements.
- Choose a new technology stack.
- Design new architecture and solution.
- Develop new back-end solution.
- Integration of new back-end solution with existing front-end and other systems.
- Testing and deployment of new back-end solution.

## Strategy

1. Initial Assessment:
    - Gather a cross-functional team of engineers, business analysts, and product owners.
    - Conduct an in-depth assessment of the current system's limitations, pain points, and performance issues.
    - Engage with key stakeholders from various departments to understand their specific needs and expectations.
2. Define Business Objectives:
   - Collaborate closely with business units to clearly define the project's objectives, KPIs, and success criteria.
    - Align technology decisions with the overarching business goals, ensuring that the new solution addresses specific pain points.
3. Technology Stack Selection:
    - Analyze scalability, availability, and performance requirements based on customer load.
    - Identify and select the most suitable technology stack for the back-end solution, including programming languages, frameworks, database systems, and cloud infrastructure.
4. Architectural Design:
    - Develop a comprehensive architectural design that outlines system components, data flow, and interaction with front-end systems.
    - Focus on modularity, scalability, and maintainability while adhering to industry best practices.
5.  System Development:
    - Implement coding best practices, utilizing design patterns and principles such as SOLID.
    - Collaborate with front-end developers to ensure seamless integration.
6. Testing and Quality Assurance:
    - Create a robust testing strategy, encompassing unit, integration, and end-to-end testing.
    - Employ continuous integration and continuous delivery (CI/CD) practices for early issue detection and resolution.
    - Conduct performance testing to ensure scalability.
7. System Pilot:
    - Launch a pilot system to a limited user base or in a controlled environment to validate the new back-end solution's functionality.
    - Monitor system performance, collect user feedback, and address any issues that arise.
8. Scaling:
    - Incorporate feedback from the pilot phase to make necessary improvements.
    - Scale the solution gradually to accommodate the entire customer base.
9. Documentation:
    - Maintain thorough documentation of the new system's architecture, codebase, and deployment processes.
    - Facilitate knowledge transfer within the team to ensure long-term sustainability.
10. System launch:
    - Plan a seamless transition to the new back-end solution.
    - Provide ongoing support and monitoring to ensure system reliability and performance.

### Business Requirements
Write the back-end solution with a minimum feature that showcases how you would design from the code source.

1. These are the required features to be built:

   - Create, Read customers (Registration)
   - Create and read wallets of customers
   - Create and read transactions.
   
### Technology Stack
1. API Layer:

   [NestJS](https://nestjs.com/) acts as the API Layer for the architecture. It handles the task of receiving client requests and then initiating the relevant back-end microservice to meet those requests.
2. Microservice Layer:

   GRPC was used here due to its high performance in calling procedure, Services were defined using Protocol Buffers for serialization.
3. Persistence Layer:

   Postgresql was as Database due to its strong reputation for reliability, For Object Relational Mapper TypeORM is used regarding mapping class models to database
4. Caching Layer:
    
   Redis was used for caching generated OTP for 5 minutes for two-factor authentication.
5. Message Broker:
   
   BullMQ was used on top of Redis server to queue all SMS to be sent which helped to scale horizontally and use minimum CPU usage due to polling free design
6. Deployment:

   Deployment was done using docker containers, and docker file for the project is provided.

## Architecture of the system

<img width="1005" alt="Screen Shot 2023-10-24 at 11 20 53" src="https://github.com/tuyigi/Tekana-E-Wallet/assets/29768433/d4406939-8957-4d47-95fb-d137e3c47669">


### Details of proposed architecture
  - Load balancers: Distribute incoming traffic across multiple servers or resources, allowing you to easily scale your infrastructure by adding or removing servers as needed to handle increased loads.
  - App Servers: These are server instance responsible for handling incoming traffic redirected to the server. and API gateway will handle the rest
  - API Gateway: Responsible for forwarding incoming requests to the corresponding microservice.
  - Redis: It caches OTPs of two-factor authentication, and act as message queue broker for queueing SMS to be sent . This was used only in Customer Microservice 
  - Bull MQ: This library was used on top of Redis for managing job queues.
  - Replica Database: This will be mainly used for Read Operations for instance for reporting.To reduce traffic on primary DB server which is being used for write operations
  - Primary Database: This primary database is used for mainly for write operations that happens more often. This will prevent out of connection pool cause read operation will be happening on replica DB.

### Back-end Solution
1. Database Design:

![Screen Shot 2023-10-24 at 10 21 59](https://github.com/tuyigi/Tekana-E-Wallet/assets/29768433/07ee4961-e9af-4e3a-ab77-1def566ee8a5)


2. Micrservice Design Pattern:
   - Miscroservice Architecture
   - GRPC Transport
   - API Gateway
   - Each App has its own database

3. API Endpoints 

| method | resource                 | description                                                                                                                                                            | Authorization |
|:-------|:-------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `POST` | `/customers/register`    | Create new customer, pass customer object as request body                                                                                                              | No            |
| `POST` | `/customers/login`       | Authenticate customer by using his/her email and password                                                                                                              | NO            |
| `PUT`  | `/customers/validateOtp` | (Two factor authentication) Validate OTP sent to customer phone number after authenticated                                                                             | NO            |
| `GET`  | `/customers`             | Get paginated list of customers by filtering with any field in customer object, filter should be passing in query params                                               | YES           |
| `GET`  | `/customers/find`        | Get one customer filtering with any of filed with unique constraint                                                                                                    | YES           |
| `POST` | `/walletTypes`           | Create new wallet type , wallet type used in creation of wallet                                                                                                        | YES           |
| `GET`  | `/walletTypes`           | Get list of wallet types and filter with any filed in wallet type object, filter should be passing in query params                                                     | YES           |
| `POST` | `/wallets`               | Create new wallet of a certain customer using this API by passing wallet object                                                                                        | YES           |
| `GET`  | `/wallets`               | Get wallet , this API endpoint allow you to filter with any field in wallet object E.g: account number , customer ID etc..    filter should be passing in query params | YES           |
| `POST` | `/transactions`          | Initiate new transaction, a transaction should have transaction type, and beneficial should have transaction rule to specific transaction type                         | YES           |
| `GET`  | `/transactions`          | Get transactions by filtering with any field in transaction object, filter should be passing in query params                                                           | YES           |


### Accessibility of API documentation
Swagger API documentation or Postman collection could be used for accessing and understanding the details about the API.

## Project Structure

1. `libs` - Within this directory, you will find all common types, dtos, helpers . E.g: filter helper.
2. `proto` - Within this directory, you will find all the gRPC Service definitions/protocol Buffers.
3. `apps` - Within this directory, There are all Microservices Apps and API-gateway.
4. `apps/api-gateway` - Within this directory, there all files of API Gateway.
4. `apps/ms-customer` - Within this directory, There are all files of Customer Microservice.
5. `apps/ms-transaction` - Within this directory, There are all files of Transaction Microservice. 
6. `apps/ms-wallet` - Within this directory, there are all files of Wallet Microservice.




## How to Run 

### Requirements
 - Mac / Linux
 - Node v16.13.0
 - Nest 10.1.7
 - Postgres Database


```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Roadmap

### General

- [x] Microservice Dbs
- [x] Two-factor authentication
- [x] Sms Gateway integration
- [ ] CI/CD Pipeline
- [ ] Dockerize Application
- [ ] NGINX Configuration
- [ ] ElasticSearch for logs monitoring



### Microservice
- [x] Caching with Redis DB
- [X] Queueing with Redis ( BullMQ)
- [ ] Fault tolerance
- [ ] Rate limit
- [ ] Circuit breaker
- [ ] Kibana for Microservice monitoring
- [ ] Unit Tests
- [ ] Integration Tests

### API Gateway
- [x] Logs (used middleware for logging  )  
- [ ] Validation of incoming request


## Stay in touch

- Author - [Gilbert Tuyishime](https://www.linkedin.com/in/gilbert-tuyishime-5977ab166/)



