<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

// Boards
Route::apiResource('boards', BoardController::class);
Route::post('boards/{board}/members', [BoardController::class, 'addMember']);

// Lists (nested under board)
Route::post('boards/{board}/lists', [ListController::class, 'store']);
Route::put('boards/{board}/lists/{list}', [ListController::class, 'update']);
Route::delete('boards/{board}/lists/{list}', [ListController::class, 'destroy']);

// Cards (nested under list)
Route::post('lists/{list}/cards', [CardController::class, 'store']);
Route::get('cards/{card}', [CardController::class, 'show']);
Route::put('cards/{card}', [CardController::class, 'update']);
Route::delete('cards/{card}', [CardController::class, 'destroy']);
Route::post('cards/{card}/move', [CardController::class, 'move']);
Route::post('cards/{card}/tags', [CardController::class, 'syncTags']);

// Comments
Route::post('cards/{card}/comments', [CommentController::class, 'store']);
Route::delete('cards/{card}/comments/{comment}', [CommentController::class, 'destroy']);

// Tags & Members
Route::apiResource('tags', TagController::class)->only(['index', 'store', 'destroy']);
Route::apiResource('members', MemberController::class)->only(['index', 'store', 'destroy']);
