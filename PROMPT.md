# 🎯 QuranPulse Ready-to-Use Prompts

**For use with AI Studio + System Instructions configured**

---

## 🔍 CATEGORY 1: CODE REVIEW & ANALYSIS

### 📊 Prompt 1.1: Complete Component Review

```
Review this component for issues and improvements:

[PASTE YOUR COMPONENT CODE HERE]

Analyze for:
- TypeScript type safety
- React performance (memo, useCallback, useMemo)
- Error handling
- Loading states
- Islamic compliance (if AI-related)
- Security vulnerabilities
- Accessibility
- Code organization

Provide complete refactored code with all improvements.
```

**Use for**: Any component that needs review

---

### 🔍 Prompt 1.2: Quick Issue Scan

```
Quickly scan this code for critical issues only:

[PASTE CODE HERE]

Focus on:
- 🔴 Security vulnerabilities
- 🔴 Breaking bugs
- 🔴 Type errors
- 🔴 Missing error handling

Keep it brief - only critical items.
```

**Use for**: Fast checks before commit

---

### ⚡ Prompt 1.3: Performance Analysis

```
Analyze this component for performance issues:

[PASTE COMPONENT CODE]

Check for:
- Unnecessary re-renders
- Missing memoization (React.memo, useMemo, useCallback)
- Expensive calculations in render
- Large component size (>300 lines)
- Bundle size impact
- Memory leaks

Provide optimized version with performance metrics.
```

**Use for**: Components that feel slow

---

### 🔒 Prompt 1.4: Security Audit

```
Perform security audit on this code:

[PASTE CODE]

Check for:
- Exposed API keys or secrets
- Missing input validation
- XSS vulnerabilities
- Unsafe localStorage usage
- Missing sanitization
- CORS issues

For QuranPulse context - also check Islamic content compliance.
```

**Use for**: Services, API calls, user input handling

---

## 🛠️ CATEGORY 2: CODE GENERATION

### ✨ Prompt 2.1: New Component from Scratch

```
Create a new React component for QuranPulse:

Feature: [DESCRIBE FEATURE]
Purpose: [WHAT IT DOES]
Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Include:
- Full TypeScript implementation
- Proper error handling
- Loading states
- Tailwind CSS styling (dark mode support)
- Unit tests
- Islamic compliance validation (if applicable)

Follow QuranPulse conventions:
- No src/ prefix in imports
- Use lazy loading if component is large
- Use cn() from lib/utils for className
- Match existing theme system
```

**Example**:
```
Create a new React component for QuranPulse:

Feature: Surah Memorization Tracker
Purpose: Track which ayahs user has memorized in each surah
Requirements:
- Display surah list with completion percentage
- Mark individual ayahs as memorized
- Store progress in IndexedDB
- Show statistics (total ayahs, percentage complete)
- Gamification - reward XP for milestones
```

---

### 🔄 Prompt 2.2: Refactor Existing Component

```
Refactor this component following QuranPulse best practices:

[PASTE CURRENT CODE]

Improvements needed:
- Split into smaller components (<300 lines each)
- Extract custom hooks where appropriate
- Add proper TypeScript types
- Implement React.memo for performance
- Add comprehensive error handling
- Improve code organization

Keep existing functionality 100% intact.
Provide step-by-step migration guide.
```

---

### 🎨 Prompt 2.3: Add New Feature to Existing Component

```
Add this feature to the existing component:

Current Component: [COMPONENT NAME]
New Feature: [DESCRIBE FEATURE]

[PASTE CURRENT COMPONENT CODE]

Requirements:
- Integrate seamlessly with existing code
- Follow same patterns and conventions
- Add tests for new feature
- Update types.ts if needed
- Maintain backward compatibility

Show before/after comparison and explain changes.
```

**Example**:
```
Add this feature to the existing component:

Current Component: QuranReader
New Feature: Verse-by-verse translation toggle

[paste QuranReader.tsx code]

Requirements:
- Toggle button to show/hide translations
- Persist preference in localStorage
- Smooth transition animation
- Mobile-responsive
```

---

### 🧪 Prompt 2.4: Generate Tests

```
Generate comprehensive test suite for this component:

[PASTE COMPONENT CODE]

Include:
- Unit tests (80% coverage minimum)
- Integration tests for key user flows
- Edge case testing
- Error scenario testing
- Accessibility testing

Use React Testing Library patterns.
Mock external dependencies (API calls, localStorage).
```

---

## 🐛 CATEGORY 3: BUG FIXING

### 🔴 Prompt 3.1: Fix Specific Bug

