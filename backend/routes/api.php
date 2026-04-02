<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\LikeController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\ReplyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {

    // ── Auth (public) ────────────────────────────────────────────────────────
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    // ── Protected ────────────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function (): void {

        // Auth
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);

        // Posts
        Route::get('posts', [PostController::class, 'index']);
        Route::post('posts', [PostController::class, 'store']);
        Route::delete('posts/{post}', [PostController::class, 'destroy']);

        // Comments
        Route::get('posts/{post}/comments', [CommentController::class, 'index']);
        Route::post('posts/{post}/comments', [CommentController::class, 'store']);
        Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

        // Replies
        Route::post('comments/{comment}/replies', [ReplyController::class, 'store']);
        Route::delete('replies/{reply}', [ReplyController::class, 'destroy']);

        // Likes – toggle
        Route::post('posts/{post}/like', [LikeController::class, 'togglePost']);
        Route::post('comments/{comment}/like', [LikeController::class, 'toggleComment']);
        Route::post('replies/{reply}/like', [LikeController::class, 'toggleReply']);

        // Likes – who liked
        Route::get('posts/{post}/likers', [LikeController::class, 'postLikers']);
        Route::get('comments/{comment}/likers', [LikeController::class, 'commentLikers']);
        Route::get('replies/{reply}/likers', [LikeController::class, 'replyLikers']);
    });
});
