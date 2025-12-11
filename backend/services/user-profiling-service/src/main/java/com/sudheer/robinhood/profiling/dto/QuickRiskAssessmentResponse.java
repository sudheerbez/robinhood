package com.sudheer.robinhood.profiling.dto;

import com.sudheer.robinhood.profiling.enums.RiskTolerance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
