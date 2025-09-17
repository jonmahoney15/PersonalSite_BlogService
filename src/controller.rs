use crate::{
    AppState,
    models::post::{CreatePostRequest, PostQueryParams},
    service::{create_blog_post, get_blog_posts, get_published_blog_posts},
};
use actix_web::{
    HttpResponse, Responder, get, post,
    web::{self, Data},
};

#[get("/api/blog/health")]
pub async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("OK")
}

#[get("/api/blog/posts")]
pub async fn get_posts(
    state: Data<AppState>,
    params: web::Query<PostQueryParams>,
) -> impl Responder {
    let result = if params.published == Some(true) {
        get_published_blog_posts(state).await
    } else {
        get_blog_posts(state).await
    };

    match result {
        Ok(posts) => HttpResponse::Ok().json(posts),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/api/blog/post")]
pub async fn create_post(
    state: Data<AppState>,
    post: web::Json<CreatePostRequest>,
) -> impl Responder {
    match create_blog_post(state, post.into_inner()).await {
        Ok(post) => HttpResponse::Ok().json(post),
        Err(e) => {
            eprintln!("Error: {e}");
            HttpResponse::InternalServerError().body(e.to_string())
        }
    }
}
