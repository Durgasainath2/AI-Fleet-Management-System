package com.fleetmanagement.fleetmanageent.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String userDir = System.getProperty("user.dir");
        File projectRoot = new File(userDir);
        File frontendDir = new File(projectRoot.getParentFile(), "frontend");
        if (!frontendDir.exists()) {
            frontendDir = new File(projectRoot, "frontend");
        }
        
        String frontendPath = "file:///" + frontendDir.getAbsolutePath().replace("\\", "/") + "/";
        
        registry.addResourceHandler("/**")
                .addResourceLocations(frontendPath, "classpath:/static/", "classpath:/public/");
    }
}
