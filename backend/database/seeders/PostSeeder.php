<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $users = User::all();

        // Create 20 posts distributed among existing users
        Post::factory(20)
            ->recycle($users)
            ->create()
            ->each(function (Post $post) use ($users): void {
                // 2–5 comments per post
                $commentCount = fake()->numberBetween(2, 5);
                $comments = Comment::factory($commentCount)
                    ->recycle($users)
                    ->create(['post_id' => $post->id]);

                // 0–3 replies per comment
                $comments->each(function (Comment $comment) use ($users): void {
                    $replyCount = fake()->numberBetween(0, 3);
                    if ($replyCount > 0) {
                        Reply::factory($replyCount)
                            ->recycle($users)
                            ->create(['comment_id' => $comment->id]);
                    }
                });

                // 0–8 likes on the post (unique users)
                $likers = $users->random(fake()->numberBetween(0, min(8, $users->count())));
                foreach ($likers as $liker) {
                    Like::firstOrCreate([
                        'user_id' => $liker->id,
                        'likeable_id' => $post->id,
                        'likeable_type' => Post::class,
                    ]);
                }
            });
    }
}
