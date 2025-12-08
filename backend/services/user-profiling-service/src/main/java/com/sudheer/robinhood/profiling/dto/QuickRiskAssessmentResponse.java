package com.sudheer.robinhood.profiling.dto;

import com.sudheer.robinhood.profiling.enums.InvestmentGoal;
import com.sudheer.robinhood.profiling.enums.RiskTolerance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuickRiskAssessmentResponse {
    private Integer riskScore;
    private RiskTolerance riskTolerance;
    private String recommendedStrategy;
    private QuickRiskAssessmentRequest assessment;
}
