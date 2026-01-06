-- Create creators table
create table public.creators (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  niche text not null,
  location text not null,
  pitch text,
  media_kit_pdf text, -- URL to the PDF file
  start_price text, -- e.g. "R$ 1.500" - simplified for display
  total_followers text, -- e.g. "1.2M" - simplified for display
  avg_engagement text, -- e.g. "4.5%" - simplified for display
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enabled RLS
alter table public.creators enable row level security;

-- Policies for creators
create policy "Creators are viewable by everyone" on public.creators
  for select using (true);

create policy "Users can insert their own creator profile" on public.creators
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own creator profile" on public.creators
  for update using (auth.uid() = user_id);

-- Create creator_socials table
create table public.creator_socials (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.creators(id) on delete cascade not null,
  platform text not null, -- 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin'
  handle text not null,
  followers text not null,
  engagement text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.creator_socials enable row level security;

-- Policies for creator_socials
create policy "Socials are viewable by everyone" on public.creator_socials
  for select using (true);

create policy "Users can insert socials for their creator profile" on public.creator_socials
  for insert with check (
    exists ( select 1 from public.creators where id = creator_id and user_id = auth.uid() )
  );

create policy "Users can update socials for their creator profile" on public.creator_socials
  for update using (
    exists ( select 1 from public.creators where id = creator_id and user_id = auth.uid() )
  );

create policy "Users can delete socials for their creator profile" on public.creator_socials
  for delete using (
    exists ( select 1 from public.creators where id = creator_id and user_id = auth.uid() )
  );

-- Create creator_rates table
create table public.creator_rates (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.creators(id) on delete cascade not null,
  title text not null, -- e.g. "Combo 3 Stories", "Reels (60s)"
  description text,
  price text not null, -- e.g. "1500", "5000"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.creator_rates enable row level security;

-- Policies for creator_rates
create policy "Rates are viewable by everyone" on public.creator_rates
  for select using (true);

create policy "Users can insert rates for their creator profile" on public.creator_rates
  for insert with check (
    exists ( select 1 from public.creators where id = creator_id and user_id = auth.uid() )
  );

create policy "Users can update rates for their creator profile" on public.creator_rates
  for update using (
    exists ( select 1 from public.creators where id = creator_id and user_id = auth.uid() )
  );

create policy "Users can delete rates for their creator profile" on public.creator_rates
  for delete using (
    exists ( select 1 from public.creators where id = creator_id and user_id = auth.uid() )
  );

-- Storage bucket for media kits
insert into storage.buckets (id, name, public) values ('media-kits', 'media-kits', true);

create policy "Media Kits are publicly accessible" on storage.objects
  for select using ( bucket_id = 'media-kits' );

create policy "Users can upload media kits" on storage.objects
  for insert with check (
    bucket_id = 'media-kits' and auth.uid() = owner
  );
