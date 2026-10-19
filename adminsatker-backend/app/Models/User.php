<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'users';
    public $timestamps = false;

    protected $fillable = ['pegawai_id', 'username', 'email_login', 'password_hash', 'aktif'];
    protected $hidden = ['password_hash'];
    protected $casts = ['aktif' => 'boolean'];

    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }
}