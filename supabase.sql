-- Supabase SQL Editor에 그대로 붙여넣고 실행하세요.

create table if not exists signups (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  consent_privacy boolean not null default false,
  consent_marketing boolean not null default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  created_at timestamptz not null default now()
);

-- 이메일 중복 신청 방지
create unique index if not exists signups_email_unique on signups (email);

-- RLS(Row Level Security) 활성화 — 이게 꺼져 있으면 01-4 보안 점검에서 걸립니다.
alter table signups enable row level security;

-- 클라이언트(anon key)는 조회를 전혀 못 하고, 서버(service role key)만 접근 가능합니다.
-- 별도 select/insert policy를 만들지 않으면 anon 키로는 아무 것도 못 하고,
-- 서버 함수(api/*.js)는 SUPABASE_SERVICE_ROLE_KEY로 RLS를 우회해 접근합니다.
-- 즉 이 프로젝트는 클라이언트에 Supabase 키를 아예 노출하지 않는 구조입니다.
