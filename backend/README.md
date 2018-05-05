# Backend REST Service

# API

The following addresses are available:
- http://localhost:8090/add/{first}/{second}/

It will return the sum of two numbers. You can explicitly define the numbers.


# Processing

The process simulates a processing time. The maximum number of millis can be configured with the spring property `backend.processing.time.max`. This property is currently propagated by the Spring cloud config server. 

# Failures

The service will return an exception randomly from time to time. You will find a `IllegalStateException` in the logs that clearly states it's purpose in the logs. These exceptions are needed to test the resiliency features.