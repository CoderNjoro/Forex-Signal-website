# Signal Update Flow Diagram

## Admin Updates Signal Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN SIDE                              │
└─────────────────────────────────────────────────────────────────┘

1. Admin Panel → Manage Signals Tab
   │
   ├─ View Signals (Active/Closed/All)
   │
   └─ Click "Update Status" on Signal
      │
      └─ Signal Update Modal Opens
         │
         ├─ Option A: Toggle TP Hit
         │   └─ Click "Mark as Hit" for TP1
         │       └─ API: PUT /signals/:id/tp-hit
         │
         ├─ Option B: Mark SL Hit
         │   └─ Click "Mark SL Hit"
         │       └─ API: PUT /signals/:id/sl-hit
         │
         ├─ Option C: Mark Breakeven
         │   └─ Click "Mark Breakeven"
         │       └─ API: PUT /signals/:id/breakeven
         │
         └─ Option D: Custom Close
             └─ Fill form & submit
                 └─ API: PUT /signals/:id/close

┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND PROCESSING                        │
└─────────────────────────────────────────────────────────────────┘

API Request Received
   │
   ├─ Authenticate User (JWT)
   │
   ├─ Verify Admin Role
   │
   ├─ Validate Request Data
   │
   └─ Execute Controller Method
      │
      ├─ Find Signal in Database
      │
      ├─ Update Signal Fields
      │   ├─ tpHits array
      │   ├─ status
      │   ├─ result
      │   ├─ pips
      │   ├─ closingPrice
      │   └─ closedAt
      │
      ├─ Save to MongoDB
      │
      ├─ Update Performance Stats (if closed)
      │
      └─ Emit Socket Event
          │
          └─ io.emit('signalUpdated', updatedSignal)

┌─────────────────────────────────────────────────────────────────┐
│                    REAL-TIME DISTRIBUTION                        │
└─────────────────────────────────────────────────────────────────┘

Socket.io Server
   │
   └─ Broadcast to All Connected Clients
      │
      ├─ Admin Browser 1
      ├─ Admin Browser 2
      ├─ User Browser 1
      ├─ User Browser 2
      └─ User Browser N...

┌─────────────────────────────────────────────────────────────────┐
│                         USER SIDE                               │
└─────────────────────────────────────────────────────────────────┘

WebSocket Receives Event
   │
   └─ SignalContext Listener
      │
      ├─ Event: 'signalUpdated'
      │
      └─ Update State
         │
         ├─ signals array updated
         │
         └─ activeSignals array updated
            │
            └─ React Re-renders Components
               │
               ├─ SignalCard Component
               │   └─ Shows TP checkmarks ✓
               │       └─ Strikethrough on hit TPs
               │           └─ Breakeven badge
               │
               ├─ SignalDetails Component
               │   └─ Enhanced TP display
               │       └─ Hit indicators
               │
               └─ SignalList Component
                   └─ Updated signal data

┌─────────────────────────────────────────────────────────────────┐
│                      VISUAL RESULT                              │
└─────────────────────────────────────────────────────────────────┘

User sees immediately (< 1 second):
   ├─ ✓ Green checkmark on hit TP
   ├─ Strikethrough on hit TP price
   ├─ Yellow "Breakeven" badge (if applicable)
   ├─ Updated status (active → closed)
   └─ Result and pips (if closed)


═══════════════════════════════════════════════════════════════════

## Component Hierarchy

```
App
 │
 ├─ SignalProvider (Context)
 │   └─ Socket.io Connection
 │       └─ Event Listeners
 │
 ├─ Admin Panel
 │   ├─ Create Signal Tab
 │   ├─ Manage Signals Tab ← NEW
 │   │   ├─ Filter Buttons
 │   │   ├─ Signal Cards
 │   │   └─ SignalUpdateModal ← NEW
 │   │       ├─ TP Toggle Buttons
 │   │       ├─ Quick Actions
 │   │       └─ Custom Close Form
 │   └─ Statistics Tab
 │
 └─ User Views
     ├─ Signals Page
     │   └─ SignalList
     │       └─ SignalCard (Enhanced)
     │
     └─ Signal Details Page
         └─ SignalDetails (Enhanced)


═══════════════════════════════════════════════════════════════════

## Data Flow Example: Marking TP1 as Hit

Step 1: Admin Action
┌──────────────────────┐
│ Admin clicks         │
│ "Mark as Hit" TP1    │
└──────────────────────┘
          ↓
Step 2: API Call
┌──────────────────────┐
│ PUT /signals/123/    │
│ tp-hit               │
│ {tpIndex:0,isHit:1}  │
└──────────────────────┘
          ↓
Step 3: Database Update
┌──────────────────────┐
│ Signal.tpHits[0]     │
│ = true               │
└──────────────────────┘
          ↓
Step 4: Socket Emit
┌──────────────────────┐
│ io.emit(             │
│  'signalUpdated',    │
│  updatedSignal       │
│ )                    │
└──────────────────────┘
          ↓
Step 5: Client Update
┌──────────────────────┬──────────────────────┐
│   Admin View         │    User View         │
├──────────────────────┼──────────────────────┤
│ Button → "✓ Hit"     │ TP1: 1.0900 ✓       │
│ (Green)              │ (Strikethrough)      │
└──────────────────────┴──────────────────────┘


═══════════════════════════════════════════════════════════════════

## State Management Flow

```
                    ┌─────────────────┐
                    │  SignalContext  │
                    │   (React)       │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
            ┌───────▼──────┐  ┌──────▼───────┐
            │   signals    │  │activeSignals │
            │   (Array)    │  │   (Array)    │
            └───────┬──────┘  └──────┬───────┘
                    │                │
        ┌───────────┴────────────────┴──────────┐
        │                                       │
┌───────▼────────┐                    ┌────────▼────────┐
│  Admin Panel   │                    │   User Views    │
│  - ManageSignals│                   │  - SignalCard   │
│  - UpdateModal │                    │  - SignalDetails│
└────────────────┘                    └─────────────────┘
```

═══════════════════════════════════════════════════════════════════
