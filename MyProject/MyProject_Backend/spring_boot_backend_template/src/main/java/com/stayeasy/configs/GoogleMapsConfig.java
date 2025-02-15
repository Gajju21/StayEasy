package com.stayeasy.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.maps.GeoApiContext;

@Configuration
public class GoogleMapsConfig {

    @Bean
    public GeoApiContext geoApiContext(@Value("${google.maps.api.key}") String apiKey) {
        return new GeoApiContext.Builder()
                .apiKey(apiKey)
                .build();
    }
} 