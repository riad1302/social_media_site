<?php

namespace App\Services\Api\V1;

use App\Models\Comment;
use App\Models\Reply;
use App\Models\User;

class ReplyService
{
    public function addReply(Comment $comment, User $user, string $content): Reply
    {
        $reply = Reply::create([
            'comment_id' => $comment->id,
            'user_id' => $user->id,
            'content' => $content,
        ]);

        $reply->load('user');
        $reply->setRelation('likes', collect());
        $reply->likes_count = 0;

        return $reply;
    }

    public function deleteReply(Reply $reply): void
    {
        $reply->delete();
    }
}
