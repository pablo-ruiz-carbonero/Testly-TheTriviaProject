package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ErrorControllerCustom {

	@GetMapping("/error/404")
    public String error404() {
        return "error/404";
    }

	@GetMapping("/error/500")
	public String error500() {
		return "error/500";
	}

	// Test de Error 500
	@GetMapping("/test-error")
	public String triggerError() {
		throw new RuntimeException("¡Boom! Error de prueba 500");
	}
}
