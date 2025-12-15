---
description: Implementation plan for Moto Maestro mobile app (racer/profile focused) using existing Supabase database
---

# Moto Maestro Mobile App Implementation Plan

## Overview

Build a React Native (Expo) mobile app for racers that connects to the existing Supabase database. The app mirrors the functionality of the web app's `(app)` zone (racer portal) with a mobile-first experience.

---

## Phase 1: Project Foundation

### 1.1 Initialize Expo Project

```bash
npx create-expo-app@latest moto-maestro-mobile --template expo-template-blank-typescript
cd moto-maestro-mobile
```

### 1.2 Install Core Dependencies

```bash
# Supabase
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage

# Navigation
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context

# UI Components
npx expo install react-native-gesture-handler react-native-reanimated expo-haptics expo-blur

# Utilities
npx expo install expo-secure-store expo-image expo-image-picker expo-document-picker expo-file-system
```

### 1.3 Supabase Client Setup

Create `/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from './database.types'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### 1.4 Copy Database Types

Copy `lib/supabase/database.types.ts` from the web app to `/lib/database.types.ts` in the mobile app.

---

## Phase 2: Authentication

### 2.1 Auth Context Provider

Create `/contexts/AuthContext.tsx`:
- Track authenticated user state
- Provide `signIn`, `signUp`, `signOut` methods
- Auto-refresh session on app resume
- Handle deep linking for OAuth flows

### 2.2 Auth Screens

| Screen | Description |
|--------|-------------|
| `LoginScreen` | Email/password login with "Forgot password" link |
| `SignUpScreen` | Registration form (first_name, last_name, email, password) |
| `ForgotPasswordScreen` | Password reset flow |
| `VerifyEmailScreen` | OTP/Magic link confirmation |

### 2.3 Navigation Guards

- Wrap app in `AuthProvider`
- Use conditional navigation stack:
  - **Unauthenticated**: Auth stack (Login, SignUp, etc.)
  - **Authenticated**: Main app stack (Tab Navigator)

---

## Phase 3: Core Data Layer

### 3.1 Types (from existing database schema)

| Entity | Table | Key Fields |
|--------|-------|------------|
| Profile | `profiles` | id, first_name, last_name, email, phone, team_name |
| Event | `events` | id, name, date_start, date_end, status, visibility, venue, description, hero_image_url |
| Entry | `entries` | id, event_id, class_id, profile, status, driver_name, driver_email, kart_number |
| Class | `classes` | id, event_id, name, price, capacity |
| Team | `teams` | id, name, logo_url, description, status |
| TeamMember | `team_members` | id, team, profile, role |
| Document | `documents` | id, entry_id, file_name, file_url, document_type |

### 3.2 React Query / TanStack Query Setup

```bash
npm install @tanstack/react-query
```

Create query hooks:
- `useProfile()` - Current user's profile
- `useEvents()` - Browse public/published events
- `useEvent(id)` - Single event details with classes
- `useMyEntries()` - User's registered events
- `useEntry(id)` - Single entry details
- `useMyTeams()` - User's team memberships
- `useTeam(id)` - Single team details with members

### 3.3 Mutations

- `useUpdateProfile()` - Update profile fields
- `useRegisterForEvent()` - Create entry
- `useUploadDocument()` - Upload registration documents
- `useCreateTeam()` - Create new team
- `useJoinTeam()` - Join existing team via invite code

---

## Phase 4: Navigation Structure

### 4.1 Tab Navigator (Main App)

```
┌─────────────────────────────────────┐
│                                     │
│         [Screen Content]            │
│                                     │
├─────────────────────────────────────┤
│  🏠      📅      🏎️      👤        │
│ Home   Events   Teams  Profile      │
└─────────────────────────────────────┘
```

| Tab | Icon | Root Screen | Nested Screens |
|-----|------|-------------|----------------|
| Home | `Home` | `DashboardScreen` | — |
| Events | `Calendar` | `EventsScreen` | `EventDetailScreen`, `RegisterScreen`, `MyEventDetailScreen` |
| Teams | `Users` | `TeamsScreen` | `TeamDetailScreen`, `CreateTeamScreen` |
| Profile | `User` | `ProfileScreen` | `EditProfileScreen`, `VehiclesScreen`, `DocumentsScreen`, `SettingsScreen` |

### 4.2 Stack Navigators

```typescript
// EventsStack
<Stack.Navigator>
  <Stack.Screen name="EventsList" component={EventsScreen} />
  <Stack.Screen name="EventDetail" component={EventDetailScreen} />
  <Stack.Screen name="Register" component={RegisterScreen} />
  <Stack.Screen name="MyEventDetail" component={MyEventDetailScreen} />
