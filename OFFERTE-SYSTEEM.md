# EndaTech Offertesysteem — Handleiding

## Overzicht

Het offertesysteem heeft 3 onderdelen:
1. **Klant** vraagt offerte aan → krijgt offertenummer
2. **Admin** vult offerte in en stuurt naar klant
3. **Klant** bekijkt offerte en ondertekent digitaal

---

## Stap 1: Klant vraagt offerte aan

**Pagina:** https://www.endatech.nl/offerte-aanvragen

De klant vult het formulier in:
- Naam, telefoon, e-mail
- Adres, postcode, stad
- Type woning (appartement, tussenwoning, hoekwoning, vrijstaand, kantoor, bedrijfspand)
- Aantal gewenste ruimtes
- Opmerkingen (optioneel)

Na verzending krijgt de klant een **offertenummer** (bijv. `END-2026-00001`).
→ Dit nummer moet de klant bewaren!

---

## Stap 2: Admin beheert offertes

### Inloggen

**Pagina:** https://www.endatech.nl/admin/login

- **Wachtwoord:** `endatech2026`

### Dashboard

**Pagina:** https://www.endatech.nl/admin

Hier zie je alle offertes met:
- Statistieken (totaal, in behandeling, ondertekend, voltooid)
- Filteren op status
- Tabel met offertenummer, klant, stad, telefoon, status, bedrag, datum

### Offerte invullen en versturen

Klik op een offerte om deze te openen. Je ziet:

**Links — klantgegevens (niet bewerkbaar):**
- Naam, e-mail, telefoon, adres
- Type woning, aantal ruimtes
- Opmerkingen

**Rechts — offerte invullen:**

| Veld | Wat invullen |
|------|-------------|
| **Status** | Verander van `PENDING` naar `SENT` als je klaar bent |
| **Totaalbedrag** | De prijs incl. BTW (bijv. `2450.00`) |
| **Geldig tot** | Vervaldatum van de offerte |
| **Omschrijving** | Wat je aanbiedt: welke airco, aantal units, wat er bij zit |

**Klik op "Opslaan"** om de offerte op te slaan.

> ⚠️ **Belangrijk:** Zet de status op `SENT` als de offerte klaar is. 
> Zolang de status `PENDING` is, kan de klant de offerte NIET zien of ondertekenen.

---

## Stap 3: Klant bekijkt en ondertekent

**Pagina:** https://www.endatech.nl/offerte-bekijken

1. Klant voert offertenummer in (bijv. `END-2026-00001`)
2. Klant ziet de offerte met omschrijving en prijs
3. Klant klikt op **"Offerte ondertekenen"**
4. Handtekening zetten op het tekenveld (vinger of muis)
5. Klikt op **"Ondertekenen"**

Na ondertekening wordt opgeslagen:
- De handtekening (als afbeelding)
- IP-adres van de klant
- Datum/tijd van ondertekening
- Browser/apparaat informatie

De status verandert automatisch naar `SIGNED`.

---

## Statusoverzicht

| Status | Betekenis |
|--------|-----------|
| `PENDING` | Aanvraag ontvangen, offerte nog niet klaar |
| `SENT` | Offerte verstuurd / klaar voor klant |
| `VIEWED` | Klant heeft offerte bekeken |
| `SIGNED` | Klant heeft digitaal ondertekend |
| `ACCEPTED` | Werk ingepland |
| `COMPLETED` | Installatie afgerond |
| `EXPIRED` | Offerte verlopen |
| `CANCELLED` | Geannuleerd |

---

## Workflow samengevat

```
Klant vult formulier in
    ↓
Offerte aangemaakt (PENDING)
    ↓
Admin opent offerte in /admin
    ↓
Admin vult in: omschrijving, prijs, vervaldatum
    ↓
Admin zet status op SENT → Opslaan
    ↓
Klant gaat naar /offerte-bekijken
    ↓
Klant voert offertenummer in
    ↓
Klant ziet offerte (status → VIEWED)
    ↓
Klant ondertekent digitaal (status → SIGNED)
    ↓
Admin ziet handtekening in admin panel
    ↓
Admin zet status op ACCEPTED → COMPLETED
```

---

## Technische details

- **Database:** PostgreSQL (Neon) — gegevens worden veilig opgeslagen in de cloud (EU)
- **Admin URL:** https://www.endatech.nl/admin
- **Admin wachtwoord:** `endatech2026`
- **Offertenummers:** Automatisch gegenereerd: `END-JJJJ-XXXXX`
- **Handtekeningen:** Opgeslagen als Base64 PNG in de database
- **Beveiliging:** Admin sessie via HTTP-only cookie (7 dagen geldig)

---

## E-mailnotificaties

E-mails worden automatisch verstuurd via SMTP (Strato) vanaf `info@endatech.nl`.

| Moment | Ontvanger | Onderwerp |
|--------|-----------|-----------|
| Klant vraagt offerte aan | **Klant** | Bevestiging met offertenummer |
| Klant vraagt offerte aan | **Admin** | Notificatie met klantgegevens + link naar admin |
| Admin zet status op SENT | **Klant** | "Uw offerte is klaar" + link om te bekijken |
| Klant ondertekent | **Admin** | "Offerte ondertekend" + link naar admin |

**SMTP-configuratie** (in `.env`):
```
SMTP_HOST="smtp.strato.com"
SMTP_PORT="465"
SMTP_USER="info@endatech.nl"
SMTP_PASS="..."
SMTP_FROM="EndaTech <info@endatech.nl>"
ADMIN_EMAIL="info@endatech.nl"
```

---

## Wat nog NIET werkt (mogelijke uitbreidingen)

- **PDF genereren** — offerte als PDF downloaden/versturen
- **Foto's uploaden** — klant kan nog geen foto's van de situatie meesturen
- **Automatische verloopdatum** — offertes worden niet automatisch op EXPIRED gezet
