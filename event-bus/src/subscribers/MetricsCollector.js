// PATTERN: Observer
// RATIONALE: Collect metrics for SOC dashboard and compliance reporting

class MetricsCollector {
    constructor(metricsRepository) {
        this.metricsRepository = metricsRepository;
        this.metrics = {
            totalEvents: 0,
            eventsByType: {}
        };
    }

    update(event) {
        this.metrics.totalEvents++;
        this.metrics.eventsByType[event.type] = (this.metrics.eventsByType[event.type] || 0) + 1;
        
        if (this.metricsRepository) {
            this.metricsRepository.incrementCounter(event.type);
        }
        
        console.log(`[MetricsCollector] Total events: ${this.metrics.totalEvents}`);
    }

    getMetrics() {
        return this.metrics;
    }
}

module.exports = MetricsCollector;