<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_organisasi', function (Blueprint $t) {
            $t->id();
            $t->foreignId('parent_id')->nullable()->constrained('unit_organisasi')->restrictOnDelete();
            $t->string('kode', 50)->unique();
            $t->string('nama');
            $t->string('jenis', 20); // SATKER BIDANG BAGIAN SUBBIDANG SUBBAGIAN
            $t->boolean('aktif')->default(true);
            $t->index('parent_id', 'unit_parent_idx');
        });

        Schema::create('pegawai', function (Blueprint $t) {
            $t->id();
            $t->string('nip', 30)->nullable()->unique();
            $t->string('nama');
            $t->string('email_kontak')->nullable();
            $t->string('jenis_kepegawaian', 30);
            $t->boolean('aktif')->default(true);
        });

        Schema::create('users', function (Blueprint $t) {
            $t->id();
            $t->foreignId('pegawai_id')->nullable()->unique()->constrained('pegawai')->restrictOnDelete();
            $t->string('username', 100)->unique();
            $t->string('email_login')->unique();
            $t->string('password_hash');
            $t->boolean('aktif')->default(true);
        });

        Schema::create('roles', function (Blueprint $t) {
            $t->id();
            $t->string('kode', 30)->unique(); // SUPER_ADMIN ADMIN_SATKER KASATKER KABID KASUB STAFF
            $t->string('nama');
        });

        Schema::create('user_role_scope', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $t->foreignId('role_id')->constrained('roles')->restrictOnDelete();
            $t->foreignId('unit_id')->nullable()->constrained('unit_organisasi')->restrictOnDelete(); // NULL hanya SUPER_ADMIN
            $t->dateTime('mulai');
            $t->dateTime('selesai')->nullable();
            $t->unique(['user_id', 'role_id', 'unit_id', 'mulai'], 'urs_unique');
            $t->index(['user_id', 'role_id', 'unit_id'], 'urs_user_role_unit_idx');
        });

        Schema::create('log_audit', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('entitas', 100);
            $t->unsignedBigInteger('entitas_id');
            $t->string('aksi', 20);
            $t->json('data_lama')->nullable();
            $t->json('data_baru')->nullable();
            $t->string('ip_address', 45)->nullable();
            $t->dateTime('waktu');
            $t->index(['entitas', 'entitas_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_audit');
        Schema::dropIfExists('user_role_scope');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('users');
        Schema::dropIfExists('pegawai');
        Schema::dropIfExists('unit_organisasi');
    }
};