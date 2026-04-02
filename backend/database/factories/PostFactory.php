<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'content' => fake()->paragraphs(fake()->numberBetween(1, 3), true),
            'image' => null,
            'visibility' => fake()->randomElement(['public', 'public', 'public', 'private']),
        ];
    }

    public function private(): static
    {
        return $this->state(['visibility' => 'private']);
    }

    public function public(): static
    {
        return $this->state(['visibility' => 'public']);
    }
}
