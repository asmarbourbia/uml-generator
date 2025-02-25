package com.project.xmluml;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.project.xmluml")
public class XmlumlApplication {
    public static void main(String[] args) {
        SpringApplication.run(XmlumlApplication.class, args);
    }
}