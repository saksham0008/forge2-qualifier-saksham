<?php

namespace App\Http\Controllers;

use App\Models\BoardList;
use App\Models\Card;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function store(Request $request, BoardList $list): JsonResponse
    {
        $data = $request->validate([
            'title'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'due_date'           => 'nullable|date',
            'assigned_member_id' => 'nullable|exists:members,id',
            'position'           => 'integer',
        ]);
        $data['list_id'] = $list->id;
        $data['position'] = $data['position'] ?? ($list->cards()->max('position') + 1);
        $card = Card::create($data);
        return response()->json($card->load(['tags', 'assignedMember', 'comments']), 201);
    }

    public function show(Card $card): JsonResponse
    {
        return response()->json($card->load(['tags', 'assignedMember', 'comments']));
    }

    public function update(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate([
            'title'              => 'sometimes|string|max:255',
            'description'        => 'nullable|string',
            'due_date'           => 'nullable|date',
            'assigned_member_id' => 'nullable|exists:members,id',
            'position'           => 'sometimes|integer',
            'list_id'            => 'sometimes|exists:lists,id',
        ]);
        $card->update($data);
        return response()->json($card->fresh(['tags', 'assignedMember', 'comments']));
    }

    public function destroy(Card $card): JsonResponse
    {
        $card->delete();
        return response()->json(null, 204);
    }

    public function syncTags(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate(['tag_ids' => 'required|array', 'tag_ids.*' => 'exists:tags,id']);
        $card->tags()->sync($data['tag_ids']);
        return response()->json($card->fresh(['tags', 'assignedMember', 'comments']));
    }

    public function move(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate([
            'list_id'  => 'required|exists:lists,id',
            'position' => 'required|integer',
        ]);
        $card->update($data);
        return response()->json($card->fresh(['tags', 'assignedMember', 'comments']));
    }
}
