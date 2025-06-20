package com.cjt.shoppingmall.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "toss")
public class TossProperties {
    private String secretKey;
    private String clientKey;
}
