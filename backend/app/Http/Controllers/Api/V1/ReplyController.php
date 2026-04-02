<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Reply\StoreReplyRequest;
use App\Models\Comment;
use App\Models\Reply;
use App\Services\Api\V1\ReplyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReplyController extends Controller
{
    public function __construct(private readonly ReplyService $replyService) {}

    public function store(StoreReplyRequest $request, Comment $comment): JsonResponse
    {
        $reply = $this->replyService->addReply(
            comment: $comment,
            user: $request->user(),
            content: $request->string('content')->value(),
        );

        return response()->json(['message' => 'Reply added.', 'reply' => $reply], 201);
    }

    public function destroy(Request $request, Reply $reply): JsonResponse
    {
        if ($reply->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $this->replyService->deleteReply($reply);

        return response()->json(['message' => 'Reply deleted.']);
    }
}
