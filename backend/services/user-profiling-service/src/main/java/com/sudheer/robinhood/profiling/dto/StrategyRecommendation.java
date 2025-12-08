package com.sudheer.robinhood.profiling.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StrategyRecommendation {
    private String strategyName;
    private String strategyType;
    private BigDecimal expectedReturn;
    private BigDecimal volatility;
    private BigDecimal stockAllocation;
    private BigDecimal bondAllocation;
    private BigDecimal alternativeAllocation;
    private BigDecimal cashAllocation;
    private String reasoning;
    private Integer riskMatchScore;
}
