<?php

namespace App\Http\Requests\Api\V1\Post;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:5120'], // 5 MB
            'visibility' => ['nullable', 'in:public,private'],
        ];
    }
}
