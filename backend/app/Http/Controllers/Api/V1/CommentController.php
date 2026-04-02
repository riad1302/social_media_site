<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Comment\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use App\Services\Api\V1\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(private readonly CommentService $commentService) {}

    public function index(Post $post): JsonResponse
    {
        $comments = $this->commentService->getPostComments($post);

        return response()->json(['comments' => $comments]);
    }

    public function store(StoreCommentRequest $request, Post $post): JsonResponse
    {
        $comment = $this->commentService->addComment(
            post: $post,
            user: $request->user(),
            content: $request->string('content')->value(),
        );

        return response()->json(['message' => 'Comment added.', 'comment' => $comment], 201);
    }

    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $this->commentService->deleteComment($comment);

        return response()->json(['message' => 'Comment deleted.']);
    }
}
