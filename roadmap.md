# PrepMate - Complete Project Document
### by Gothwad Tech

---

## 1. PROJECT OVERVIEW

**App Name:** PrepMate (final name abhi decide karna hai — conditions neeche hain)
**Company:** Gothwad Tech (yehi company ne banaya hai, app isi ke under aayega)
**Aim:** Students ko NEET ki preparation mein help karna daily basis pe

**App kya karega:**
- Yeh ek Goal Tracker + Activity Tracker ki tarah kaam karega
- Students daily apne study goals set karenge aur track karenge
- Daily basis pe preparation ka record rakhega

**X-Factor Feature:**
- Isme tum apne dosto ko as a Partner add kar sakte ho
- Partner ke saath competition kar sakte ho
- Dono milkar daily ke study goals complete kar sakte ho
- Ek dusre ke scores dekh sakte ho, compare kar sakte ho

---

## 2. NAAM KI CONDITIONS

- Naam mein "NEET" word nahi aana chahiye
- Naam mein beech mein koi capital letter nahi hona chahiye
  (jaise "GoNeet" mein N capital ho raha tha — yeh galat hai)
- Agar sab lowercase ho toh meaning nahi badalni chahiye
- Naam ek smooth single word ya compound word hona chahiye
- Suggestions jo discuss hue hain:
  - prepmate (Prep + Mate = padhai ka dost)
  - lakshya (Hindi = target)
  - studex (Study + X-factor)
  - prepup (Prep + Up = level up)
  - grindly (Grind + ly = daily grind)
- Final naam abhi decide karna hai, jab tak "PrepMate" use karo as placeholder

---

## 3. TECH STACK (Sirf Yehi Use Hoga)

| Technology | Purpose |
|------------|---------|
| React | Frontend framework |
| Vite | Build tool |
| TypeScript (TSX) | Type-safe code |
| HTML | Structure |
| CSS | Styling (sirf plain CSS, koi framework nahi) |
| Firebase | Backend (Auth, Firestore, Hosting) |
| PWA | Progressive Web App support |

**Kya NAHI use karna:**
- Koi CSS framework nahi (no Tailwind, no Bootstrap)
- Koi UI library nahi (no Material UI, no Chakra)
- Koi icon library nahi (sirf inline SVG icons)
- Koi chart library nahi (charts pure CSS/SVG se banenge)
- Java nahi, JavaScript/TypeScript only

---

## 4. DESIGN SYSTEM

### Colors

**Primary Color:** `#0494F4`

**Light Theme:**
| Element | Color |
|---------|-------|
| Background | `#FFFFFF` |
| Surface | `#F8F9FA` |
| Text Primary | `#202124` |
| Text Secondary | `#5F6368` |
| Border | `#DADCE0` |

**Dark Theme (Google Style):**
| Element | Color |
|---------|-------|
| Background | `#202124` |
| Surface | `#303134` |
| Text Primary | `#E8EAED` |
| Text Secondary | `#9AA0A6` |
| Border | `#5F6368` |

### Icons
- Sirf inline SVG icons use honge
- Koi external icon library nahi

### UI Style
- Poora UI mobile ke hisaab se hoga
- Ekdam simple aur clean
- Bottom navigation bar mein 5 tabs hongi
- UI bilkul Gmail, Play Store, WhatsApp, Telegram jaisa hoga
- Niche jo tab navigation aati hai na un apps mein — exactly waisi

### Bottom Navigation (5 Tabs)
| Tab | Icon | Page |
|-----|------|------|
| Home | 🏠 | Dashboard |
| Tasks | ✅ | Daily Tasks |
| Goals | 🎯 | Goals Tracker |
| Partners | 🤝 | Partner/Competition |
| Profile | 👤 | Profile/Settings |

---

## 5. FIREBASE REQUIREMENTS (Free Plan - Spark)

**Firebase kya kya handle karega:**
- Login / Authentication (Email + Password, Google Sign-in)
- Partner sharing system
- Scores ka record
- Daily tasks ka record
- Aim/Goal tracker ka record
- Saare users ka data

**Capacity:**
- Minimum 1000 users bina kisi dikkat ke handle kare
- Egress, requests sab high traffic jhel le
- Sirf aur sirf FREE plan (Spark) pe kaam kare

**Free Plan Limits (dhyan rakhna):**
- Firestore: 50,000 reads/day, 20,000 writes/day
- Storage: 1 GB
- Hosting: 10 GB/month bandwidth
- Auth: Unlimited

**Firebase Instructions (time time pe AI ko deni hain):**
- Jab auth setup kare toh Firebase Console mein jaake Authentication enable karna
- Jab Firestore use kare toh database create karna test mode mein
- Jab deploy kare toh Firebase Hosting setup karna
- Environment variables `.env` file mein rakhni hain
- Security rules Phase ke end mein lagani hain

---

## 6. PHASE BREAKDOWN

### Foundation (Phase 1-2) — Yahan tak overall foundation ban jaani chahiye

**Phase 1: Project Setup + UI Foundation**
- Vite + React + TypeScript project initialize
- PWA support setup
- Design system (colors, fonts, spacing CSS variables)
- Light theme + Dark theme (toggle ke saath)
- SVG icons set (inline, 24px, stroke style)
- Bottom navigation bar (5 tabs, Gmail/Play Store style)
- Header component
- Basic UI components (Button, Input, Card)
- Page routing setup
- Placeholder pages for all 5 tabs
- Mobile-first responsive layout (max-width 480px)

