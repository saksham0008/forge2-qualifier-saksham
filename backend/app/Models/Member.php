<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    protected $fillable = ['name', 'email'];

    public function boards(): BelongsToMany
    {
        return $this->belongsToMany(Board::class, 'board_member');
    }

    public function assignedCards(): HasMany
    {
        return $this->hasMany(Card::class, 'assigned_member_id');
    }
}
