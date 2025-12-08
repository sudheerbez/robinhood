package com.sudheer.robinhood.strategy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "strategies", schema = "strategies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Strategy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "strategy_type", nullable = false)
    private StrategyType strategyType;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel;

    @Column(name = "target_return", precision = 5, scale = 2)
    private BigDecimal targetReturn;

    @Column(name = "max_drawdown", precision = 5, scale = 2)
    private BigDecimal maxDrawdown;

    @Enumerated(EnumType.STRING)
    @Column(name = "rebalance_frequency")
    private RebalanceFrequency rebalanceFrequency;

    @OneToMany(mappedBy = "strategy", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StrategyAllocation> allocations = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum StrategyType {
        MOMENTUM, // Buy stocks with strong recent performance
        VALUE, // Buy undervalued stocks
        GROWTH, // Buy high-growth companies
        DIVIDEND, // Buy dividend-paying stocks
        CUSTOM // User-defined strategy
    }

    public enum RiskLevel {
        LOW, // Conservative, stable returns
        MEDIUM, // Balanced risk/reward
        HIGH // Aggressive, higher potential returns
    }

    public enum RebalanceFrequency {
        DAILY,
        WEEKLY,
        MONTHLY,
        QUARTERLY,
        ANNUALLY,
        NEVER
    }
}
