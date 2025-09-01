use actix_web::{get, post, HttpResponse, Responder};

#[get("/api/blog/posts")]
pub async fn get_posts() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/api/blog/post")]
pub async fn create_post(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}
