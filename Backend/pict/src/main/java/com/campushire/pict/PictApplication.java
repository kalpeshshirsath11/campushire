package com.campushire.pict;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PictApplication {

	public static void main(String[] args) {
		SpringApplication.run(PictApplication.class, args);
	}

}
