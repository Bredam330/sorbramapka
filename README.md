# SOR-BRAM — Rejestr zleceń

Aplikacja do zarządzania zleceniami serwisowymi SOR-BRAM: rejestr zleceń, wyceny, kalendarz i zapytania ze strony sorbram.pl.

Stack: React + Vite + Tailwind + Supabase.

## Konfiguracja lokalna

1. `npm install`
2. Skopiuj `.env.example` do `.env.local` (wartości już wskazują na projekt Supabase `sorbram`)
3. `npm run dev`

## Pierwsze logowanie

Aplikacja wymaga zalogowanego użytkownika (RLS w bazie wpuszcza tylko `authenticated`). Przy pierwszym uruchomieniu:

1. Otwórz aplikację, kliknij "Pierwszy raz? Utwórz konto"
2. Podaj swój email i hasło — Supabase wyśle maila z potwierdzeniem (albo wyłącz potwierdzanie maila w Supabase Dashboard → Authentication → Providers → Email, jeśli chcesz logować się od razu)
3. Po potwierdzeniu możesz się zalogować

Zalecane: po założeniu swojego konta wyłącz w Supabase Dashboard → Authentication → Settings opcję "Allow new users to sign up", żeby nikt obcy nie mógł sobie założyć konta z dostępem do Twoich danych.

## Wdrożenie na Vercel

1. Wejdź na [vercel.com](https://vercel.com) i zaloguj się przez GitHub
2. "Add New Project" → wybierz repo `sorbramapka`
3. Vercel sam wykryje framework Vite — nic nie trzeba zmieniać w build/output settings
4. W sekcji "Environment Variables" dodaj:
   - `VITE_SUPABASE_URL` = `https://fezsvrzyjgslezvssexb.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (klucz z `.env.example`)
5. Deploy — dostaniesz link `https://twoja-apka.vercel.app`, działający na telefonie i komputerze

Na telefonie: otwórz link w przeglądarce i wybierz "Dodaj do ekranu głównego", żeby działało jak zwykła aplikacja.

## Baza danych

Projekt Supabase: `sorbram` (organizacja damian.brejta@gmail.com's, region eu-central-1).

Tabele:
- `klienci` — dane klientów
- `zlecenia` — zlecenia serwisowe (przychód, koszt części, zysk liczony automatycznie)
- `wyceny` — wyceny wysyłane do klientów, ze statusem wysłana/zaakceptowana/odrzucona
- `zapytania` — zapytania kontaktowe ze strony sorbram.pl (docelowo wpadające przez webhook n8n)

Wszystkie tabele mają włączone RLS — dostęp tylko dla zalogowanych użytkowników.
