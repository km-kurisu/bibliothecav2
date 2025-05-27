-- Create admin_users table
create table if not exists public.admin_users (
    id uuid primary key default gen_random_uuid(),
    username text unique not null,
    hashed_password text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_login timestamp with time zone,
    is_active boolean default true
);

-- Create index on username for faster lookups
create index if not exists admin_users_username_idx on public.admin_users (username);

-- Enable Row Level Security
alter table public.admin_users enable row level security;

-- Create policy to allow only authenticated users to view their own data
create policy "Users can view their own data" on public.admin_users
    for select
    using (auth.uid() = id);

-- Create policy to allow only super admins to insert/update/delete
create policy "Only super admins can modify admin users" on public.admin_users
    for all
    using (auth.uid() in (
        select id from public.admin_users where username = 'superadmin'
    ));

-- Add check constraint for password length
alter table public.admin_users
    add constraint password_length_check
    check (length(hashed_password) >= 60); -- bcrypt hashes are always 60 characters

-- Add check constraint for username
alter table public.admin_users
    add constraint username_length_check
    check (length(username) >= 3 and length(username) <= 50);

-- Add check constraint for email
alter table public.admin_users
    add constraint email_format_check
    check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'); 