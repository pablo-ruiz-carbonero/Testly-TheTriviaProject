package com.example.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * @author PabloRuizCarbonero
 * @version 1.0
 * @since 1.0
 */
@Configuration
public class SwaggerConfig {
	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI().info(new Info().title("Testly API").version("1.0.0")
				.description("API REST de Testly para la gestión de usuarios, tests y resultados. "
						+ "Incluye endpoints seguros con autenticación JWT."));
	}

}
