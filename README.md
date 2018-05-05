# Plain Spring Boot App on Kubernetes

This projects deploys two microservices in kubernetes and allows accessing these via an ingress controller. 

# Intro

When I started working on the [Spring Cloud Netflix Demo project](https://github.com/marcopaga/spring-cloud-netflix-demo) my only deployment platform was a simple automated 
docker-compose build and I wasn't aiming for a platform like kubernetes that can simplify the application development.

# Deployment

Using [docker-compose](docker-compose.yml) or [kubernetes](provision/helm).

# Security

* Applications run as a non root user
* The container root filesystem is read only
* Service Accounts are not mounted

# Components

## Business Services

### [backend](backend/README.md)

This is a simple demo application which can perform a simple calculation. The operation is available via a REST interface.

### [frontend](frontend/README.md)

This application will use the backend to perform a calculation. The backend will be called with a simple RestTemplate.
The call is carried out with ribbon which uses eureka to discover the backend insances.

# Distributed Tracing

All components include [Sleuth](http://cloud.spring.io/spring-cloud-static/spring-cloud-sleuth/1.2.5.RELEASE/single/spring-cloud-sleuth.html#_terminology) that provides tracing information for all requests. The meta data will be transferred between the services.
The demo project uses [Zipkin](http://zipkin.io/) to show the tracing information.
If you are using the ELK Stack you are also covered. Have a look [here](http://cloud.spring.io/spring-cloud-static/spring-cloud-sleuth/1.2.5.RELEASE/single/spring-cloud-sleuth.html#_log_correlation) to find the details. 

# Running

Prepare the Spring Boot Apps with Maven. In order to start the apps you need create the jar-Files.

> mvn clean install 

Start the applications with Docker Compose.

> docker-compose up -d

Have a look at the [configuration](docker-compose.yml).

# Calls

## Sample call:

[localhost:8080/frontend/](http://localhost:8091/frontend/)

## Zipkin:

[localhost:9411](http://localhost:9411/)

## Eureka:

[localhost:8761](http://localhost:8761/)

## Config Server:

[localhost:8888](http://localhost:8888/)

# License

[![License: CC BY 4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](https://creativecommons.org/licenses/by/4.0/)
