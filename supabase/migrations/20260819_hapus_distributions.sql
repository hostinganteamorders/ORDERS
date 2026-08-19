-- =============================================
-- ORDERS Admin Panel - Migration 2026-08-19
-- Hapus distributions (bagi hasil kini via payouts)
-- Jalankan SEKALI di Supabase SQL Editor.
-- PERHATIAN: menghapus riwayat bagi hasil yang tersimpan.
-- =============================================
drop table if exists public.distributions cascade;