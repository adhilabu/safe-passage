-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  user_id uuid references auth.users not null,
  email text,
  name text,
  avatar text,
  location text,
  priorities text[],
  style text,
  bio text,
  preferredItineraryTypes text[],
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updatedAt" timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint user_id_unique unique(user_id)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = user_id );

-- Set up Storage for Avatars (Optional but recommended)
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