```
Help me fix this bug:

**Component**: [COMPONENT NAME]
**Issue**: [DESCRIBE THE BUG]
**Expected**: [WHAT SHOULD HAPPEN]
**Actual**: [WHAT ACTUALLY HAPPENS]
**Error Message** (if any): [ERROR TEXT]

[PASTE RELEVANT CODE]

Provide:
1. Root cause analysis
2. Complete fix with explanation
3. Test to prevent regression
4. Additional safeguards
```

**Example**:
```
Help me fix this bug:

**Component**: QuranReader
**Issue**: Audio skips ayahs during autoplay
**Expected**: Should play each ayah completely before moving to next
**Actual**: Jumps to next ayah before current finishes
**Error Message**: None, just skips

[paste relevant audio code]
```

---

### ⚠️ Prompt 3.2: Debug Console Error

```
Fix this console error:

**Error Message**: [EXACT ERROR TEXT]
**Browser**: [Chrome/Firefox/Safari]
**Occurs When**: [USER ACTION THAT TRIGGERS IT]

[PASTE RELEVANT CODE OR COMPONENT]

Explain why error occurs and provide fix.
```

---

### 💥 Prompt 3.3: App Crash Investigation

```
App crashes when:

**Action**: [WHAT USER DOES]
**Error**: [ERROR MESSAGE]
**Stack Trace**: [IF AVAILABLE]

Relevant components/files:
[LIST COMPONENTS INVOLVED]

[PASTE CODE OF SUSPECTED COMPONENT]

Investigate and provide:
- Root cause
- Complete fix
- Error boundary implementation
- Prevention strategy
```

---

## 🕌 CATEGORY 4: ISLAMIC COMPLIANCE

### ✅ Prompt 4.1: Validate Islamic Content

```
Review this AI-powered feature for Islamic compliance:

[PASTE AI FEATURE CODE]

Verify:
- Content filtering for haram terms
- JAKIM guideline compliance
- Proper source attribution
- No fatwa generation
- Mazhab Syafi'i alignment (for fiqh)
- Arabic text integrity (no modifications)

Suggest improvements for compliance.
```

---

### 🕋 Prompt 4.2: Implement Content Filter

```
Create Islamic content filter for QuranPulse:

Requirements:
- Filter AI responses before display
- Block prohibited terms (JAKIM list)
- Validate Quranic verses are unmodified
- Check hadith authenticity
- Flag content needing scholar review

Integrate with existing Gemini API service.
Provide comprehensive test cases.
```

---

### 📚 Prompt 4.3: Add Source Attribution

```
Add proper Islamic source attribution to this feature:

[PASTE FEATURE CODE]

Requirements:
- Cite Quran verses (Surah:Ayah)
- Reference hadith collections (Bukhari, Muslim, etc)
- Link to JAKIM resources where applicable
- Display in user-friendly format
- Mobile-responsive display

Follow Malaysian Islamic standards.
```

---

## ⚡ CATEGORY 5: PERFORMANCE OPTIMIZATION

### 🚀 Prompt 5.1: Optimize Bundle Size

```
Analyze and optimize bundle size for QuranPulse:

Current build stats: [IF YOU HAVE THEM]

Focus on:
- Component lazy loading
- Code splitting strategy
- Remove unused dependencies
- Optimize imports (tree-shaking)
- Image/asset optimization

Provide implementation plan with estimated size reduction.
```

---

### 💨 Prompt 5.2: Speed Up Component

```
This component is slow. Optimize it:

[PASTE COMPONENT CODE]

Current performance:
- Render time: [IF KNOWN]
- Re-render count: [IF KNOWN]

Apply:
- React.memo
- useMemo for expensive calculations
- useCallback for functions
- Code splitting if large
- Virtualization for long lists

Measure before/after performance.
```

---

### 🎯 Prompt 5.3: Optimize State Management

```
Review and optimize state management:

[PASTE COMPONENT WITH COMPLEX STATE]

Issues to address:
- Unnecessary re-renders
- Prop drilling
- State updates causing cascade re-renders
- Context overuse

Suggest better patterns (custom hooks, separate contexts).
```

---

## 🧩 CATEGORY 6: INTEGRATION

### 🔌 Prompt 6.1: Integrate New API

```
Integrate this API into QuranPulse:

API: [API NAME]
Purpose: [WHAT IT PROVIDES]
Documentation: [LINK OR DESCRIPTION]

Requirements:
- Create service file in services/
- Add TypeScript types
- Implement error handling
- Add caching with IndexedDB (dbService.ts)
- Add rate limiting
- Include usage examples

Follow existing service patterns (check dbService.ts for reference).
```

