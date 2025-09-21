FROM rust:1.90 AS builder

WORKDIR /app

# Copy Cargo files first for caching
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "// dummy" > src/main.rs
RUN cargo build --release || true

# Copy source code and build
COPY . .
RUN cargo build --release

# -------- Runtime stage (Distroless) --------
FROM gcr.io/distroless/cc

WORKDIR /app

# Copy the release binary
COPY --from=builder /app/target/release/personalsite_blog_service /app/personalsite_blog_service

# Expose your app port
EXPOSE 8080

# Run as non-root user
USER 65532:65532

# Command to run
CMD ["/app/personalsite_blog_service"]
