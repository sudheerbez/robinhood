package com.sudheer.robinhood.profiling.service;

import com.sudheer.robinhood.profiling.dto.QuickRiskAssessmentRequest;
import com.sudheer.robinhood.profiling.dto.QuickRiskAssessmentResponse;
import com.sudheer.robinhood.profiling.dto.StrategyRecommendation;
import com.sudheer.robinhood.profiling.enums.RiskTolerance;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfilingService {

    public QuickRiskAssessmentResponse processQuickAssessment(QuickRiskAssessmentRequest request) {
        // Calculate risk score
        Integer riskScore = request.calculateRiskScore();

        // Map to risk tolerance
        RiskTolerance riskTolerance;
        String recommendedStrategy;

        if (riskScore < 30) {
            riskTolerance = RiskTolerance.CONSERVATIVE;
            recommendedStrategy = "Conservative Income";
        } else if (riskScore < 60) {
            riskTolerance = RiskTolerance.MODERATE;
            recommendedStrategy = "Balanced Growth";
        } else if (riskScore < 80) {
            riskTolerance = RiskTolerance.AGGRESSIVE;
            recommendedStrategy = "Growth Portfolio";
        } else {
            riskTolerance = RiskTolerance.VERY_AGGRESSIVE;
            recommendedStrategy = "Aggressive Growth";
        }

        log.info("Quick assessment processed: riskScore={}, tolerance={}", riskScore, riskTolerance);

        return QuickRiskAssessmentResponse.builder()
                .riskScore(riskScore)
                .riskTolerance(riskTolerance)
                .recommendedStrategy(recommendedStrategy)
                .assessment(request)
                .build();
    }

    public List<StrategyRecommendation> getRecommendations(Integer riskScore) {
        List<StrategyRecommendation> recommendations = new ArrayList<>();

        if (riskScore < 30) {
            // Conservative
            recommendations.add(StrategyRecommendation.builder()
                    .strategyName("Conservative Income")
                    .strategyType("conservative")
                    .expectedReturn(new BigDecimal("4.5"))
                    .volatility(new BigDecimal("5.0"))
                    .stockAllocation(new BigDecimal("20.0"))
                    .bondAllocation(new BigDecimal("70.0"))
                    .alternativeAllocation(new BigDecimal("5.0"))
                    .cashAllocation(new BigDecimal("5.0"))
                    .reasoning("Low risk tolerance with focus on capital preservation and steady income")
                    .riskMatchScore(95)
                    .build());
        } else if (riskScore < 60) {
            // Moderate
            recommendations.add(StrategyRecommendation.builder()
                    .strategyName("Balanced Growth")
                    .strategyType("moderate")
                    .expectedReturn(new BigDecimal("7.5"))
                    .volatility(new BigDecimal("10.0"))
                    .stockAllocation(new BigDecimal("60.0"))
                    .bondAllocation(new BigDecimal("35.0"))
                    .alternativeAllocation(new BigDecimal("5.0"))
                    .cashAllocation(new BigDecimal("0.0"))
                    .reasoning("Balanced approach with moderate risk for steady growth")
                    .riskMatchScore(90)
                    .build());
        } else {
            // Aggressive
            recommendations.add(StrategyRecommendation.builder()
                    .strategyName("Aggressive Growth")
                    .strategyType("aggressive")
                    .expectedReturn(new BigDecimal("12.0"))
                    .volatility(new BigDecimal("18.0"))
                    .stockAllocation(new BigDecimal("85.0"))
                    .bondAllocation(new BigDecimal("10.0"))
                    .alternativeAllocation(new BigDecimal("5.0"))
                    .cashAllocation(new BigDecimal("0.0"))
                    .reasoning("High growth potential with higher volatility for long-term investors")
                    .riskMatchScore(92)
                    .build());
        }

        return recommendations;
    }
}