---

### 🎨 Prompt 6.2: Add UI Library Component

```
Integrate [LIBRARY NAME] component into QuranPulse:

Component: [COMPONENT NAME]
Use Case: [WHERE IT'S NEEDED]

Requirements:
- Match QuranPulse Islamic theme
- Support dark/light mode
- Mobile responsive
- Accessible (WCAG 2.1 AA)
- Tailwind CSS integration

Show complete implementation with theming.
```

---

### 🔗 Prompt 6.3: Connect Components

```
Connect these two features:

Feature A: [NAME] - [PURPOSE]
Feature B: [NAME] - [PURPOSE]

Integration needed:
[DESCRIBE HOW THEY SHOULD WORK TOGETHER]

[PASTE CODE OF BOTH FEATURES]

Requirements:
- Maintain single source of truth
- Proper data flow
- No tight coupling
- Event-driven communication if needed

Provide integration architecture and code.
```

---

## 📚 CATEGORY 7: DOCUMENTATION

### 📖 Prompt 7.1: Generate Component Documentation

```
Create comprehensive documentation for this component:

[PASTE COMPONENT CODE]

Include:
- Component purpose and usage
- Props interface with descriptions
- Example implementations
- State management explanation
- Integration points
- Common issues and solutions
- Islamic compliance notes (if applicable)

Format as JSDoc comments + separate markdown file.
```

---

### 🗺️ Prompt 7.2: Create Architecture Diagram

```
Generate architecture documentation for:

Feature: [FEATURE NAME]

[PASTE RELEVANT CODE FILES]

Provide:
- Component hierarchy diagram (Mermaid)
- Data flow diagram
- State management explanation
- API integration points
- File structure

Make it visual and easy to understand for new developers.
```

---

### 📝 Prompt 7.3: Update README

```
Update README.md with information about:

Feature: [FEATURE NAME]
Changes: [WHAT CHANGED]

[PASTE RELEVANT CODE OR DESCRIPTION]

Include:
- Feature description
- Setup instructions
- Usage examples
- Configuration options
- Troubleshooting

Follow existing README format.
```

---

## 🎨 CATEGORY 8: UI/UX IMPROVEMENTS

### 🌟 Prompt 8.1: Improve User Experience

```
Enhance UX for this component:

[PASTE COMPONENT CODE]

Improvements needed:
- Loading states with skeleton screens
- Error messages more user-friendly
- Success feedback animations
- Empty states with helpful CTAs
- Mobile touch targets (44x44px min)
- Keyboard navigation

Keep Islamic theme aesthetic.
Provide before/after comparison.
```

---

### 🎯 Prompt 8.2: Make Component Responsive

```
Make this component fully responsive:

[PASTE COMPONENT CODE]

Requirements:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly on mobile
- Readable text sizes
- Proper spacing
- Test on: iPhone SE, iPad, Desktop

Use Tailwind responsive utilities.
```

---

### 🌙 Prompt 8.3: Add Dark Mode Support

```
Add dark mode support to this component:

[PASTE COMPONENT CODE]

Requirements:
- Use Tailwind dark: prefix
- Follow QuranPulse theme system (Theme.LIGHT / Theme.DARK)
- Ensure proper contrast ratios
- Test readability in both modes
- Islamic green/gold color scheme maintained

Show side-by-side comparison.
```

---

## 🔧 CATEGORY 9: REFACTORING

### 🏗️ Prompt 9.1: Extract Custom Hook

```
Extract reusable logic into custom hook:

[PASTE COMPONENT WITH REPEATED LOGIC]

Create custom hook for:
[DESCRIBE WHAT LOGIC TO EXTRACT]

Requirements:
- Place in hooks/ folder
- Proper TypeScript types
- Error handling
- Unit tests
- Usage documentation

Show before/after component simplification.
```

---

### 📦 Prompt 9.2: Create Shared Component

```
This pattern is repeated across multiple components:

[PASTE REPEATED CODE PATTERN]

Used in:
- [Component 1]
- [Component 2]
- [Component 3]

Create reusable shared component:
- Location: components/ui/
- Flexible API (props)
- TypeScript types
- Variants support
- Documentation

Show usage examples in all three components.
```

---

### 🧹 Prompt 9.3: Clean Up Code

```
Clean up and modernize this code:

[PASTE OLD/MESSY CODE]

Apply:
- Modern React patterns (hooks over class components)
- Destructuring
- Optional chaining (?.)
- Nullish coalescing (??)
- Array methods over loops
- Remove console.logs
- Consistent formatting

Keep functionality identical.
```

