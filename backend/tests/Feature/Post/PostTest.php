<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    // ──────────────────────────────────────────────────────────────────────
    // FEED (GET /api/v1/posts)
    // ──────────────────────────────────────────────────────────────────────

    public function test_feed_requires_authentication(): void
    {
        $this->getJson('/api/v1/posts')
            ->assertStatus(401);
    }

    public function test_feed_returns_paginated_public_posts(): void
    {
        $user = User::factory()->create();
        Post::factory()->count(3)->public()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/posts')
            ->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_feed_includes_own_private_posts(): void
    {
        $user = User::factory()->create();
        Post::factory()->private()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/posts');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_feed_excludes_other_users_private_posts(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Post::factory()->private()->create(['user_id' => $other->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/posts');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }

    public function test_feed_returns_public_and_own_private_but_not_others_private(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Post::factory()->public()->create();                               // visible
        Post::factory()->private()->create(['user_id' => $user->id]);     // visible
        Post::factory()->private()->create(['user_id' => $other->id]);    // hidden

        $response = $this->actingAs($user)->getJson('/api/v1/posts');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_feed_returns_posts_newest_first(): void
    {
        $user = User::factory()->create();

        $old = Post::factory()->public()->create(['created_at' => now()->subDays(2)]);
        $new = Post::factory()->public()->create(['created_at' => now()]);

        $data = $this->actingAs($user)
            ->getJson('/api/v1/posts')
            ->assertStatus(200)
            ->json('data');

        $this->assertEquals($new->id, $data[0]['id']);
        $this->assertEquals($old->id, $data[1]['id']);
    }

    public function test_feed_does_not_return_soft_deleted_posts(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->public()->create();
        $post->delete();

        $response = $this->actingAs($user)->getJson('/api/v1/posts');

        $this->assertCount(0, $response->json('data'));
    }

    public function test_feed_has_cursor_pagination_structure(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/posts')
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'path', 'per_page', 'next_cursor', 'prev_cursor']);
    }

    public function test_feed_post_includes_user_and_counts(): void
    {
        $user = User::factory()->create();
        Post::factory()->public()->create(['user_id' => $user->id]);

        $data = $this->actingAs($user)
            ->getJson('/api/v1/posts')
            ->json('data.0');

        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('likes_count', $data);
        $this->assertArrayHasKey('comments_count', $data);
    }

    // ──────────────────────────────────────────────────────────────────────
    // STORE (POST /api/v1/posts)
    // ──────────────────────────────────────────────────────────────────────

    public function test_store_requires_authentication(): void
    {
        $this->postJson('/api/v1/posts', ['content' => 'Hello'])
            ->assertStatus(401);
    }

    public function test_store_creates_public_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/posts', [
                'content' => 'My first post',
                'visibility' => 'public',
            ]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Post created.'])
            ->assertJsonPath('post.content', 'My first post')
            ->assertJsonPath('post.visibility', 'public');

        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'content' => 'My first post',
            'visibility' => 'public',
        ]);
    }

    public function test_store_creates_private_post(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', [
                'content' => 'My private post',
                'visibility' => 'private',
            ])
            ->assertStatus(201)
            ->assertJsonPath('post.visibility', 'private');
    }

    public function test_store_defaults_visibility_to_public(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', ['content' => 'No visibility set'])
            ->assertStatus(201);

        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'visibility' => 'public',
        ]);
    }

    public function test_store_with_image_uploads_file(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', [
                'content' => 'Post with image',
                'image' => UploadedFile::fake()->create('photo.jpg', 100, 'image/jpeg'),
            ])
            ->assertStatus(201);

        $post = Post::where('user_id', $user->id)->first();
        $this->assertNotNull($post->image);
        Storage::disk('public')->assertExists($post->image);
    }

    public function test_store_fails_without_content(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    public function test_store_fails_when_content_exceeds_max_length(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', [
                'content' => str_repeat('a', 5001),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    public function test_store_fails_with_invalid_visibility(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', [
                'content' => 'Some content',
                'visibility' => 'friends-only',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['visibility']);
    }

    public function test_store_fails_when_image_exceeds_max_size(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', [
                'content' => 'Post with huge image',
                'image' => UploadedFile::fake()->create('big.jpg', 5121, 'image/jpeg'),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['image']);
    }

    public function test_store_fails_when_image_is_not_an_image_file(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', [
                'content' => 'Post with pdf',
                'image' => UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['image']);
    }

    public function test_store_post_is_assigned_to_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/posts', ['content' => 'Ownership test']);

        $this->assertDatabaseHas('posts', ['user_id' => $user->id, 'content' => 'Ownership test']);
    }

    // ──────────────────────────────────────────────────────────────────────
    // DESTROY (DELETE /api/v1/posts/{post})
    // ──────────────────────────────────────────────────────────────────────

    public function test_destroy_requires_authentication(): void
    {
        $post = Post::factory()->create();

        $this->deleteJson("/api/v1/posts/{$post->id}")
            ->assertStatus(401);
    }

    public function test_destroy_soft_deletes_own_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->deleteJson("/api/v1/posts/{$post->id}")
            ->assertStatus(200)
            ->assertJson(['message' => 'Post deleted.']);

        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }

    public function test_destroy_deletes_associated_image(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $imagePath = 'posts/test-image.jpg';
        Storage::disk('public')->put($imagePath, 'fake-image-content');

        $post = Post::factory()->create(['user_id' => $user->id, 'image' => $imagePath]);

        $this->actingAs($user)
            ->deleteJson("/api/v1/posts/{$post->id}")
            ->assertStatus(200);

        Storage::disk('public')->assertMissing($imagePath);
    }

    public function test_destroy_returns_403_when_deleting_another_users_post(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
            ->deleteJson("/api/v1/posts/{$post->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'deleted_at' => null]);
    }

    public function test_destroy_returns_404_for_non_existent_post(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->deleteJson('/api/v1/posts/99999')
            ->assertStatus(404);
    }

    public function test_destroy_returns_404_for_already_deleted_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);
        $post->delete();

        $this->actingAs($user)
            ->deleteJson("/api/v1/posts/{$post->id}")
            ->assertStatus(404);
    }
}
