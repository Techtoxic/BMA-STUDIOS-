-- ============================================================
-- BMA Studios — Live Chat Handover Tables
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Chat sessions table
create table if not exists chat_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_token      text not null,
  status          text not null default 'waiting'
                    check (status in ('waiting', 'active', 'closed')),
  user_name       text,
  user_email      text,
  user_phone      text,
  ai_history      jsonb not null default '[]',
  created_at      timestamptz not null default now(),
  taken_over_at   timestamptz
);

-- Chat messages table (live messages post-handover)
create table if not exists chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references chat_sessions(id) on delete cascade,
  sender      text not null check (sender in ('user', 'admin')),
  content     text not null,
  created_at  timestamptz not null default now()
);

-- Index for fast message lookups
create index if not exists idx_chat_messages_session_id
  on chat_messages(session_id, created_at);

-- Index for filtering by status
create index if not exists idx_chat_sessions_status
  on chat_sessions(status, created_at desc);

-- Auto-close stale sessions older than 2 hours (optional cron via pg_cron)
-- Uncomment if you have pg_cron enabled in Supabase:
-- select cron.schedule(
--   'close-stale-chat-sessions',
--   '*/15 * * * *',
--   $$
--     update chat_sessions
--     set status = 'closed'
--     where status in ('waiting', 'active')
--       and created_at < now() - interval '2 hours';
--   $$
-- );
