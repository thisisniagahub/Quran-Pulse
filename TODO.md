# QuranPulse Optimization Plan (TODO)

**Update:** All tasks in this optimization plan have been completed.

This document outlines the planned optimizations for the QuranPulse application, based on the architectural review. Tasks are prioritized to deliver the most impact first.

## 🚀 P1: High Priority - Core Performance & Cost Reduction

These tasks are critical for making the app production-ready, focusing on initial load time and reducing API costs.

### Performance & Loading
- [x] **Implement Code Splitting in `App.tsx`**
  - [x] Use `React.lazy` to dynamically import all major feature components (`QuranReader`, `PrayerTimes`, `AICompanion`, `TajweedTutor`, etc.).
  - [x] Add a `<Suspense>` component with a suitable loading fallback (e.g., a simple centered spinner) in he `renderActiveView` function to handle the loading state of lazy-loaded components.

- [x] **Optimize Static Data Loading for Iqra'**
  - [x] Convert the large `data/iqraData.ts` file into a static JSON file (`public/data/iqraData.json`).
  - [x] Update `IqraBookView.tsx` to fetch `iqraData.json` using `fetch()` when the component mounts.
  - [x] **(Follow-up)** Implement caching for `iqraData.json` in IndexedDB via `dbService.ts` to enable faster subsequent loads and full offline access after the first fetch.

### API Usage & Cost
- [x] **Drastically Reduce TTS API Calls in `IqraBookView.tsx`**
  - [x] **Option A (Preferred): Pre-generate Audio Files.** This is the most cost-effective and performant long-term solution.
    - [x] Create an offline script (Node.js) to iterate through all unique words in `iqraData.ts`.
    - [x] Use the Gemini TTS API within the script to generate an audio file for each word.
    - [x] Save the generated audio files as static `.mp3` or `.wav` files in the `public/audio/iqra/` directory.
    - [x] Update the `handleWordClick` and `handlePlayPage` logic in `IqraBookVew.tsx` to construct and fetch these static audio file URLs instead of calling `generateSpeech`.
  - [x] **Option B (Alternative): Batch TTS Requests.** If pre-generation is not feasible, batching requests is a necessary alternative.
    - [x] Modify `handlePlayPage` to generate speech for an entire line at once, not word-by-word. This reduces API calls significantly.

---

## 🏗️ P2: Medium Priority - Code Quality & Maintainability

These tasks focus on refactoring complex components to improve readability, reduce bugs, and make future development easier.

### Code Structure & Maintainability
- [x] **Refactor `QuranReader.tsx` into Custom Hooks**
  - [x] Create `src/hooks/useQuranData.ts` to manage all logic related to fetching surah data, including loading and error states.
  - [x] Create `src/hooks/useAutoplay.ts` to encapsulate all autoplay queue logic (state management, `useEffect` hooks for queue progression).
  - [x] Update `QuranReader.tsx` to consume these new hooks, greatly simplifying its component logic and separating concerns.

- [x] **Centralize Shared Utility Functions**
  - [x] Move the duplicated audio helper functions (`encode`, `decode`, `decodeAudioData`, `createBlob`) from `LiveConversation.tsx` and `TajweedCoach.tsx` into `utils/audio.ts`.
  - [x] Update `LiveConversation.tsx` and `TajweedCoach.tsx` to import these functions from the new central `utils/audio.ts` file to adhere to the DRY principle.

- [x] **Memoize `AyahView` Component**
  - [x] Wrap the `AyahView` component definition within `QuranReader.tsx` with `React.memo`. This will prevent the entire list of ayahs from re-rendering when only one ayah's state (like its explanation visibility) changes.

---

## ✨ P3: Low Priority - UX Polish & Minor Fixes

These are smaller but important tasks that improve the overall robustness and professional feel of the application.

### User Experience & Robustness
- [x] **Enhance Global Audio Player Error Handling**
  - [x] Add `retry` and `dismissError` functions to the `AudioPlayerContextType` and implement their logic in `AudioContext.tsx`.
  - [x] Update `GlobalAudioPlayer.tsx` to display a user-friendly error message with buttons to trigger `retry` or `dismissError` when the `error` state is active.

- [x] **Fix Minor Code Bugs & Inconsistencies**
  - [x] Correct the invalid SVG path data for `BackwardIcon` in `components/icons/Icons.tsx`.
  - [x] Ensure all icons used in the application are correctly exported from `components/icons/Icons.tsx`.
  - [x] Fix the invalid template literal syntax (e.g., `\`Buka...\``) for the `label` property inside the `handleSend` function in `AICompanion.tsx`.
  - [x] Verify that the `BadgeProps` type alias in `components/ui/Badge.tsx` correctly resolves the attribute inheritance issue.