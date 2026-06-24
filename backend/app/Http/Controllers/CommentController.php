<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate([
            'member_id' => 'required|exists:members,id',
            'body'      => 'required|string',
        ]);
        $data['card_id'] = $card->id;
        return response()->json(Comment::create($data)->load('member'), 201);
    }

    public function destroy(Card $card, Comment $comment): JsonResponse
    {
        $comment->delete();
        return response()->json(null, 204);
    }
}
