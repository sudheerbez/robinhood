package com.sudheer.robinhood.profiling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
public class UserProfilingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserProfilingServiceApplication.class, args);
    }
}
