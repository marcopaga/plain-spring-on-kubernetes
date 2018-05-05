package de.codecentric.cloud.frontend;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import static java.lang.String.format;

@Component
public class Calculation {

    private static final Logger LOGGER = LoggerFactory.getLogger(Calculation.class);

    @Value("${backend.url}")
    private String backendUrl;

    @Resource
    public RestTemplate restTemplate;

    String performAddition(int first, int second) {
        LOGGER.info("Calculation of {} + {} requested.", first, second);
        final ResponseEntity<Integer> result = restTemplate.getForEntity(backendUrl + "/add/{first}/{second}/", Integer.class, first, second);
        LOGGER.info("Result is: {}", result.getBody());
        return format("%d + %d = %d", first, second, result.getBody());
    }

    private String performAdditionFallback(int first, int second){
        if(first > 0 && second > 0){
            return "The result will be positive.";
        } else {
            return "The result will be a number.";
        }
    }
}
