mod models;
mod controller;
mod database_config;
mod service;

use actix_web::{web::Data, App, HttpServer};
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

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(health_check)
            .service(get_posts)
            .service(create_post)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
