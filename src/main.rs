use actix_web::{App, HttpServer};
mod blog_service;
use blog_service::{get_posts, create_post};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(get_posts)
            .service(create_post)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
