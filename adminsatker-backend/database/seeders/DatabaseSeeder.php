<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            'SUPER_ADMIN' => 'Super Admin', 'ADMIN_SATKER' => 'Admin Satker', 'KASATKER' => 'Kepala Satker',
            'KABID' => 'Kepala Bidang', 'KASUB' => 'Kepala Sub', 'STAFF' => 'Staf',
        ] as $kode => $nama) {
            DB::table('roles')->insert(['kode' => $kode, 'nama' => $nama]);
        }

        $satkerA = DB::table('unit_organisasi')->insertGetId(['parent_id' => null, 'kode' => 'SA', 'nama' => 'Satker A', 'jenis' => 'SATKER', 'aktif' => true]);
        DB::table('unit_organisasi')->insert(['parent_id' => $satkerA, 'kode' => 'SA-B1', 'nama' => 'Bidang 1 Satker A', 'jenis' => 'BIDANG', 'aktif' => true]);
        $satkerB = DB::table('unit_organisasi')->insertGetId(['parent_id' => null, 'kode' => 'SB', 'nama' => 'Satker B', 'jenis' => 'SATKER', 'aktif' => true]);

        $role = fn (string $kode) => DB::table('roles')->where('kode', $kode)->value('id');
        $password = Hash::make('rahasia123');

        $makeUser = function (string $username, ?int $unitId, string $roleKode) use ($password, $role) {
            $id = DB::table('users')->insertGetId([
                'username' => $username, 'email_login' => "{$username}@contoh.test",
                'password_hash' => $password, 'aktif' => true,
            ]);
            DB::table('user_role_scope')->insert([
                'user_id' => $id, 'role_id' => $role($roleKode), 'unit_id' => $unitId,
                'mulai' => now()->subDay(), 'selesai' => null,
            ]);

            return $id;
        };

        $makeUser('admin.a', $satkerA, 'ADMIN_SATKER');
        $makeUser('admin.b', $satkerB, 'ADMIN_SATKER');
        $makeUser('super', null, 'SUPER_ADMIN');

        // Akun dengan dua satker, untuk menguji pemilih satker.
        $multi = $makeUser('admin.ab', $satkerA, 'ADMIN_SATKER');
        DB::table('user_role_scope')->insert([
            'user_id' => $multi, 'role_id' => $role('ADMIN_SATKER'), 'unit_id' => $satkerB,
            'mulai' => now()->subDay(), 'selesai' => null,
        ]);
    }
}