package com.sudheer.robinhood.strategy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "strategy_performance", schema = "strategies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class StrategyPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strategy_id", nullable = false)
    private Strategy strategy;

    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;

    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;

    @Column(name = "total_return", precision = 10, scale = 4)
    private BigDecimal totalReturn; // e.g., 15.50 for 15.5% return

    @Column(name = "annualized_return", precision = 10, scale = 4)
    private BigDecimal annualizedReturn;

    @Column(name = "volatility", precision = 10, scale = 4)
    private BigDecimal volatility; // Standard deviation of returns

    @Column(name = "sharpe_ratio", precision = 10, scale = 4)
    private BigDecimal sharpeRatio; // Risk-adjusted return metric

    @Column(name = "max_drawdown", precision = 10, scale = 4)
    private BigDecimal maxDrawdown; // Largest peak-to-trough decline

    @Column(name = "win_rate", precision = 5, scale = 2)
    private BigDecimal winRate; // Percentage of profitable periods

    @CreatedDate
    @Column(name = "calculated_at", nullable = false, updatable = false)
    private LocalDateTime calculatedAt;
}
