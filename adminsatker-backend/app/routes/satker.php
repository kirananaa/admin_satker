<?php

use App\Http\Controllers\Satker\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])->middleware('throttle:satker-login');

// Tanpa satker.scope: FE perlu daftar satker sebelum satker aktif dipilih.
Route::middleware(['auth:sanctum', 'satker.admin'])->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
});

// Route data modul fase berikutnya ditambahkan di sini.
Route::middleware(['auth:sanctum', 'satker.admin', 'satker.scope'])->group(function () {
    // Route::apiResource('units', UnitController::class)->except('destroy');
});