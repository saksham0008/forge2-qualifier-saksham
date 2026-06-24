<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Board::with(['members'])->orderByDesc('created_at')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:255', 'description' => 'nullable|string']);
        return response()->json(Board::create($data), 201);
    }

    public function show(Board $board): JsonResponse
    {
        return response()->json($board->load([
            'lists.cards.tags',
            'lists.cards.assignedMember',
            'lists.cards.comments',
            'members',
        ]));
    }

    public function update(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate(['name' => 'sometimes|string|max:255', 'description' => 'nullable|string']);
        $board->update($data);
        return response()->json($board);
    }

    public function destroy(Board $board): JsonResponse
    {
        $board->delete();
        return response()->json(null, 204);
    }

    public function addMember(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate(['member_id' => 'required|exists:members,id']);
        $board->members()->syncWithoutDetaching([$data['member_id']]);
        return response()->json($board->load('members'));
    }
}
