package com.sudheer.robinhood.profiling.controller;

import com.sudheer.robinhood.profiling.dto.QuickRiskAssessmentRequest;
import com.sudheer.robinhood.profiling.dto.QuickRiskAssessmentResponse;
import com.sudheer.robinhood.profiling.dto.StrategyRecommendation;
import com.sudheer.robinhood.profiling.enums.InvestmentGoal;
import com.sudheer.robinhood.profiling.enums.RiskTolerance;
import com.sudheer.robinhood.profiling.service.ProfilingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/profiling")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfilingController {

    private final ProfilingService profilingService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "healthy"));
    }

    @PostMapping("/quick-assessment")
    public ResponseEntity<QuickRiskAssessmentResponse> quickAssessment(
            @Valid @RequestBody QuickRiskAssessmentRequest request) {
        QuickRiskAssessmentResponse response = profilingService.processQuickAssessment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<StrategyRecommendation>> getRecommendations(
            @RequestParam(required = false, defaultValue = "50") Integer riskScore) {
        List<StrategyRecommendation> recommendations = profilingService.getRecommendations(riskScore);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/enums/risk-tolerance")
    public ResponseEntity<List<Map<String, String>>> getRiskToleranceOptions() {
        List<Map<String, String>> options = Arrays.stream(RiskTolerance.values())
                .map(rt -> Map.of(
                        "value", rt.name().toLowerCase(),
                        "label", formatEnumName(rt.name()),
                        "description", getRiskToleranceDescription(rt)))
                .collect(Collectors.toList());
        return ResponseEntity.ok(options);
    }

    @GetMapping("/enums/investment-goals")
    public ResponseEntity<List<Map<String, String>>> getInvestmentGoals() {
        List<Map<String, String>> goals = Arrays.stream(InvestmentGoal.values())
                .map(goal -> Map.of(
                        "value", goal.name().toLowerCase(),
                        "label", formatEnumName(goal.name())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(goals);
    }

    private String formatEnumName(String enumName) {
        return Arrays.stream(enumName.split("_"))
                .map(word -> word.charAt(0) + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }

    private String getRiskToleranceDescription(RiskTolerance rt) {
        return switch (rt) {
            case CONSERVATIVE -> "Low risk, stable returns";
            case MODERATE -> "Balanced risk/reward";
            case AGGRESSIVE -> "High risk, high potential returns";
            case VERY_AGGRESSIVE -> "Maximum risk tolerance";
        };
    }
}
