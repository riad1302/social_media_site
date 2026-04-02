<?php

namespace App\Services\Api\V1;

use App\Models\Post;
use App\Models\User;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PostService
{
    /**
     * Return paginated feed: public posts + own private posts, newest first.
     */
    public function getFeed(User $user, int $perPage = 15): CursorPaginator
    {
        return Post::with(['user', 'likes'])
            ->where(function ($query) use ($user): void {
                $query->where('visibility', 'public')
                    ->orWhere(function ($q) use ($user): void {
                        $q->where('visibility', 'private')
                            ->where('user_id', $user->id);
                    });
            })
            ->withCount(['likes', 'comments'])
            ->latest()
            ->cursorPaginate($perPage);
    }

    public function createPost(User $user, string $content, string $visibility, ?UploadedFile $image = null): Post
    {
        $imagePath = null;

        if ($image !== null) {
            $imagePath = $image->store('posts', 'public');
        }

        return Post::create([
            'user_id' => $user->id,
            'content' => $content,
            'image' => $imagePath,
            'visibility' => $visibility,
        ]);
    }

    public function deletePost(Post $post): void
    {
        if ($post->image !== null) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();
    }
}
