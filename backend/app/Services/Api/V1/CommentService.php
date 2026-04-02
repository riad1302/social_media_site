<?php

namespace App\Services\Api\V1;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class CommentService
{
    /** @return Collection<int, Comment> */
    public function getPostComments(Post $post): Collection
    {
        return $post->comments()
            ->with(['user', 'likes', 'replies.user', 'replies.likes'])
            ->withCount(['likes', 'replies'])
            ->latest()
            ->get();
    }

    public function addComment(Post $post, User $user, string $content): Comment
    {
        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'content' => $content,
        ]);

        $comment->load('user');
        $comment->setRelation('likes', collect());
        $comment->setRelation('replies', collect());
        $comment->likes_count = 0;
        $comment->replies_count = 0;

        return $comment;
    }

    public function deleteComment(Comment $comment): void
    {
        $comment->delete();
    }
}