</Stack.Navigator>

// Similar for TeamsStack, ProfileStack
```

---

## Phase 5: Screens Implementation

### 5.1 Dashboard (Home Tab)

**Features:**
- Welcome banner with user's name
- Quick stats (upcoming events count, team count)
- "Upcoming Events" carousel (next 3 registered events)
- Quick actions: "Browse Events", "View Profile"

**Data:**
- `useProfile()` for greeting
- `useMyEntries()` filtered by future dates

---

### 5.2 Events Tab

#### 5.2.1 EventsScreen (List)

**Features:**
- Segmented control: "Browse Events" / "My Events"
- Search/filter by name, date, status
- Event cards with:
  - Hero image (if available)
  - Event name, dates, venue
  - Registration status badge
  - Available spots indicator

**Data:**
- "Browse Events": `useEvents()` with filters for `status: 'published'`, `visibility: 'public'`
- "My Events": `useMyEntries()` joined with events

#### 5.2.2 EventDetailScreen

**Features:**
- Hero image header with parallax scroll
- Event metadata (dates, venue, description)
- Schedule accordion (from `event_schedule_items`)
- Classes list with pricing (early bird / late fee indicators)
- Required documents list
- "Register" CTA button (or registration status if already registered)

**Data:**
- `useEvent(id)` with embedded:
  - `classes`
  - `event_schedule_items`
  - `event_documents_required`
- Check existing entry via `useMyEntries()`

#### 5.2.3 RegisterScreen

**Features:**
- Multi-step form:
  1. **Driver Info**: Pre-fill from profile (name, email, phone)
  2. **Class Selection**: Pick class, show pricing with early bird/late fee logic
  3. **Vehicle Info**: Make/model, car number
  4. **Documents**: Upload required documents (camera/gallery/files)
  5. **Review & Submit**
- Progress indicator
- Form validation

**Data:**
- `useProfile()` for pre-fill
- `useRegisterForEvent()` mutation
- `useUploadDocument()` mutation

#### 5.2.4 MyEventDetailScreen

**Features:**
- QR code for event check-in (same as web: `https://api.qrserver.com/v1/create-qr-code/`)
- Event summary (name, dates, class)
- Registration details (driver name, kart #, status)
- Documents list with status
- Option to upload additional documents

**Data:**
- `useEntry(id)` with joined `events` and `classes`

---

### 5.3 Teams Tab

#### 5.3.1 TeamsScreen (List)

**Features:**
- "My Teams" list with role badges (owner, admin, member)
- Team cards with logo, member count
- "Create Team" button
- "Join Team" button (enter invite code)

**Data:**
- `useMyTeams()` via `team_members` joined with `teams`

#### 5.3.2 TeamDetailScreen

**Features:**
- Team header (logo, name, description)
- Members list with roles
- Owner/Admin actions:
  - Edit team info
  - Manage members
  - Generate invite code

**Data:**
- `useTeam(id)` with `team_members` joined to `profiles`

#### 5.3.3 CreateTeamScreen

**Features:**
- Form: name, description, logo upload
- Create team and auto-add creator as owner

**Data:**
- `useCreateTeam()` mutation

---

### 5.4 Profile Tab

#### 5.4.1 ProfileScreen (Hub)

**Features:**
- Avatar/initials with name
- Quick links:
  - Edit Profile
  - Vehicles
  - Documents
  - Settings
- Sign Out button

**Data:**
- `useProfile()`

#### 5.4.2 EditProfileScreen

**Features:**
- Form fields: first_name, last_name, phone, team_name
- Avatar upload
- Save button

**Data:**
- `useProfile()`
- `useUpdateProfile()` mutation

#### 5.4.3 VehiclesScreen

**Features:**
- List of saved vehicles
- Add/edit vehicle form (make, model, year, number)

**Note:** Vehicles may need a new `vehicles` table or store in profile JSON. Current schema doesn't have dedicated vehicles table—check if we should add one or use `entries` history.

#### 5.4.4 DocumentsScreen

**Features:**
- List of uploaded documents with types
- Upload new document
- View/delete existing

**Note:** Current `documents` table is tied to `entry_id`. For profile-level documents (licenses, waivers), may need to extend schema or add `profile_id` to `documents` table.

#### 5.4.5 SettingsScreen

**Features:**
- Notifications preferences
- Theme toggle (if supporting dark mode)
- About/version info
- Delete account flow

---

## Phase 6: UI/UX Components

### 6.1 Design System

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, outline, ghost variants |
| `Card` | Elevated card with optional image header |
| `Input` | Text input with label, error state |
| `Select` | Bottom sheet picker for iOS/Android |
| `Badge` | Status badges (confirmed, pending, cancelled) |
| `Avatar` | Image with fallback initials |
| `EmptyState` | Illustrated placeholder for empty lists |
| `LoadingSpinner` | Activity indicator |
| `Toast` | Success/error notifications |

### 6.2 Theming

Use React Native Paper or create custom theme with:
- Colors (matching web app branding)
- Typography (font sizes, weights)
- Spacing scale
- Border radii
- Shadows/elevation

---

## Phase 7: Push Notifications (Optional)

### 7.1 Setup

```bash
npx expo install expo-notifications expo-device
```

### 7.2 Use Cases

- Registration confirmation
- Event reminders (24h, 1h before)
- Entry status changes
- Team invites

### 7.3 Implementation

- Store push tokens in `profiles.push_token` (add column)
- Use Supabase Edge Functions or external service to send

---

## Phase 8: Offline Support (Optional Enhancement)

### 8.1 Strategy

- Cache profile and recent entries locally
- Show cached data when offline with "Offline mode" banner
- Queue mutations (document uploads) for sync when online

### 8.2 Tools

- React Query's `persistQueryClient` with AsyncStorage
- `@react-native-community/netinfo` for connectivity detection

---

## Phase 9: Testing & QA

### 9.1 Unit Tests

- Jest for utility functions
- React Testing Library for component logic

### 9.2 E2E Tests

- Detox or Maestro for critical flows:
  - Login → Browse Events → Register
  - Profile edit → Save
  - Team creation

### 9.3 Device Testing

- iOS Simulator + physical iPhone
- Android Emulator + physical Android device
- Test various screen sizes

---

## Phase 10: Deployment

### 10.1 App Store (iOS)

1. Create Apple Developer account
2. Configure app in App Store Connect
3. Build with EAS: `eas build --platform ios`
4. Submit for review

### 10.2 Play Store (Android)

1. Create Google Play Developer account
2. Configure app in Play Console
3. Build with EAS: `eas build --platform android`
4. Submit for review

### 10.3 Environment Variables

- Production Supabase URL/Key
- API URLs if any custom endpoints

---

## Schema Considerations

### Potential New Tables/Columns

| Change | Rationale |
|--------|-----------|
| `profiles.push_token` | Store FCM/APNS token for push notifications |
| `profiles.avatar_url` | Already exists in web queries (may need to verify column) |
| `vehicles` table | Dedicated vehicle storage vs. denormalized in entries |
| `documents.profile_id` | Allow profile-level documents (not tied to entry) |
| `invites` table | Track team invite codes with expiration |

### Existing Schema Compatibility

The current schema is well-suited for mobile:
- `profiles` → User identity
- `entries` → Event registrations (has `profile` column ready to use)
- `teams` / `team_members` → Team functionality
- `events` / `classes` / `event_schedule_items` → Event browsing
- `documents` → Registration document uploads

---

## File Structure

```
moto-maestro-mobile/
├── app/                      # Expo Router (if using file-based routing)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── index.tsx         # Dashboard
│   │   ├── events/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── teams/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── profile/
│   │       ├── index.tsx
│   │       ├── edit.tsx
│   │       ├── vehicles.tsx
│   │       └── documents.tsx
│   └── _layout.tsx
├── components/
│   ├── ui/
│   ├── events/
│   ├── teams/
│   └── profile/
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useProfile.ts
│   ├── useEvents.ts
│   ├── useMyEntries.ts
│   └── useTeams.ts
├── lib/
│   ├── supabase.ts
│   ├── database.types.ts
│   └── utils.ts
└── assets/
```

---

## Summary

This plan provides a full-featured mobile experience that mirrors the web's racer portal:

| Feature | Web Equivalent | Mobile Priority |
|---------|----------------|-----------------|
| Authentication | `/auth/*` | ✅ Phase 2 |
| Profile management | `/profile` | ✅ Phase 5.4 |
| Browse events | `/events` | ✅ Phase 5.2 |
| Event registration | `/events/[id]/register` | ✅ Phase 5.2.3 |
| My events | `/my-events` | ✅ Phase 5.2 |
| QR check-in | `/my-events/[id]` | ✅ Phase 5.2.4 |
| Teams | `/teams` | ✅ Phase 5.3 |
| Documents | `/profile/documents` | ✅ Phase 5.4.4 |
| Vehicles | `/profile/vehicles` | ✅ Phase 5.4.3 |

Estimated timeline: **6-8 weeks** for MVP with core features, additional 2-4 weeks for polish and optional features (push notifications, offline support).
