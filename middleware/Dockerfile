FROM openjdk:17-jdk-slim
WORKDIR /app
COPY src/ ./src/
COPY ../shared/ ./shared/
RUN find . -name "*.java" | xargs javac -d out 2>/dev/null || true
CMD ["java", "-cp", "out", "middleware.AlertEnrichmentPipeline"]