---

## 🧪 CATEGORY 10: TESTING

### ✅ Prompt 10.1: Add Unit Tests

```
Write unit tests for this component:

[PASTE COMPONENT CODE]

Test scenarios:
- Happy path (normal usage)
- Edge cases (empty data, null values)
- Error handling
- User interactions
- State changes
- Props variations

Use React Testing Library.
Aim for 80%+ coverage.
```

---

### 🔗 Prompt 10.2: Add Integration Tests

```
Create integration test for this user flow:

Flow: [DESCRIBE USER JOURNEY]
Components involved: [LIST COMPONENTS]

[PASTE RELEVANT COMPONENTS]

Test:
- Complete user journey
- Component interactions
- API calls (mocked)
- State persistence
- Error scenarios

Use React Testing Library + Mock Service Worker.
```

---

### 🎭 Prompt 10.3: Add E2E Test

```
Write E2E test for this feature:

Feature: [FEATURE NAME]
User Flow: [STEP BY STEP]

Requirements:
- Use Playwright or Cypress
- Test on mobile and desktop viewports
- Include accessibility checks
- Test dark/light mode
- Handle async operations

Provide complete test file.
```

---

## 🚀 CATEGORY 11: DEPLOYMENT

### 📦 Prompt 11.1: Prepare for Production

```
Review this code for production readiness:

[PASTE CODE]

Check:
- Environment variables properly used
- No console.logs in production
- Error boundaries in place
- API keys secured
- Performance optimized
- Accessibility compliant
- SEO meta tags (if applicable)

Provide production checklist.
```

---

### 🔐 Prompt 11.2: Security Hardening

```
Harden security for production:

[PASTE SERVICE OR COMPONENT CODE]

Implement:
- Input validation (Zod schemas)
- Rate limiting
- CORS configuration
- XSS protection
- Content Security Policy
- Secure headers

Provide security configuration code.
```

---

## 💡 CATEGORY 12: QUICK FIXES

### ⚡ Prompt 12.1: Quick TypeScript Fix

```
Fix TypeScript errors in this file:

[PASTE CODE WITH TS ERRORS]

Error messages:
[PASTE TS ERROR MESSAGES]

Provide fixed code with proper types.
Keep changes minimal.
```

---

### 🎯 Prompt 12.2: Quick Style Fix

```
Fix styling issues:

Issue: [DESCRIBE STYLING PROBLEM]

[PASTE COMPONENT CODE]

Use Tailwind CSS utilities.
Support dark mode.
Mobile responsive.
```

---

### 🐛 Prompt 12.3: Quick Bug Fix

```
Quick fix needed:

Bug: [ONE LINE DESCRIPTION]
[PASTE MINIMAL CODE]

Just fix the bug, don't refactor everything.
Explain what was wrong.
```

---

## 🎯 USAGE TIPS

### 📋 **Copy-Paste Workflow:**

1. **Pick a prompt** from categories above
2. **Copy prompt** to clipboard
3. **Replace [PLACEHOLDERS]** with your info
4. **Paste in AI Studio** chat
5. **Get formatted response** with icons & structure!

### 🎨 **Customization:**

Feel free to modify prompts:
- Add specific requirements
- Combine multiple prompts
- Adjust focus areas
- Change priorities

### 💬 **Follow-up Prompts:**

After getting response, you can ask:
```
"Show me the tests for this"
"Add error handling for edge case X"
"Make it more performant"
"Add Islamic compliance check"
"Explain this part in detail"
```

---

## 🌟 MOST USED PROMPTS (Top 5)

### 1️⃣ **Component Review** (Prompt 1.1)
Most comprehensive - use for any component needing improvement

### 2️⃣ **New Component** (Prompt 2.1)
When building new features from scratch

### 3️⃣ **Bug Fix** (Prompt 3.1)
When something's broken and you need quick fix

### 4️⃣ **Performance Optimization** (Prompt 5.2)
When component feels slow

### 5️⃣ **Quick TypeScript Fix** (Prompt 12.1)
When TypeScript errors blocking you

---

## 📞 NEED CUSTOM PROMPT?

**Template for Custom Request:**
```
Create a custom prompt for:

Task: [WHAT YOU NEED TO DO]
Component/Feature: [WHAT YOU'RE WORKING ON]
Specific Requirements: [UNIQUE NEEDS]
Context: [ANY SPECIAL CONSIDERATIONS]
```

---

**🎉 You now have 50+ ready-to-use prompts for QuranPulse development!**

**Copy, paste, customize, and code faster! 🚀**