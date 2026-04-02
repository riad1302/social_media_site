<?php

namespace App\Services\Api\V1;

use App\Models\Like;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class LikeService
{
    /**
     * Toggle like on any likeable model (Post, Comment, Reply).
     * Returns ['liked' => bool, 'likes_count' => int].
     *
     * @return array{liked: bool, likes_count: int}
     */
    public function toggle(User $user, Model $likeable): array
    {
        $existing = Like::where('user_id', $user->id)
            ->where('likeable_id', $likeable->id)
            ->where('likeable_type', $likeable->getMorphClass())
            ->first();

        if ($existing !== null) {
            $existing->delete();
            $liked = false;
        } else {
            Like::create([
                'user_id' => $user->id,
                'likeable_id' => $likeable->id,
                'likeable_type' => $likeable->getMorphClass(),
            ]);
            $liked = true;
        }

        $likesCount = $likeable->likes()->count();

        return ['liked' => $liked, 'likes_count' => $likesCount];
    }

    /**
     * Return list of users who liked the given model.
     *
     * @return Collection<int, User>
     */
    public function likers(Model $likeable): Collection
    {
        return $likeable->likes()->with('user')->get()->pluck('user');
    }
}