**Phase 2: Firebase + Authentication**
- Firebase project setup instructions
- Firebase config + initialization
- Auth service (signup, login, logout, Google sign-in)
- Login page UI (clean, Google-style)
- Signup page UI (name, username, email, password, target year, target score)
- Auth context (user state management)
- Protected routes (login ke bina app access nahi)
- User profile Firestore mein create karna on signup
- Loading states + Error handling
- Toast notifications

### Core Features (Phase 3-8)

**Phase 3: Firestore Service + Cache Layer**
- Firestore CRUD operations
- Data models / TypeScript types
- LocalStorage / IndexedDB caching (free tier bachane ke liye)
- Offline data queue
- Sync manager

**Phase 4: Dashboard (Home Page)**
- Welcome screen with user name
- Daily overview card (today's progress)
- Subject-wise progress bars (Physics, Chemistry, Biology)
- Streak counter (fire emoji 🔥)
- Quick action buttons
- Motivation quote card

**Phase 5: Daily Task Tracker**
- Add task (subject, chapter, type, target)
- Task checkbox (complete/incomplete)
- Task list grouped by subject
- Edit / Delete task
- Daily progress percentage
- Date navigation (yesterday, today, tomorrow)

**Phase 6: Study Timer**
- Pomodoro style timer
- Subject select karke timer start
- Pause / Resume / Stop
- Auto-log time to daily tasks
- Session count

**Phase 7: Goals System** [COMPLETED]
- Add goal (title, subject, chapter, deadline, target)
- Goal list (active + completed)
- Progress tracking per goal
- Goal templates (pre-made for NEET)
- Mark goal complete

**Phase 8: Streak + Weekly View**
- Streak calculation logic
- Weekly calendar view
- Activity heatmap (GitHub style)
- Daily log auto-save
- Subject data (NEET syllabus chapters with weightage)

### Partner System — X-Factor (Phase 9-12)

**Phase 9: Partner Search + Request** [x]
- Username search
- Send partner request
- Accept / Reject request
- Pending requests list

**Phase 10: Partnership + Real-time Sync** [x]
- Partnership create karna
- Real-time Firestore listener for partner data
- Partner profile view
- End partnership option

**Phase 11: Comparison Board (VS Screen)** [x]
- You vs Partner visual comparison
- Today's score comparison
- Weekly score comparison
- Study hours comparison
- Tasks completed comparison
- Streak comparison
- Winner highlight

**Phase 12: Leaderboard + Challenges** [x]
- Weekly leaderboard (top users)
- Partner challenges
- Score calculation logic

### Analytics + Profile (Phase 13-15)

**Phase 13: Analytics**
- Weekly / Monthly report
- Subject breakdown (pie/bar chart - pure CSS)
- Score trend line chart (pure SVG)
- Study pattern insights

**Phase 14: Profile + Settings**
- Profile page (stats, badges, level, XP)
- Edit profile
- Settings (theme toggle, daily goal hours, notifications)
- Achievement badges
- Logout

**Phase 15: Notifications + Reminders**
- Daily study reminder
- Streak warning
- Partner activity notification

### Polish + Deploy (Phase 16-18)

**Phase 16: Offline + Sync**
- Full offline mode
- Background sync when online
- Queue management
- Conflict resolution

**Phase 17: Performance + Polish**
- Animations + micro-interactions
- Loading skeletons
- Empty states
- Error boundaries
- Code splitting + lazy loading

**Phase 18: Deploy + Security**
- Firebase security rules
- Firestore indexes
- Firebase Hosting deploy
- Final testing
- Monitoring setup

---

## 7. AI KE LIYE INSTRUCTIONS

### Kaise Kaam Karna Hai:
1. Main AI ko bolunga "abhi Phase 1 karo"
2. AI Phase 1 ka complete code dega
3. Main wo code implement karunga
4. Jab Phase 1 done hoga, bolunga "ab Phase 2 karo"
5. Aise hi ek ek phase karke poora app banega

### AI Ko Har Phase Mein Ye Batana Hai:
- Firebase ka kya setup karna hai (console mein kya karna hai)
- Kaunsi environment variables chahiye
- Kaunse packages install karne hain
- Testing checklist kya hai phase ke end mein
- Koi issue aaye toh uska solution

### Important Rules for AI:
- Har phase ka code complete hona chahiye, koi shortcut nahi
- Sirf TypeScript + CSS use karna, koi library nahi
- Saare colors CSS variables se aane chahiye
- Mobile-first design (375px width pe perfect dikhe)
- Dark mode har phase mein kaam karna chahiye
- SVG icons inline hone chahiye
- UI Gmail/Play Store/WhatsApp jaisa simple hona chahiye
- Text Hinglish mein hona chahiye (Indian students ke liye)
- Firebase free tier limits ka dhyan rakhna hai
- Caching strategy har read/write mein honi chahiye

---

## 8. FIREBASE SETUP CHECKLIST (Jab Phase 2 Aaye)

- [ ] Firebase Console → Add Project → Name: "PrepMate"
- [ ] Authentication → Sign-in method → Email/Password enable
- [ ] Authentication → Sign-in method → Google enable
- [ ] Firestore Database → Create Database → Test Mode → Location: asia-south1
- [ ] Project Settings → Web App → Register → Config copy karo
- [ ] `.env` file mein config paste karo
- [ ] `npm install firebase` run karo

---

## 9. FINAL NOTES

- Yeh document poore project ka single source of truth hai
- Har phase ke baad is document ko refer karo
- Foundation (Phase 1-2) sabse important hai — isme UI + Auth dono solid hona chahiye
- X-Factor (Phase 9-12) app ko unique banayega — ispe extra dhyan dena hai
- Free plan pe 1000 users handle karna hai — caching zaroori hai
- App ka naam final karna hai (conditions section 2 mein hain)

---

**Made by Gothwad Tech**
