<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users', 'id', 'posts_user_id_fk')->cascadeOnDelete();
            $table->text('content');
            $table->string('image')->nullable();
            $table->enum('visibility', ['public', 'private'])->default('public');
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            $table->softDeletes();
            $table->timestamps();

            // Feed queries: public posts newest first
            $table->index(['visibility', 'created_at']);
            // Per-user feed: user's own posts newest first
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
