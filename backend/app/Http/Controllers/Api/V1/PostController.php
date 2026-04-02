<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Post\StorePostRequest;
use App\Models\Post;
use App\Services\Api\V1\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(private readonly PostService $postService) {}

    public function index(Request $request): JsonResponse
    {
        $feed = $this->postService->getFeed($request->user());

        return response()->json($feed);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->postService->createPost(
            user: $request->user(),
            content: $request->string('content')->value(),
            visibility: $request->input('visibility', 'public'),
            image: $request->hasFile('image') ? $request->file('image') : null,
        );

        return response()->json([
            'message' => 'Post created.',
            'post' => $post->load('user'),
        ], 201);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $this->postService->deletePost($post);

        return response()->json(['message' => 'Post deleted.']);
    }
}
