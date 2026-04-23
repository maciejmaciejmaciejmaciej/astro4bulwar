# Lokalny Deploy Astro Z Windows Na dhosting

## Cel

Ten dokument opisuje jeden kanoniczny sposob recznego deployu strony Astro z lokalnego Windowsa na aktualny serwer dhosting.

Nie kombinujemy z SCP recznie, nie wrzucamy calego projektu, nie szukamy alternatywnych tras. Canonical path jest tylko jeden:

- build lokalny w `astro-site/`
- deploy przez `SCRIPTS/deploy-astro-static.ps1`

## Zakres

Ta procedura dotyczy tylko Astro static output publikowanego pod:

- `/home/client-user/domains/client.example/public_html/astro`

Nie dotyczy:

- Reacta w `/react`
- WordPressa w `public_html`
- workflow GitHub Actions

## Jedyny Poprawny Skrypt

Uzywaj tylko tego pliku:

- `SCRIPTS/deploy-astro-static.ps1`

Skrypt robi wszystko, co trzeba:

- bierze gotowy `astro-site/dist`
- pakuje deploy ZIP lokalnie
- wysyla archive na serwer po SSH
- robi backup aktualnego `/public_html/astro`
- podmienia publiczny build
- ustawia prawa `755` dla katalogow i `644` dla plikow

## Wymagania

Przed deployem musza byc spelnione wszystkie warunki:

1. Repo jest lokalnie w:
   `c:/Users/macie/Documents/BULWAR APP`
2. Klucz SSH jest lokalnie w:
   `c:/Users/macie/Documents/BULWAR APP/id_rsa`
3. Astro ma poprawny base path dla deployu do `/astro/`.
4. `astro-site/dist` jest zbudowane ze swiezego kodu.

## Canonical Komendy

### 1. Build lokalny

Uruchom w PowerShell:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP/astro-site'
npm run build
```

### 2. Deploy na serwer

Uruchom w PowerShell:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP'
powershell -ExecutionPolicy Bypass -File 'c:/Users/macie/Documents/BULWAR APP/SCRIPTS/deploy-astro-static.ps1'
```

### 3. Wersja one-shot

Jesli chcesz zrobic wszystko jednym strzalem:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP/astro-site'; npm run build; Set-Location 'c:/Users/macie/Documents/BULWAR APP'; powershell -ExecutionPolicy Bypass -File 'c:/Users/macie/Documents/BULWAR APP/SCRIPTS/deploy-astro-static.ps1'
```

## Co Skrypt Robi Na Serwerze

Skrypt deploya uzywa tych sciezek:

- source helper root: `/home/klient.dhosting.pl/bulwar/astro-site`
- public root: `/home/client-user/domains/client.example/public_html/astro`
- backup root: `/home/klient.dhosting.pl/bulwar/deploy_backups/astro`

Na serwerze dzieje sie ta kolejnosc:

1. tworzenie wymaganych katalogow
2. backup starego publicznego Astro do folderu timestamp
3. czyszczenie `public_html/astro`
4. rozpakowanie nowego ZIP-a do `public_html/astro`
5. naprawa uprawnien `755/644`

## Weryfikacja Po Deployu

### 1. Sprawdzenie live URL

Docelowy adres:

- `https://client.example/astro/testowa-blueprint/`

### 2. Szybka walidacja HTML

Uruchom w PowerShell:

```powershell
$response = Invoke-WebRequest -Uri 'https://client.example/astro/testowa-blueprint/' -UseBasicParsing
if ($response.Content -match '/astro/_astro/') { 'LIVE_HTML_OK' } else { 'LIVE_HTML_BAD' }
```

Poprawny wynik to:

- `LIVE_HTML_OK`

Jesli zobaczysz rootowe `/_astro/...` zamiast `/astro/_astro/...`, to znaczy, ze build byl zly albo stale pliki nadal sa na live.

## Czego Nie Robic

Tego nie robimy:

- nie wrzucamy calego folderu `astro-site/` do `public_html/astro`
- nie deployujemy recznie pojedynczymi `scp` pojedynczych plikow bez backupu
- nie publikujemy do `public_html/` zamiast `public_html/astro`
- nie pomijamy chmod `755/644`
- nie szukamy alternatywnych metod wysylki, jesli dziala skrypt z repo

## Typowe Problemy

### Brak `dist`

Objaw:

- skrypt rzuca `Missing Astro dist directory`

Naprawa:

- odpal `npm run build` w `astro-site`

### Strona live bez CSS

Objaw:

- HTML jest, ale wyglad jest rozwalony
- assety ida z `/_astro/...`

Naprawa:

1. sprawdz `astro-site/astro.config.mjs`
2. potwierdz `base: '/astro/'`
3. zrob nowy build
4. zrob deploy jeszcze raz tym samym skryptem

### Ostrzezenie `unzip` o backslashach

Mozesz zobaczyc warning podobny do:

- `appears to use backslashes as path separators`

To moze sie pojawic przy ZIP-ie tworzonym na Windowsie. Jesli deploy nie rzuca bledu PowerShell i live strona laduje poprawnie, traktuj to jako warning, nie jako blocker.

### Problem z kluczem SSH

Objaw:

- `scp` albo `ssh` nie moze sie zalogowac

Naprawa:

1. sprawdz, czy `id_rsa` istnieje w root repo
2. sprawdz, czy skrypt nadal wskazuje dobry plik i host
3. nie zmieniaj metody deployu, tylko napraw wejscie do tego skryptu

## Rollback

Jesli nowy deploy jest zly, przywroc ostatni backup dedykowanym skryptem.

Uzywaj tylko tego pliku:

- `SCRIPTS/rollback-astro-static.ps1`

### Przywrocenie ostatniego backupu

Uruchom lokalnie:

```powershell
Set-Location 'c:/Users/macie/Documents/BULWAR APP'
powershell -ExecutionPolicy Bypass -File 'c:/Users/macie/Documents/BULWAR APP/SCRIPTS/rollback-astro-static.ps1'
```

### Przywrocenie konkretnego backupu

Jesli znasz timestamp backupu, mozesz wskazac go jawnie:

```powershell
powershell -ExecutionPolicy Bypass -File 'c:/Users/macie/Documents/BULWAR APP/SCRIPTS/rollback-astro-static.ps1' -BackupStamp '20260411-171500'
```

Skrypt sam:

- bierze najnowszy backup, jesli nie podasz timestampu
- czysci `public_html/astro`
- przywraca backup do live
- naprawia prawa `755/644`

Po rollbacku zrob ten sam check live:

```powershell
$response = Invoke-WebRequest -Uri 'https://client.example/astro/testowa-blueprint/' -UseBasicParsing
if ($response.Content -match '/astro/_astro/') { 'LIVE_HTML_OK' } else { 'LIVE_HTML_BAD' }
```

## Finalna Zasada

Jesli Astro ma isc z lokalnego komputera na ten serwer, to standard jest tylko jeden:

1. `npm run build`
2. `SCRIPTS/deploy-astro-static.ps1`
3. `Invoke-WebRequest` check na live

Nic wiecej.
