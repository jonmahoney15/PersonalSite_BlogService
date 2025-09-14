use sqlx::types::time;

#[derive(Debug, serde::Deserialize)]
pub struct PostQueryParams {
    pub published: Option<bool>
}

#[derive(serde::Deserialize)]
pub struct CreatePostRequest {
    pub title: String,
    pub body: String
}

#[derive(Debug, sqlx::FromRow)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub published: bool,
    pub created_at: time::OffsetDateTime
}

#[derive(Debug, serde::Serialize)]
pub struct PostResponse {
    pub id: i32,
    pub title: String,
    pub body: String,
}

impl From<Post> for PostResponse {
    fn from(value: Post) -> Self {
        PostResponse {
            id: value.id,
            title: value.title,
            body: value.body
        }
    }
}
