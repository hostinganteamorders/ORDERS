#!/usr/bin/env node
/**
 * Seed script untuk membuat akun member & admin di Supabase.
 *
 * Cara pakai:
 *   1. Salin .env.example ke .env.local dan isi variable Supabase
 *   2. Jalankan: node --env-file=.env.local scripts/seed.mjs
 *
 * Default password: Orders123! (ubah di bawah)
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
)

const DEFAULT_PASSWORD = 'Orders123!'

const members = [
  { name: 'Aldy', role: 'Team Leader', is_admin: true, email: 'aldy@ordersapp.tech' },
  { name: 'Owen', role: 'Project Manager', is_admin: false, email: 'owen@ordersapp.tech' },
  { name: 'Natasya', role: 'Finance Officer', is_admin: false, email: 'natasya@ordersapp.tech' },
  { name: 'Kevin', role: 'Developer', is_admin: false, email: 'kevin@ordersapp.tech' },
  { name: 'Rizky', role: 'UI/UX Designer', is_admin: false, email: 'rizky@ordersapp.tech' },
  { name: 'Jazel', role: 'Quality Control', is_admin: false, email: 'jazel@ordersapp.tech' },
  { name: 'Giordyano', role: 'Creative Director', is_admin: false, email: 'giordyano@ordersapp.tech' },
  { name: 'Friesta', role: 'Team Creative', is_admin: false, email: 'friesta@ordersapp.tech' },
  { name: 'Given', role: 'Human Relations', is_admin: false, email: 'given@ordersapp.tech' },
  { name: 'Calvin', role: 'Media & Technical', is_admin: false, email: 'calvin@ordersapp.tech' },
]

const avatars = {
  Aldy: '/images/team/p1.png',
  Kevin: '/images/team/p2.png',
  Jazel: '/images/team/p3.png',
  Friesta: '/images/team/p4.png',
  Owen: '/images/team/p5.png',
  Rizky: '/images/team/p7.png',
  Giordyano: '/images/team/p8.png',
  Given: '/images/team/p9.jpeg',
  Natasya: '/images/team/p10.png',
  Calvin: '/images/team/Calvin%20Kakase.png',
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env.local')
    process.exit(1)
  }

  console.log('Memulai seeding...\n')

  for (const member of members) {
    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: member.email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: member.name },
    })
    const user = data?.user ?? data

    if (error) {
      // Skip if user already exists, try to fetch
      if (error.message?.includes('already been registered')) {
        const { data: existing } = await supabase.auth.admin.listUsers()
        const found = existing?.users.find((u) => u.email === member.email)
        if (found) {
          console.log(`~ ${member.email} sudah ada (id: ${found.id})`)
          await upsertProfile(found.id, member)
        }
      } else {
        console.error(`✗ Gagal membuat ${member.email}: ${error.message}`)
      }
      continue
    }

    if (user) {
      console.log(`✓ User dibuat: ${member.email}`)
      await upsertProfile(user.id, member)
    }
  }

  console.log('\nSelesai. Semua akun memakai password: ' + DEFAULT_PASSWORD)
  console.log('Ganti password lewat Supabase Auth Admin bila perlu.')
}

async function upsertProfile(userId, member) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name: member.name,
      role: member.role,
      is_admin: member.is_admin,
      avatar_url: avatars[member.name] ?? null,
    })

  if (error) {
    console.error(`✗ Gagal insert profile ${member.name}: ${error.message}`)
  } else {
    console.log(`✓ Profile dibuat: ${member.name} (${member.role}${member.is_admin ? ', ADMIN' : ''})`)
  }
}

main()
