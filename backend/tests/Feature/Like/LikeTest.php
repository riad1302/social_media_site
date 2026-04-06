<?php

namespace Tests\Feature\Like;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LikeTest extends TestCase
{
    use RefreshDatabase;

    // ──────────────────────────────────────────────────────────────────────
    // TOGGLE LIKE – POST
    // ──────────────────────────────────────────────────────────────────────

    public function test_toggle_post_like_requires_authentication(): void
    {
        $post = Post::factory()->create();

        $this->postJson("/api/v1/posts/{$post->id}/like")
            ->assertStatus(401);
    }

    public function test_toggle_post_like_creates_like(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/posts/{$post->id}/like")
            ->assertStatus(200)
            ->assertJson(['liked' => true, 'likes_count' => 1]);

        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => Post::class,
        ]);
    }

    public function test_toggle_post_like_removes_like_when_already_liked(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        Like::create([
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => Post::class,
        ]);

        $this->actingAs($user)
            ->postJson("/api/v1/posts/{$post->id}/like")
            ->assertStatus(200)
            ->assertJson(['liked' => false, 'likes_count' => 0]);

        $this->assertDatabaseMissing('likes', [
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => Post::class,
        ]);
    }

    public function test_toggle_post_like_returns_correct_count_with_multiple_likers(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $post = Post::factory()->create();

        // user2 already liked
        Like::create([
            'user_id' => $user2->id,
            'likeable_id' => $post->id,
            'likeable_type' => Post::class,
        ]);

        // user1 likes the post
        $this->actingAs($user1)
            ->postJson("/api/v1/posts/{$post->id}/like")
            ->assertJson(['liked' => true, 'likes_count' => 2]);
    }

    public function test_toggle_post_like_returns_404_for_non_existent_post(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts/99999/like')
            ->assertStatus(404);
    }

    // ──────────────────────────────────────────────────────────────────────
    // TOGGLE LIKE – COMMENT
    // ──────────────────────────────────────────────────────────────────────

    public function test_toggle_comment_like_requires_authentication(): void
    {
        $comment = Comment::factory()->create();

        $this->postJson("/api/v1/comments/{$comment->id}/like")
            ->assertStatus(401);
    }

    public function test_toggle_comment_like_creates_like(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/comments/{$comment->id}/like")
            ->assertStatus(200)
            ->assertJson(['liked' => true, 'likes_count' => 1]);

        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'likeable_id' => $comment->id,
            'likeable_type' => Comment::class,
        ]);
    }

    public function test_toggle_comment_like_removes_like_when_already_liked(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create();

        Like::create([
            'user_id' => $user->id,
            'likeable_id' => $comment->id,
            'likeable_type' => Comment::class,
        ]);

        $this->actingAs($user)
            ->postJson("/api/v1/comments/{$comment->id}/like")
            ->assertStatus(200)
            ->assertJson(['liked' => false, 'likes_count' => 0]);
    }

    public function test_toggle_comment_like_returns_404_for_non_existent_comment(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/comments/99999/like')
            ->assertStatus(404);
    }

    // ──────────────────────────────────────────────────────────────────────
    // TOGGLE LIKE – REPLY
    // ──────────────────────────────────────────────────────────────────────

    public function test_toggle_reply_like_requires_authentication(): void
    {
        $reply = Reply::factory()->create();

        $this->postJson("/api/v1/replies/{$reply->id}/like")
            ->assertStatus(401);
    }

    public function test_toggle_reply_like_creates_like(): void
    {
        $user = User::factory()->create();
        $reply = Reply::factory()->create();

        $this->actingAs($user)
            ->postJson("/api/v1/replies/{$reply->id}/like")
            ->assertStatus(200)
            ->assertJson(['liked' => true, 'likes_count' => 1]);

        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'likeable_id' => $reply->id,
            'likeable_type' => Reply::class,
        ]);
    }

    public function test_toggle_reply_like_removes_like_when_already_liked(): void
    {
        $user = User::factory()->create();
        $reply = Reply::factory()->create();

        Like::create([
            'user_id' => $user->id,
            'likeable_id' => $reply->id,
            'likeable_type' => Reply::class,
        ]);

        $this->actingAs($user)
            ->postJson("/api/v1/replies/{$reply->id}/like")
            ->assertStatus(200)
            ->assertJson(['liked' => false, 'likes_count' => 0]);
    }

    public function test_toggle_reply_like_returns_404_for_non_existent_reply(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/replies/99999/like')
            ->assertStatus(404);
    }

    // ──────────────────────────────────────────────────────────────────────
    // LIKERS – POST
    // ──────────────────────────────────────────────────────────────────────

    public function test_post_likers_requires_authentication(): void
    {
        $post = Post::factory()->create();

        $this->getJson("/api/v1/posts/{$post->id}/likers")
            ->assertStatus(401);
    }

    public function test_post_likers_returns_users_who_liked(): void
    {
        $viewer = User::factory()->create();
        $liker1 = User::factory()->create();
        $liker2 = User::factory()->create();
        $post = Post::factory()->create();

        Like::create(['user_id' => $liker1->id, 'likeable_id' => $post->id, 'likeable_type' => Post::class]);
        Like::create(['user_id' => $liker2->id, 'likeable_id' => $post->id, 'likeable_type' => Post::class]);

        $this->actingAs($viewer)
            ->getJson("/api/v1/posts/{$post->id}/likers")
            ->assertStatus(200)
            ->assertJsonCount(2, 'likers');
    }

    public function test_post_likers_returns_empty_when_no_likes(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user)
            ->getJson("/api/v1/posts/{$post->id}/likers")
            ->assertStatus(200)
            ->assertJsonCount(0, 'likers');
    }

    public function test_post_likers_liker_data_contains_user_fields(): void
    {
        $viewer = User::factory()->create();
        $liker = User::factory()->create();
        $post = Post::factory()->create();

        Like::create(['user_id' => $liker->id, 'likeable_id' => $post->id, 'likeable_type' => Post::class]);

        $likers = $this->actingAs($viewer)
            ->getJson("/api/v1/posts/{$post->id}/likers")
            ->json('likers');

        $this->assertEquals($liker->id, $likers[0]['id']);
        $this->assertEquals($liker->email, $likers[0]['email']);
    }

    public function test_post_likers_returns_404_for_non_existent_post(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/posts/99999/likers')
            ->assertStatus(404);
    }

    // ──────────────────────────────────────────────────────────────────────
    // LIKERS – COMMENT
    // ──────────────────────────────────────────────────────────────────────

    public function test_comment_likers_requires_authentication(): void
    {
        $comment = Comment::factory()->create();

        $this->getJson("/api/v1/comments/{$comment->id}/likers")
            ->assertStatus(401);
    }

    public function test_comment_likers_returns_users_who_liked(): void
    {
        $viewer = User::factory()->create();
        $liker = User::factory()->create();
        $comment = Comment::factory()->create();

        Like::create(['user_id' => $liker->id, 'likeable_id' => $comment->id, 'likeable_type' => Comment::class]);

        $this->actingAs($viewer)
            ->getJson("/api/v1/comments/{$comment->id}/likers")
            ->assertStatus(200)
            ->assertJsonCount(1, 'likers');
    }

    public function test_comment_likers_returns_404_for_non_existent_comment(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/comments/99999/likers')
            ->assertStatus(404);
    }

    // ──────────────────────────────────────────────────────────────────────
    // LIKERS – REPLY
    // ──────────────────────────────────────────────────────────────────────

    public function test_reply_likers_requires_authentication(): void
    {
        $reply = Reply::factory()->create();

        $this->getJson("/api/v1/replies/{$reply->id}/likers")
            ->assertStatus(401);
    }

    public function test_reply_likers_returns_users_who_liked(): void
    {
        $viewer = User::factory()->create();
        $liker = User::factory()->create();
        $reply = Reply::factory()->create();

        Like::create(['user_id' => $liker->id, 'likeable_id' => $reply->id, 'likeable_type' => Reply::class]);

        $this->actingAs($viewer)
            ->getJson("/api/v1/replies/{$reply->id}/likers")
            ->assertStatus(200)
            ->assertJsonCount(1, 'likers');
    }

    public function test_reply_likers_returns_404_for_non_existent_reply(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/replies/99999/likers')
            ->assertStatus(404);
    }

    // ──────────────────────────────────────────────────────────────────────
    // DUPLICATE LIKE PREVENTION
    // ──────────────────────────────────────────────────────────────────────

    public function test_same_user_cannot_like_same_post_twice(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        // First like
        $this->actingAs($user)->postJson("/api/v1/posts/{$post->id}/like");
        // Second call should toggle off (unlike), not create a second like
        $this->actingAs($user)->postJson("/api/v1/posts/{$post->id}/like");

        $this->assertDatabaseCount('likes', 0);
    }

    public function test_different_users_can_each_like_the_same_post(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user1)->postJson("/api/v1/posts/{$post->id}/like");
        $this->actingAs($user2)->postJson("/api/v1/posts/{$post->id}/like");

        $this->assertDatabaseCount('likes', 2);
    }
}
