package com.sudheer.robinhood.profiling.dto;

import com.sudheer.robinhood.profiling.enums.InvestmentGoal;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuickRiskAssessmentRequest {

    @NotNull
    @Min(18)
    @Max(120)
    private Integer age;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal investmentAmount;

    @NotNull
    private InvestmentGoal investmentGoal;

    @NotNull
    @Min(1)
    @Max(50)
    private Integer timeHorizonYears;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer lossTolerance; // 1=Very low, 10=Very high

    @NotNull
    @Min(1)
    @Max(10)
    private Integer investmentKnowledge; // 1=Beginner, 10=Expert

    /**
     * Calculate risk score from quick assessment
     * Returns score from 1-100
     */
    public Integer calculateRiskScore() {
        // Age factor (younger = higher risk capacity)
        int ageScore = Math.max(0, 100 - age);

        // Time horizon factor
        int horizonScore = Math.min(100, timeHorizonYears * 5);

        // Loss tolerance and knowledge
        int toleranceScore = lossTolerance * 10;
        int knowledgeScore = investmentKnowledge * 10;

        // Weighted average
        int riskScore = (int) ((ageScore * 0.2) +
                (horizonScore * 0.3) +
                (toleranceScore * 0.3) +
                (knowledgeScore * 0.2));

        return Math.min(100, Math.max(1, riskScore));
    }
}
