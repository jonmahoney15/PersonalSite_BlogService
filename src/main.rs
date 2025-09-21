mod controller;
mod database_config;
mod models;
mod service;

use actix_web::{App, HttpServer, web::Data};
use controller::{create_post, get_posts, health_check};
use database_config::init_db_pool;
use sqlx::{Pool, Postgres};

struct AppState {
    db_pool: Pool<Postgres>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db_pool = init_db_pool().await;
    let app_state = Data::new(AppState { db_pool });

    let _ = sqlx::migrate!().run(&app_state.db_pool).await;

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(health_check)
            .service(get_posts)
            .service(create_post)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}

#[cfg(test)]
mod tests {
    use crate::models::{Post, post::CreatePostRequest};

    use super::*;
    use actix_web::{
        App,
        dev::Service,
        http::StatusCode,
        test::{self, TestRequest},
    };
    use sqlx::postgres::PgPoolOptions;
    use testcontainers_modules::{postgres, testcontainers::runners::AsyncRunner};

    #[actix_web::test]
    async fn posts_get_200() {
        let app_state = create_test_app_state().await;

        let app =
            test::init_service(App::new().app_data(app_state.clone()).service(get_posts)).await;
        let request = TestRequest::get().uri("/api/blog/posts").to_request();

        let response = app.call(request).await.unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[actix_web::test]
    async fn create_postrequest_200() {
        let app_state = create_test_app_state().await;
        let body = CreatePostRequest {
            title: String::from("Test Post"),
            body: String::from("Body OF Post"),
        };
        let request = serde_json::to_vec(&body).unwrap();
        let app =
            test::init_service(App::new().app_data(app_state.clone()).service(get_posts)).await;
        let request = TestRequest::post()
            .set_payload(request)
            .uri("/api/blog/posts")
            .to_request();

        let response = app.call(request).await.unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[actix_web::test]
    async fn health_getrequest_200() {
        let app = test::init_service(App::new().service(health_check)).await;

        let request = TestRequest::get().uri("/api/blog/health").to_request();

        let response = app.call(request).await.unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    async fn create_test_app_state() -> Data<AppState> {
        let container = postgres::Postgres::default().start().await.unwrap();
        let host_port = container.get_host_port_ipv4(5432).await.unwrap();
        let connection_string =
            &format!("postgres://postgres:postgres@127.0.0.1:{host_port}/postgres");

        let db_pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(connection_string)
            .await
            .expect("Failed to create pool for test postgres.");

        let app_state = Data::new(AppState { db_pool });
        let _ = sqlx::migrate!().run(&app_state.db_pool).await;

        app_state
    }
}
