<?php

namespace Tests\Feature\Comment;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    // ──────────────────────────────────────────────────────────────────────
    // INDEX (GET /api/v1/posts/{post}/comments)
    // ──────────────────────────────────────────────────────────────────────

    public function test_index_requires_authentication(): void
    {
        $post = Post::factory()->create();

        $this->getJson("/api/v1/posts/{$post->id}/comments")
            ->assertStatus(401);
    }

    public function test_index_returns_comments_for_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        Comment::factory()->count(3)->create(['post_id' => $post->id]);

        $this->actingAs($user)
            ->getJson("/api/v1/posts/{$post->id}/comments")
            ->assertStatus(200)
            ->assertJsonCount(3, 'comments');
    }

    public function test_index_returns_empty_array_when_no_comments(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->getJson("/api/v1/posts/{$post->id}/comments")
            ->assertStatus(200)
            ->assertJsonCount(0, 'comments');
    }

    public function test_index_returns_only_comments_for_specified_post(): void
    {
        $user = User::factory()->create();
        $post1 = Post::factory()->create();
        $post2 = Post::factory()->create();

        Comment::factory()->count(2)->create(['post_id' => $post1->id]);
        Comment::factory()->count(5)->create(['post_id' => $post2->id]);

        $this->actingAs($user)
            ->getJson("/api/v1/posts/{$post1->id}/comments")
            ->assertStatus(200)
            ->assertJsonCount(2, 'comments');
    }

    public function test_index_comment_includes_user_and_replies(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        $comment = Comment::factory()->create(['post_id' => $post->id]);

        $data = $this->actingAs($user)
            ->getJson("/api/v1/posts/{$post->id}/comments")
            ->json('comments.0');

        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('replies', $data);
        $this->assertArrayHasKey('likes_count', $data);
        $this->assertArrayHasKey('replies_count', $data);
    }

    public function test_index_returns_newest_comments_first(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $old = Comment::factory()->create(['post_id' => $post->id, 'created_at' => now()->subHour()]);
        $new = Comment::factory()->create(['post_id' => $post->id, 'created_at' => now()]);

        $data = $this->actingAs($user)
            ->getJson("/api/v1/posts/{$post->id}/comments")
            ->json('comments');

        $this->assertEquals($new->id, $data[0]['id']);
        $this->assertEquals($old->id, $data[1]['id']);
    }

    public function test_index_does_not_return_soft_deleted_comments(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        $comment = Comment::factory()->create(['post_id' => $post->id]);
        $comment->delete();

        $this->actingAs($user)
            ->getJson("/api/v1/posts/{$post->id}/comments")
            ->assertStatus(200)
            ->assertJsonCount(0, 'comments');
    }

    public function test_index_returns_404_for_non_existent_post(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/posts/99999/comments')
            ->assertStatus(404);
    }

    // ──────────────────────────────────────────────────────────────────────
    // STORE (POST /api/v1/posts/{post}/comments)
    // ──────────────────────────────────────────────────────────────────────

    public function test_store_requires_authentication(): void
    {
        $post = Post::factory()->create();

        $this->postJson("/api/v1/posts/{$post->id}/comments", ['content' => 'Hello'])
            ->assertStatus(401);
    }

    public function test_store_creates_comment_on_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $response = $this->actingAs($user)
            ->postJson("/api/v1/posts/{$post->id}/comments", [
                'content' => 'Great post!',
            ]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Comment added.'])
            ->assertJsonPath('comment.content', 'Great post!');

        $this->assertDatabaseHas('comments', [
            'post_id' => $post->id,
            'user_id' => $user->id,
            'content' => 'Great post!',
        ]);
    }

    public function test_store_comment_is_assigned_to_authenticated_user(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/posts/{$post->id}/comments", ['content' => 'My comment']);

        $this->assertDatabaseHas('comments', ['user_id' => $user->id, 'post_id' => $post->id]);
    }

    public function test_store_response_includes_user_relation(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/posts/{$post->id}/comments", ['content' => 'Test'])
            ->assertStatus(201)
            ->assertJsonStructure(['comment' => ['user']]);
    }

    public function test_store_fails_without_content(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/posts/{$post->id}/comments", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    public function test_store_fails_when_content_exceeds_max_length(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/posts/{$post->id}/comments", [
                'content' => str_repeat('a', 2001),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    public function test_store_returns_404_for_non_existent_post(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts/99999/comments', ['content' => 'Hello'])
            ->assertStatus(404);
    }

    // ──────────────────────────────────────────────────────────────────────
    // DESTROY (DELETE /api/v1/comments/{comment})
    // ──────────────────────────────────────────────────────────────────────

    public function test_destroy_requires_authentication(): void
    {
        $comment = Comment::factory()->create();

        $this->deleteJson("/api/v1/comments/{$comment->id}")
            ->assertStatus(401);
    }

    public function test_destroy_soft_deletes_own_comment(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->deleteJson("/api/v1/comments/{$comment->id}")
            ->assertStatus(200)
            ->assertJson(['message' => 'Comment deleted.']);

        $this->assertSoftDeleted('comments', ['id' => $comment->id]);
    }

    public function test_destroy_returns_403_when_deleting_another_users_comment(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
            ->deleteJson("/api/v1/comments/{$comment->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('comments', ['id' => $comment->id, 'deleted_at' => null]);
    }

    public function test_destroy_returns_404_for_non_existent_comment(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->deleteJson('/api/v1/comments/99999')
            ->assertStatus(404);
    }

    public function test_destroy_returns_404_for_already_deleted_comment(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $user->id]);
        $comment->delete();

        $this->actingAs($user)
            ->deleteJson("/api/v1/comments/{$comment->id}")
            ->assertStatus(404);
    }
}
