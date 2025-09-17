use actix_web::web::Data;
use sqlx::query_as;

use crate::{
    AppState,
    models::{
        Post,
        post::{CreatePostRequest, PostResponse},
    },
};

pub async fn get_blog_posts(state: Data<AppState>) -> Result<Vec<PostResponse>, sqlx::Error> {
    let posts = query_as::<_, Post>("SELECT * FROM posts")
        .fetch_all(&state.db_pool)
        .await?;

    Ok(posts.into_iter().map(|post| post.into()).collect())
}

pub async fn get_published_blog_posts(
    state: Data<AppState>,
) -> Result<Vec<PostResponse>, sqlx::Error> {
    let posts = query_as::<_, Post>("SELECT * FROM posts WHERE published IS TRUE")
        .fetch_all(&state.db_pool)
        .await?;
    Ok(posts.into_iter().map(|post| post.into()).collect())
}

pub async fn create_blog_post(
    state: Data<AppState>,
    create_post: CreatePostRequest,
) -> Result<PostResponse, sqlx::Error> {
    let post = query_as::<_, Post>(
        "INSERT INTO posts (title, body) VALUES ($1, $2) RETURNING id, title, body, published, created_at",
    )
    .bind(&create_post.title)
    .bind(&create_post.body)
    .fetch_one(&state.db_pool)
    .await?;

    Ok(post.into())
}
