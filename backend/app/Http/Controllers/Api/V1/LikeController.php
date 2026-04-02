<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Reply;
use App\Services\Api\V1\LikeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function __construct(private readonly LikeService $likeService) {}

    public function togglePost(Request $request, Post $post): JsonResponse
    {
        $result = $this->likeService->toggle($request->user(), $post);

        return response()->json($result);
    }

    public function toggleComment(Request $request, Comment $comment): JsonResponse
    {
        $result = $this->likeService->toggle($request->user(), $comment);

        return response()->json($result);
    }

    public function toggleReply(Request $request, Reply $reply): JsonResponse
    {
        $result = $this->likeService->toggle($request->user(), $reply);

        return response()->json($result);
    }

    public function postLikers(Post $post): JsonResponse
    {
        return response()->json(['likers' => $this->likeService->likers($post)]);
    }

    public function commentLikers(Comment $comment): JsonResponse
    {
        return response()->json(['likers' => $this->likeService->likers($comment)]);
    }

    public function replyLikers(Reply $reply): JsonResponse
    {
        return response()->json(['likers' => $this->likeService->likers($reply)]);
    }
}
