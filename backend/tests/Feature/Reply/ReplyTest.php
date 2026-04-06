<?php

namespace Tests\Feature\Reply;

use App\Models\Comment;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReplyTest extends TestCase
{
    use RefreshDatabase;

    // ──────────────────────────────────────────────────────────────────────
    // STORE (POST /api/v1/comments/{comment}/replies)
    // ──────────────────────────────────────────────────────────────────────

    public function test_store_requires_authentication(): void
    {
        $comment = Comment::factory()->create();

        $this->postJson("/api/v1/comments/{$comment->id}/replies", ['content' => 'My reply'])
            ->assertStatus(401);
    }

    public function test_store_creates_reply_on_comment(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $response = $this->actingAs($user)
            ->postJson("/api/v1/comments/{$comment->id}/replies", [
                'content' => 'My reply',
            ]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Reply added.'])
            ->assertJsonPath('reply.content', 'My reply');

        $this->assertDatabaseHas('replies', [
            'comment_id' => $comment->id,
            'user_id' => $user->id,
            'content' => 'My reply',
        ]);
    }

    public function test_store_reply_is_assigned_to_authenticated_user(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/comments/{$comment->id}/replies", ['content' => 'Test reply']);

        $this->assertDatabaseHas('replies', [
            'user_id' => $user->id,
            'comment_id' => $comment->id,
        ]);
    }

    public function test_store_response_includes_user_and_likes(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/comments/{$comment->id}/replies", ['content' => 'Test'])
            ->assertStatus(201)
            ->assertJsonStructure([
                'reply' => ['id', 'content', 'user', 'likes_count'],
            ]);
    }

    public function test_store_fails_without_content(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/comments/{$comment->id}/replies", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    public function test_store_fails_when_content_exceeds_max_length(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/comments/{$comment->id}/replies", [
                'content' => str_repeat('a', 2001),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    public function test_store_returns_404_for_non_existent_comment(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/comments/99999/replies', ['content' => 'Hello'])
            ->assertStatus(404);
    }

    public function test_store_accepts_content_at_max_length(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/comments/{$comment->id}/replies", [
                'content' => str_repeat('a', 2000),
            ])
            ->assertStatus(201);
    }

    // ──────────────────────────────────────────────────────────────────────
    // DESTROY (DELETE /api/v1/replies/{reply})
    // ──────────────────────────────────────────────────────────────────────

    public function test_destroy_requires_authentication(): void
    {
        $reply = Reply::factory()->create();

        $this->deleteJson("/api/v1/replies/{$reply->id}")
            ->assertStatus(401);
    }

    public function test_destroy_soft_deletes_own_reply(): void
    {
        $user = User::factory()->create();
        $reply = Reply::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->deleteJson("/api/v1/replies/{$reply->id}")
            ->assertStatus(200)
            ->assertJson(['message' => 'Reply deleted.']);

        $this->assertSoftDeleted('replies', ['id' => $reply->id]);
    }

    public function test_destroy_returns_403_when_deleting_another_users_reply(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $reply = Reply::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
            ->deleteJson("/api/v1/replies/{$reply->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('replies', ['id' => $reply->id, 'deleted_at' => null]);
    }

    public function test_destroy_returns_404_for_non_existent_reply(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->deleteJson('/api/v1/replies/99999')
            ->assertStatus(404);
    }

    public function test_destroy_returns_404_for_already_deleted_reply(): void
    {
        $user = User::factory()->create();
        $reply = Reply::factory()->create(['user_id' => $user->id]);
        $reply->delete();

        $this->actingAs($user)
            ->deleteJson("/api/v1/replies/{$reply->id}")
            ->assertStatus(404);
    }
}
