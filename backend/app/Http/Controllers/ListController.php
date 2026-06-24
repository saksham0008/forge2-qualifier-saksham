<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListController extends Controller
{
    public function store(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:255', 'position' => 'integer']);
        $data['board_id'] = $board->id;
        $data['position'] = $data['position'] ?? ($board->lists()->max('position') + 1);
        return response()->json(BoardList::create($data), 201);
    }

    public function update(Request $request, Board $board, BoardList $list): JsonResponse
    {
        $data = $request->validate(['name' => 'sometimes|string|max:255', 'position' => 'sometimes|integer']);
        $list->update($data);
        return response()->json($list);
    }

    public function destroy(Board $board, BoardList $list): JsonResponse
    {
        $list->delete();
        return response()->json(null, 204);
    }
}
