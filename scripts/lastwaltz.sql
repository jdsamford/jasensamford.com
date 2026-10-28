-- Last Waltz set list storage (applied to the Gatefolded Supabase project).
-- The table lives in its own schema, which the Supabase API does not expose.
-- The page only reaches it through the two functions below, which check the
-- band password server-side (SHA-256 of the lowercased password).
-- To remove everything after the show:
--   drop function public.lastwaltz_submit, public.lastwaltz_results; drop schema lastwaltz cascade;

create schema if not exists lastwaltz;
revoke all on schema lastwaltz from public, anon, authenticated;

create table if not exists lastwaltz.submissions (
  name_key    text primary key,              -- lower(trim(name)), so resubmitting replaces your last order
  name        text not null,
  track_order text[] not null,                -- song titles in the proposed order
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table lastwaltz.submissions enable row level security;

create or replace function lastwaltz.check_password(p_password text)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if encode(sha256(convert_to(lower(trim(coalesce(p_password, ''))), 'UTF8')), 'hex')
     <> '<sha256 hex of the lowercased password>' then
    raise exception 'invalid password' using errcode = '28P01';
  end if;
end;
$$;

create or replace function public.lastwaltz_submit(p_password text, p_name text, p_order text[], p_notes text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := trim(coalesce(p_name, ''));
begin
  perform lastwaltz.check_password(p_password);
  if length(v_name) < 1 or length(v_name) > 80 then
    raise exception 'name must be 1-80 characters';
  end if;
  if p_order is null or cardinality(p_order) < 1 or cardinality(p_order) > 100
     or (select count(distinct t) from unnest(p_order) t) <> cardinality(p_order)
     or exists (select 1 from unnest(p_order) t where t is null or length(t) > 200) then
    raise exception 'invalid order';
  end if;
  if length(coalesce(p_notes, '')) > 4000 then
    raise exception 'notes too long';
  end if;

  insert into lastwaltz.submissions (name_key, name, track_order, notes)
  values (lower(v_name), v_name, p_order, nullif(trim(coalesce(p_notes, '')), ''))
  on conflict (name_key) do update
    set name = excluded.name,
        track_order = excluded.track_order,
        notes = excluded.notes,
        updated_at = now();
end;
$$;

create or replace function public.lastwaltz_results(p_password text)
returns table (name text, track_order text[], notes text, updated_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform lastwaltz.check_password(p_password);
  return query
    select s.name, s.track_order, s.notes, s.updated_at
    from lastwaltz.submissions s
    order by s.updated_at;
end;
$$;

revoke all on function public.lastwaltz_submit(text, text, text[], text) from public;
revoke all on function public.lastwaltz_results(text) from public;
revoke all on function lastwaltz.check_password(text) from public;
grant execute on function public.lastwaltz_submit(text, text, text[], text) to anon;
grant execute on function public.lastwaltz_results(text) to anon;
