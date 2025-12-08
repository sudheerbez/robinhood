-- Initialize databases and schemas for Robinhood Strategies Platform

-- Create separate schemas for each service
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS strategies;
CREATE SCHEMA IF NOT EXISTS portfolios;

-- =============================================
-- AUTH SCHEMA
-- =============================================

-- Users table
CREATE TABLE auth.users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE auth.roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles mapping
CREATE TABLE auth.user_roles (
    user_id BIGINT REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES auth.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- Permissions table
CREATE TABLE auth.permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions mapping
CREATE TABLE auth.role_permissions (
    role_id BIGINT REFERENCES auth.roles(id) ON DELETE CASCADE,
    permission_id BIGINT REFERENCES auth.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- OAuth tokens table
CREATE TABLE auth.oauth_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES auth.users(id) ON DELETE CASCADE,
    access_token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT false
);

-- =============================================
-- ORDERS SCHEMA
-- =============================================

-- Orders table
CREATE TABLE orders.orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    order_type VARCHAR(20) NOT NULL, -- MARKET, LIMIT, STOP
    side VARCHAR(10) NOT NULL, -- BUY, SELL
    quantity DECIMAL(18, 8) NOT NULL,
    price DECIMAL(18, 2),
    stop_price DECIMAL(18, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, EXECUTED, CANCELLED, REJECTED
    filled_quantity DECIMAL(18, 8) DEFAULT 0,
    average_fill_price DECIMAL(18, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP
);

-- Order executions table
CREATE TABLE orders.order_executions (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders.orders(id) ON DELETE CASCADE,
    execution_price DECIMAL(18, 2) NOT NULL,
    execution_quantity DECIMAL(18, 8) NOT NULL,
    execution_fee DECIMAL(18, 2) DEFAULT 0,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order history (audit trail)
CREATE TABLE orders.order_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders.orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(100),
    change_reason VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- STRATEGIES SCHEMA
-- =============================================

-- Strategies table
CREATE TABLE strategies.strategies (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    strategy_type VARCHAR(50) NOT NULL, -- MOMENTUM, VALUE, GROWTH, DIVIDEND, CUSTOM
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false,
    risk_level VARCHAR(20), -- LOW, MEDIUM, HIGH
    target_return DECIMAL(5, 2),
    max_drawdown DECIMAL(5, 2),
    rebalance_frequency VARCHAR(20), -- DAILY, WEEKLY, MONTHLY, QUARTERLY
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Strategy allocations (which assets and percentages)
CREATE TABLE strategies.strategy_allocations (
    id BIGSERIAL PRIMARY KEY,
    strategy_id BIGINT REFERENCES strategies.strategies(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    target_percentage DECIMAL(5, 2) NOT NULL,
    min_percentage DECIMAL(5, 2),
    max_percentage DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Strategy performance metrics
CREATE TABLE strategies.strategy_performance (
    id BIGSERIAL PRIMARY KEY,
    strategy_id BIGINT REFERENCES strategies.strategies(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_return DECIMAL(10, 4),
    annualized_return DECIMAL(10, 4),
    volatility DECIMAL(10, 4),
    sharpe_ratio DECIMAL(10, 4),
    max_drawdown DECIMAL(10, 4),
    win_rate DECIMAL(5, 2),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backtests table
CREATE TABLE strategies.backtests (
    id BIGSERIAL PRIMARY KEY,
    strategy_id BIGINT REFERENCES strategies.strategies(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    initial_capital DECIMAL(18, 2) NOT NULL,
    final_capital DECIMAL(18, 2),
    total_return DECIMAL(10, 4),
    sharpe_ratio DECIMAL(10, 4),
    max_drawdown DECIMAL(10, 4),
    total_trades INTEGER,
    winning_trades INTEGER,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- AI Recommendations table
CREATE TABLE strategies.recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    strategy_id BIGINT REFERENCES strategies.strategies(id),
    recommendation_type VARCHAR(50) NOT NULL, -- BUY, SELL, REBALANCE, ADJUST
    symbol VARCHAR(10),
    confidence_score DECIMAL(5, 4),
    reasoning TEXT,
    is_acted_upon BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- =============================================
-- PORTFOLIOS SCHEMA
-- =============================================

-- Portfolios table
CREATE TABLE portfolios.portfolios (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    total_value DECIMAL(18, 2) DEFAULT 0,
    cash_balance DECIMAL(18, 2) DEFAULT 0,
    invested_amount DECIMAL(18, 2) DEFAULT 0,
    total_return DECIMAL(18, 2) DEFAULT 0,
    total_return_percentage DECIMAL(10, 4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Holdings table
CREATE TABLE portfolios.holdings (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT REFERENCES portfolios.portfolios(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(18, 8) NOT NULL,
    average_cost DECIMAL(18, 2) NOT NULL,
    current_price DECIMAL(18, 2),
    current_value DECIMAL(18, 2),
    unrealized_gain_loss DECIMAL(18, 2),
    unrealized_gain_loss_percentage DECIMAL(10, 4),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, symbol)
);

-- Transactions table
CREATE TABLE portfolios.transactions (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT REFERENCES portfolios.portfolios(id) ON DELETE CASCADE,
    order_id BIGINT,
    transaction_type VARCHAR(20) NOT NULL, -- BUY, SELL, DIVIDEND, DEPOSIT, WITHDRAWAL
    symbol VARCHAR(10),
    quantity DECIMAL(18, 8),
    price DECIMAL(18, 2),
    amount DECIMAL(18, 2) NOT NULL,
    fee DECIMAL(18, 2) DEFAULT 0,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rebalancing events table
CREATE TABLE portfolios.rebalancing_events (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT REFERENCES portfolios.portfolios(id) ON DELETE CASCADE,
    strategy_id BIGINT,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, FAILED
    trades_executed INTEGER DEFAULT 0,
    total_trades_planned INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Portfolio performance snapshots
CREATE TABLE portfolios.performance_snapshots (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT REFERENCES portfolios.portfolios(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    total_value DECIMAL(18, 2) NOT NULL,
    cash_balance DECIMAL(18, 2) NOT NULL,
    invested_amount DECIMAL(18, 2) NOT NULL,
    daily_return DECIMAL(10, 4),
    cumulative_return DECIMAL(10, 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, snapshot_date)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Auth indexes
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_username ON auth.users(username);
CREATE INDEX idx_oauth_tokens_user_id ON auth.oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_access_token ON auth.oauth_tokens(access_token);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders.orders(user_id);
CREATE INDEX idx_orders_symbol ON orders.orders(symbol);
CREATE INDEX idx_orders_status ON orders.orders(status);
CREATE INDEX idx_orders_created_at ON orders.orders(created_at);
CREATE INDEX idx_order_executions_order_id ON orders.order_executions(order_id);

-- Strategies indexes
CREATE INDEX idx_strategies_user_id ON strategies.strategies(user_id);
CREATE INDEX idx_strategies_is_public ON strategies.strategies(is_public);
CREATE INDEX idx_strategy_allocations_strategy_id ON strategies.strategy_allocations(strategy_id);
CREATE INDEX idx_strategy_performance_strategy_id ON strategies.strategy_performance(strategy_id);
CREATE INDEX idx_backtests_strategy_id ON strategies.backtests(strategy_id);
CREATE INDEX idx_recommendations_user_id ON strategies.recommendations(user_id);

-- Portfolios indexes
CREATE INDEX idx_portfolios_user_id ON portfolios.portfolios(user_id);
CREATE INDEX idx_holdings_portfolio_id ON portfolios.holdings(portfolio_id);
CREATE INDEX idx_transactions_portfolio_id ON portfolios.transactions(portfolio_id);
CREATE INDEX idx_transactions_order_id ON portfolios.transactions(order_id);
CREATE INDEX idx_rebalancing_events_portfolio_id ON portfolios.rebalancing_events(portfolio_id);
CREATE INDEX idx_performance_snapshots_portfolio_id ON portfolios.performance_snapshots(portfolio_id);

-- =============================================
-- SEED DATA
-- =============================================

-- Insert default roles
INSERT INTO auth.roles (name, description) VALUES
    ('ADMIN', 'Full system access'),
    ('TRADER', 'Can trade and manage portfolios'),
    ('VIEWER', 'Read-only access');

-- Insert default permissions
INSERT INTO auth.permissions (name, resource, action, description) VALUES
    ('READ_ORDERS', 'orders', 'read', 'View orders'),
    ('CREATE_ORDERS', 'orders', 'create', 'Create new orders'),
    ('CANCEL_ORDERS', 'orders', 'delete', 'Cancel orders'),
    ('READ_STRATEGIES', 'strategies', 'read', 'View strategies'),
    ('CREATE_STRATEGIES', 'strategies', 'create', 'Create strategies'),
    ('UPDATE_STRATEGIES', 'strategies', 'update', 'Modify strategies'),
    ('DELETE_STRATEGIES', 'strategies', 'delete', 'Delete strategies'),
    ('READ_PORTFOLIO', 'portfolio', 'read', 'View portfolio'),
    ('MANAGE_PORTFOLIO', 'portfolio', 'manage', 'Manage portfolio'),
    ('ADMIN_ACCESS', 'system', 'admin', 'Full administrative access');

-- Assign permissions to roles
-- ADMIN gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r CROSS JOIN auth.permissions p WHERE r.name = 'ADMIN';

-- TRADER gets trading permissions
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p 
WHERE r.name = 'TRADER' AND p.name IN (
    'READ_ORDERS', 'CREATE_ORDERS', 'CANCEL_ORDERS',
    'READ_STRATEGIES', 'CREATE_STRATEGIES', 'UPDATE_STRATEGIES',
    'READ_PORTFOLIO', 'MANAGE_PORTFOLIO'
);

-- VIEWER gets read-only permissions
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p 
WHERE r.name = 'VIEWER' AND p.name IN ('READ_ORDERS', 'READ_STRATEGIES', 'READ_PORTFOLIO');

-- Create a demo user (password: demo123)
-- Password hash for 'demo123' using BCrypt
INSERT INTO auth.users (email, username, password_hash, first_name, last_name, is_active, is_verified)
VALUES ('demo@robinhood.com', 'demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Demo', 'User', true, true);

-- Assign TRADER role to demo user
INSERT INTO auth.user_roles (user_id, role_id)
SELECT u.id, r.id FROM auth.users u, auth.roles r WHERE u.username = 'demo' AND r.name = 'TRADER';

-- Create portfolio for demo user
INSERT INTO portfolios.portfolios (user_id, total_value, cash_balance)
SELECT id, 10000.00, 10000.00 FROM auth.users WHERE username = 'demo';

-- Create some sample public strategies
INSERT INTO strategies.strategies (user_id, name, description, strategy_type, is_public, risk_level, target_return, rebalance_frequency)
SELECT u.id, 'Growth Portfolio', 'Focus on high-growth technology stocks', 'GROWTH', true, 'HIGH', 15.00, 'MONTHLY'
FROM auth.users u WHERE u.username = 'demo';

INSERT INTO strategies.strategies (user_id, name, description, strategy_type, is_public, risk_level, target_return, rebalance_frequency)
SELECT u.id, 'Dividend Income', 'Stable dividend-paying stocks for income', 'DIVIDEND', true, 'LOW', 6.00, 'QUARTERLY'
FROM auth.users u WHERE u.username = 'demo';

INSERT INTO strategies.strategies (user_id, name, description, strategy_type, is_public, risk_level, target_return, rebalance_frequency)
SELECT u.id, 'Balanced Portfolio', 'Mix of growth and value stocks', 'VALUE', true, 'MEDIUM', 10.00, 'MONTHLY'
FROM auth.users u WHERE u.username = 'demo';

-- Add allocations for Growth Portfolio
INSERT INTO strategies.strategy_allocations (strategy_id, symbol, target_percentage)
SELECT s.id, 'AAPL', 25.00 FROM strategies.strategies s WHERE s.name = 'Growth Portfolio'
UNION ALL
SELECT s.id, 'GOOGL', 25.00 FROM strategies.strategies s WHERE s.name = 'Growth Portfolio'
UNION ALL
SELECT s.id, 'MSFT', 25.00 FROM strategies.strategies s WHERE s.name = 'Growth Portfolio'
UNION ALL
SELECT s.id, 'NVDA', 25.00 FROM strategies.strategies s WHERE s.name = 'Growth Portfolio';

COMMIT;
