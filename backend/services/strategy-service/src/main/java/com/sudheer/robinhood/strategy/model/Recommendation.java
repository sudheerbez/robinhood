package com.sudheer.robinhood.strategy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations", schema = "strategies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strategy_id")
    private Strategy strategy;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation_type", nullable = false)
    private RecommendationType recommendationType;

    @Column(length = 10)
    private String symbol;

    @Column(name = "confidence_score", precision = 5, scale = 4)
    private BigDecimal confidenceScore; // 0.0 to 1.0

    @Column(columnDefinition = "TEXT")
    private String reasoning;

    @Column(name = "is_acted_upon")
    @Builder.Default
    private Boolean isActedUpon = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    public enum RecommendationType {
        BUY, // Buy this stock
        SELL, // Sell this stock
        REBALANCE, // Rebalance portfolio
        ADJUST // Adjust strategy allocations
    }
}
