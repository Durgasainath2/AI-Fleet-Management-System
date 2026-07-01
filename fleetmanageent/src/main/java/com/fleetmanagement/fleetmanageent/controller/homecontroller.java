package com.fleetmanagement.fleetmanageent.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class homecontroller {

    @GetMapping("/")
    public String home() {
        return "Welcome to FleetControlX AI!";
    }
}