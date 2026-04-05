<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostSeeder extends Seeder
{
    use WithoutModelEvents;

    private const TOTAL_POSTS = 500;
    private const CHUNK_SIZE  = 100;

    public function run(): void
    {
        $userIds   = User::pluck('id')->all();
        $now       = now()->toDateTimeString();
        $postClass = Post::class;

        $chunks = (int) ceil(self::TOTAL_POSTS / self::CHUNK_SIZE);

        for ($chunk = 0; $chunk < $chunks; $chunk++) {
            $postsInChunk = min(self::CHUNK_SIZE, self::TOTAL_POSTS - $chunk * self::CHUNK_SIZE);

            // ── Build posts ───────────────────────────────────────────────
            $postRows = [];
            for ($i = 0; $i < $postsInChunk; $i++) {
                $postRows[] = [
                    'user_id'    => fake()->randomElement($userIds),
                    'content'    => fake()->paragraphs(fake()->numberBetween(1, 3), true),
                    'image'      => null,
                    'visibility' => fake()->randomElement(['public', 'public', 'public', 'private']),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            DB::table('posts')->insert($postRows);

            // Fetch the IDs just inserted
            $postIds = DB::table('posts')
                ->orderByDesc('id')
                ->limit($postsInChunk)
                ->pluck('id')
                ->all();

            // ── Build comments ────────────────────────────────────────────
            $commentRows = [];
            foreach ($postIds as $postId) {
                $count = fake()->numberBetween(1, 6);
                for ($j = 0; $j < $count; $j++) {
                    $commentRows[] = [
                        'post_id'    => $postId,
                        'user_id'    => fake()->randomElement($userIds),
                        'content'    => fake()->sentences(fake()->numberBetween(1, 3), true),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            DB::table('comments')->insert($commentRows);

            // Fetch comment IDs just inserted
            $commentIds = DB::table('comments')
                ->orderByDesc('id')
                ->limit(count($commentRows))
                ->pluck('id')
                ->all();

            // ── Build replies ─────────────────────────────────────────────
            $replyRows = [];
            foreach ($commentIds as $commentId) {
                $count = fake()->numberBetween(0, 4);
                for ($k = 0; $k < $count; $k++) {
                    $replyRows[] = [
                        'comment_id' => $commentId,
                        'user_id'    => fake()->randomElement($userIds),
                        'content'    => fake()->sentences(fake()->numberBetween(1, 2), true),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            if ($replyRows) {
                DB::table('replies')->insert($replyRows);
            }

            // ── Build likes (unique user+post combos) ─────────────────────
            $likeRows = [];
            foreach ($postIds as $postId) {
                $likerIds = (array) fake()->randomElements($userIds, fake()->numberBetween(0, min(15, count($userIds))));
                foreach ($likerIds as $userId) {
                    $likeRows[] = [
                        'user_id'       => $userId,
                        'likeable_id'   => $postId,
                        'likeable_type' => $postClass,
                        'created_at'    => $now,
                        'updated_at'    => $now,
                    ];
                }
            }

            if ($likeRows) {
                // insertOrIgnore handles the unique constraint gracefully
                DB::table('likes')->insertOrIgnore($likeRows);
            }

            $done = ($chunk + 1) * self::CHUNK_SIZE;
            $this->command->info("Chunk " . ($chunk + 1) . "/{$chunks} done — ~{$done} posts seeded");
        }
    }
}
