# Local-first Sync Engine

A local-first sync engine built to explore how offline-first applications keep data consistent across multiple devices.

The client writes to local storage first and syncs changes with a central server when a connection is available. Changes are stored in an outbox and retried until they are successfully synced.

The current implementation uses a notes data model and two browser-based device simulators.

## Features

* Local-first writes. The UI does not wait for the server.
* Offline outbox for pending changes
* Automatic retry of failed sync operations
* Incremental push/pull synchronization
* Append-only version history for writes
* Last-write-wins conflict resolution
* Tombstones for synchronized deletes
* Two simulated devices for testing concurrent and offline changes

## Architecture

```text
src/
├── device/          # Client-side storage, outbox and sync logic
├── server/          # Express + PostgreSQL sync server
└── device-sim/      # Browser pages used as separate devices
```

### Device

The device handles local storage, the outbox queue, and synchronization with the server.

Writes are applied locally first. A change is then added to the outbox and pushed to the server when the client is online.

### Server

The server exposes the sync API and stores versions in PostgreSQL.

Each write creates a new version instead of overwriting the previous one. This keeps the history needed for conflict resolution and synchronization.

### Device simulator

Two browser pages are used to simulate separate devices during development.

They run on different origins, so each instance has its own `localStorage`. This makes it possible to test synchronization between independent clients without needing multiple physical devices.

## Sync Flow

```text
Device 1
   │
   ├── Write locally
   ├── Add change to outbox
   │
   └──────────────┐
                  │
                  ▼
             Express API
                  │
                  ▼
             PostgreSQL
                  │
                  │
Device 2          │
   ▲              │
   └── Pull changes
```

The client does not need to fetch the entire dataset after every change. It pulls changes from the server based on its current sync state.

## Conflict Resolution

The current conflict resolution strategy is **last-write-wins**.

When multiple devices modify the same record, the latest version is selected as the current version.

The previous versions are still stored, so the losing edit is not removed from the database. This also leaves room for implementing a more advanced conflict resolution strategy later.

## Deletes

Deletes are represented using **tombstones** instead of physically removing the record immediately.

This allows delete operations to be synchronized between devices. Without a tombstone, a deleted record could be recreated when another device sends an older version during a later sync.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the PostgreSQL database if it is not already running, then start the sync server:

```bash
npm run server
```

Start the first device:

```bash
npx vite --port 5173
```

Start the second device in another terminal:

```bash
npx vite --port 5174
```

Open these pages in separate browser tabs:

```text
http://localhost:5173/src/device-sim/device1.html
http://localhost:5174/src/device-sim/device2.html
```

You can then make changes from either device and observe how they are synchronized.

## Project Status

The core synchronization flow is currently implemented:

* Local-first writes
* Offline outbox
* Retry handling
* Push/pull synchronization
* Version history
* Last-write-wins conflict resolution
* Synchronized deletes

The project is currently being refactored to separate the sync infrastructure from the notes-specific data model.

The next step is to make the storage layer, sync protocol, and conflict resolution reusable across different data models.
