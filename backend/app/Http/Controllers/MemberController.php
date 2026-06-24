<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Member::all());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|max:255', 'email' => 'required|email|unique:members,email']);
        return response()->json(Member::create($data), 201);
    }

    public function destroy(Member $member): JsonResponse
    {
        $member->delete();
        return response()->json(null, 204);
    }
}
