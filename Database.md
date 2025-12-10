

-----

# 🗄️ Firestore Datenbank-Schema & Dokumentation

Dieses Dokument beschreibt die Architektur der Cloud Firestore Datenbank für die TH Köln Raumbuchungs-App (PWA).

## 🚀 Grundprinzipien
* **NoSQL & Denormalisierung:** Wir speichern Daten teilweise redundant (z.B. Campus-Name direkt im Raum), um "Joins" zu vermeiden und Lesezugriffe zu beschleunigen.
* **Collections:** Die Hauptordner der Datenbank.
* **Dokumente:** Die eigentlichen Datensätze (JSON-artig).
* **Sub-Collections:** Ordner *innerhalb* von Dokumenten (z.B. Check-ins in einem Raum).

---

## 1. Collection: `raeume` 🏢
Speichert alle Informationen zu den Räumen.

* **Pfad:** `/raeume/{raumID}`
* **ID-Strategie:** Sprechende IDs nutzen: `CAMPUS-GEBÄUDE-RAUM` (z.B. `GM-H-101`). Das erleichtert den direkten Zugriff.

### Schema (Dokument)
```json
{
  "name": "Hörsaal 1",
  "raumnummer": "1.101",
  
  // 📍 Denormalisierte Standortdaten (für schnelles Filtern)
  "campus": "Gummersbach",
  "gebaeude": "Hauptgebäude",
  "ebene": 1,

  // 🛠 Ausstattung (Map - ermöglicht gezielte Updates & Filter)
  "ausstattung": {
    "sitzplaetze": 120,    // Number: Filter "Plätze > 50"
    "beamer": true,        // Boolean: Filter "hatBeamer == true"
    "beamer_anzahl": 2,
    "pc_pool": false,
    "barrierefrei": true,
    "steckdosen": "viele"  // String: rein informativ
  },

  // 🚦 Live-Status (Performance-Optimierung)
  // Wird aktualisiert, wenn sich Check-ins ändern. Spart das Laden der Sub-Collection.
  "liveStatus": {
    "anzahl_personen": 14,
    "ist_belegt": false,
    "letztes_update": "Timestamp"
  }
}
````

### Sub-Collection: `checkIns` 📍

Speichert die Historie und aktive Check-ins. Liegt *unterhalb* eines Raumes, um das Hauptdokument klein zu halten.

  * **Pfad:** `/raeume/{raumID}/checkIns/{checkInID}`

<!-- end list -->

```json
{
  "userId": "user_uid_123",
  "userName": "Max Mustermann", // Name mitspeichern spart User-Lookup
  "zeitpunkt": "Timestamp",     // Check-in Zeit
  "checkoutGeplant": "Timestamp" // Für Auto-Checkout Jobs
}
```

-----

## 2\. Collection: `users` 👤

Speichert Profile für Studenten und Dozenten.

  * **Pfad:** `/users/{userID}`
  * **ID-Strategie:** Entspricht der **Firebase Auth UID**.

### Schema (Dokument)

```json
{
  "email": "max.mustermann@smail.th-koeln.de",
  "anzeigename": "Max Mustermann",
  "rolle": "student", // "student", "professor", "admin"

  // ⭐ Favoriten (Array)
  // Speichert nur die IDs der favorisierten Räume.
  // Abfrage via: 'where(documentId(), "in", user.favoriten)'
  "favoriten": [
    "GM-H-101",
    "GM-L-204"
  ],

  // 📅 Mein Stundenplan (Array)
  // Liste der abonnierten Kurs-IDs
  "abonnierteKurse": [
    "mathe_1_id",
    "programmieren_id"
  ],

  // 🎓 Nur für Professoren
  "fakultaet": "F10",
  "kuerzel": "MUE",
  "profilbild_url": "https://..."
}
```

-----

## 3\. Collection: `courses` 📚 (Wiederkehrende Module)

Definiert die **Regeln** für den Stundenplan (z.B. "Jeden Montag"). Hier werden keine Einzeltermine gespeichert, sondern Muster.

  * **Pfad:** `/courses/{courseID}`

### Schema (Dokument)

```json
{
  "titel": "Mathematik 1",
  "semester": "WS25/26",
  "typ": "vorlesung", // "vorlesung", "uebung", "praktikum"
  
  // 👨‍🏫 N:M Beziehung zu Dozenten
  // Array ermöglicht Query: "Zeige alle Kurse von Prof. Müller"
  "dozentenIds": [
    "user_uid_prof_mueller",
    "user_uid_prof_schmidt"
  ],
  "dozentenNamen": ["Prof. Müller", "Prof. Schmidt"], // Für schnelle Anzeige

  // ⏰ Die Wiederholungs-Regeln (Timetable)
  "sessions": [
    {
      "wochentag": 1,        // 1 = Montag
      "startZeit": "08:00",
      "endZeit": "10:00",
      "raumId": "GM-H-101"
    },
    {
      "wochentag": 3,        // 3 = Mittwoch (Übung)
      "startZeit": "14:00",
      "endZeit": "16:00",
      "raumId": "GM-L-204"   // Anderer Raum!
    }
  ],

  // ❌ Ausnahmen (Cancellations)
  // Liste von konkreten Daten, an denen der Kurs ausfällt
  "ausfaelle": [
    "2025-10-20T00:00:00Z",
    "2025-12-24T00:00:00Z"
  ],

  "gueltigVom": "2025-09-01",
  "gueltigBis": "2026-02-28"
}
```

-----

## 4\. Collection: `bookings` 📅 (Spontane Reservierungen)

Für einmalige Events oder spontane Raumbuchungen durch Dozenten, die keinem Semester-Rhythmus folgen.

  * **Pfad:** `/bookings/{bookingID}`

### Schema (Dokument)

```json
{
  "titel": "Sondermeeting Fakultät",
  "raumId": "GM-H-101",
  "organizerId": "user_uid_prof_mueller",
  
  // Konkreter Zeitraum (keine Wiederholung)
  "start": "Timestamp (2025-11-05 14:00)",
  "ende": "Timestamp (2025-11-05 16:00)",
  
  "beschreibung": "Besprechung Prüfungsordnung"
}
```

-----

## 💡 Cheatsheet: Wie frage ich ab?

### 1\. Raumfilter

*"Finde Räume in Gummersbach mit Beamer und \> 50 Plätzen"*

```javascript
const q = query(
  collection(db, "raeume"),
  where("campus", "==", "Gummersbach"),
  where("ausstattung.beamer", "==", true),
  where("ausstattung.sitzplaetze", ">", 50)
);
// Hinweis: Erfordert evtl. einen Composite Index in Firebase (Link in Konsole klicken)
```

### 2\. Professoren-Modul-Liste

*"Welche Kurse unterrichtet Prof. Müller?"*

```javascript
const q = query(
  collection(db, "courses"),
  where("dozentenIds", "array-contains", "user_uid_prof_mueller")
);
```

### 3\. Ist Raum XY gerade belegt?

Hier muss man zwei Abfragen kombinieren (oder Cloud Functions nutzen):

1.  Prüfen in `bookings` (Spontan): `where("raumId", "==", "XY")` & Zeit-Overlap.
2.  Prüfen in `courses` (Regel): Ist heute Montag? Ja -\> Hat Kurs XY montags eine Session in Raum XY? -\> Steht heute in `ausfaelle`?

### 4\. Updates (Best Practices)

  * **Check-In hinzufügen (Race-Condition sicher):**
    Nutze `runTransaction` oder einfach `addDoc` in die Sub-Collection und aktualisiere den Counter im Parent via Cloud Function.
  * **Arrays ändern:**
    Nutze `arrayUnion("neuerWert")` und `arrayRemove("alterWert")`.

<!-- end list -->

```
```