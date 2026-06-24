<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Board extends Model
{
    protected $fillable = ['name', 'description'];

    public function lists(): HasMany
    {
        return $this->hasMany(BoardList::class)->orderBy('position');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'board_member');
    }
}
