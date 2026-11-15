# Shadcn Component Unwanted Styling Audit

This document catalogues every instance across the codebase where a **shadcn/ui** component has custom `className` styling overrides that alter, distort, or bypass its native design system tokens (such as border-radii, elevation shadows, ring borders, default paddings, or standard `variant`/`size` props) where they were unnecessary.

---

## Summary of Anti-Patterns Detected

| Category | Typical Overrides Detected | Native Shadcn Default | Impact / Why It's Unwanted |
| :--- | :--- | :--- | :--- |
| **1. Popover Container Disruption** | `rounded-2xl`, `rounded-xl`, `border border-border/60`, `shadow-xl`, `shadow-2xl`, `bg-popover/95`, `backdrop-blur-md`, `p-1.5`, `p-0` | `rounded-3xl`, `ring-1 ring-foreground/5`, `shadow-lg`, `bg-popover`, `p-4` | Destroys the uniform rounded-3xl container curvature, replaces subtle ring elevation with heavy borders, forces transparency/blurs, and strips standard internal padding. |
| **2. Dialog & Sheet Stripping** | `p-0`, `gap-0`, `border border-border/80`, `shadow-2xl` | `p-6`, `gap-4`, `rounded-3xl`, `ring-1 ring-foreground/5`, `shadow-xl` | Wipes out standard modal padding and spacing, forcing manual padding on children. |
| **3. Boxed Headers** | `<DialogHeader className="p-4 border-b bg-muted/30">`<br>`<SheetHeader className="p-4 border-b bg-muted/30">` | Clean, unboxed text block (`flex flex-col gap-2 text-center sm:text-left`) | Turns clean shadcn headers into rigid card headers with tinted backgrounds and dividers. |
| **4. Button Variant Bypassing** | `variant="ghost" className="bg-secondary text-secondary-foreground"`, `className="bg-destructive text-destructive-foreground"`, `rounded-full`, `size-8` / `size-9` | `variant="secondary"`, `variant="destructive"`, `rounded-xl`, `size="icon"`, `size="icon-sm"` | Manually duplicates colors instead of using built-in CVA variant tokens; forces circular `rounded-full` over base-luma `rounded-xl`. |
| **5. Tabs Distortion** | `h-8 p-0.5 bg-muted/60` | `h-9 p-1 rounded-xl bg-muted` | Compresses tabs height and padding unnecessarily. |
| **6. Separator Opacity** | `className="opacity-60"` | Clean `bg-border` line | Hardcodes opacity instead of letting the theme's `--border` variable govern divider contrast. |
| **7. Resizable Handle Muting** | `bg-transparent after:hidden hover:bg-transparent` | Visual border line with interactive hover thumb | Strips visual affordance from panel divider. |

---

## Detailed List of All Occurrences

### 1. Popover (`<PopoverContent>`)

#### 1. Attachment Options Menu Popover
- **File:** [chat-input-bar.tsx](file:///e:/Products/vaatui/src/components/chat/main/chat-input-bar.tsx#L735-L740)
- **Line:** 735–740
- **Applied Classes:**
  ```tsx
  className="w-52 p-1.5 rounded-2xl shadow-xl border border-border/60 bg-popover/95 backdrop-blur-md"
  ```
- **Native Shadcn (`popover.tsx`):**
  `rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5`
- **What changes the look:**
  - `rounded-2xl`: Overrides standard `rounded-3xl`.
  - `border border-border/60`: Redundant hard border fighting native `ring-1 ring-foreground/5`.
  - `shadow-xl`: Overrides native `shadow-lg`.
  - `bg-popover/95 backdrop-blur-md`: Injects transparency and blur where solid `bg-popover` belongs.
  - `p-1.5`: Strips native `p-4` padding.

---

#### 2. Chat Sidebar Context Menu Popover
- **File:** [sidebar-main-item.tsx](file:///e:/Products/vaatui/src/components/chat/sidebar/sidebar-main-item.tsx#L360-L364)
- **Line:** 360–364
- **Applied Classes:**
  ```tsx
  className="w-56 p-1.5 gap-1 rounded-2xl shadow-xl border border-border/60 bg-popover/95 backdrop-blur-md"
  ```
- **Native Shadcn (`popover.tsx`):**
  `rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5`
- **What changes the look:**
  - Exact copy of the `chat-input-bar.tsx` override: forces `rounded-2xl`, `border border-border/60`, `shadow-xl`, `backdrop-blur-md`, and `p-1.5`.

---

#### 3. Message Feed Actions Menu Popover
- **File:** [message-actions-popover.tsx](file:///e:/Products/vaatui/src/components/chat/main/message-feed/message-actions-popover.tsx#L137-L141)
- **Line:** 137–141
- **Applied Classes:**
  ```tsx
  className="w-40 rounded-xl border border-border/80 bg-popover/95 p-1 shadow-xl backdrop-blur-md select-none flex flex-col gap-0.5"
  ```
- **Native Shadcn (`popover.tsx`):**
  `rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5`
- **What changes the look:**
  - Shrinks radius from `rounded-3xl` down to `rounded-xl`.
  - Overrides shadow to `shadow-xl`.
  - Adds `border border-border/80`, `backdrop-blur-md`, and replaces `p-4` with `p-1`.

---

#### 4. GIF Picker Popover
- **File:** [gif-picker.tsx](file:///e:/Products/vaatui/src/components/chat/main/attachments/gif-picker.tsx#L409-L413)
- **Line:** 409–413
- **Applied Classes:**
  ```tsx
  className="w-[320px] sm:w-[360px] p-0 rounded-2xl shadow-2xl border border-border/80 bg-background/95 backdrop-blur-md overflow-hidden flex flex-col max-h-[420px]"
  ```
- **Native Shadcn (`popover.tsx`):**
  `rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5`
- **What changes the look:**
  - Forces `rounded-2xl` over `rounded-3xl`.
  - Forces `shadow-2xl` over `shadow-lg`.
  - Adds heavy `border border-border/80`, `backdrop-blur-md`, and strips padding to `p-0`.

---

#### 5. Emoji Picker Popover (Chat Input)
- **File:** [chat-input-bar.tsx](file:///e:/Products/vaatui/src/components/chat/main/chat-input-bar.tsx#L804-L808)
- **Line:** 804–808
- **Applied Classes:**
  ```tsx
  className="w-auto p-0 border-0 shadow-2xl bg-transparent overflow-hidden rounded-2xl duration-75 data-[state=open]:duration-75 data-[state=closed]:duration-50"
  ```
- **Native Shadcn (`popover.tsx`):**
  `rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5`
- **What changes the look:**
  - Completely strips the popover shell: `p-0 border-0 bg-transparent rounded-2xl shadow-2xl`.

---

#### 6. Emoji Picker Popover (Message Actions)
- **File:** [message-actions-popover.tsx](file:///e:/Products/vaatui/src/components/chat/main/message-feed/message-actions-popover.tsx#L93-L97)
- **Line:** 93–97
- **Applied Classes:**
  ```tsx
  className="w-auto p-0 border-0 shadow-2xl bg-transparent overflow-hidden rounded-2xl select-none duration-75 data-[state=open]:duration-75 data-[state=closed]:duration-50"
  ```
- **What changes the look:**
  - Strips shell with `p-0 border-0 shadow-2xl bg-transparent rounded-2xl`.

---

#### 7. Message Reactions Emoji Picker Popover
- **File:** [message-reactions.tsx](file:///e:/Products/vaatui/src/components/chat/main/message-feed/message-reactions.tsx#L80-L84)
- **Line:** 80–84
- **Applied Classes:**
  ```tsx
  className="w-auto p-0 border-0 shadow-2xl bg-transparent overflow-hidden rounded-2xl select-none duration-75 data-[state=open]:duration-75 data-[state=closed]:duration-50"
  ```
- **What changes the look:**
  - Strips shell with `p-0 border-0 shadow-2xl bg-transparent rounded-2xl`.

---

### 2. Dialog & Modal Components (`<DialogContent>`, `<DialogHeader>`)

#### 8. Camera Modal Content
- **File:** [camera-modal.tsx](file:///e:/Products/vaatui/src/components/chat/main/attachments/camera-modal.tsx#L109)
- **Line:** 109
- **Applied Classes:**
  ```tsx
  className="p-0 overflow-hidden sm:max-w-md gap-0 rounded-3xl border border-border/80 bg-background shadow-2xl"
  ```
- **Native Shadcn (`dialog.tsx`):**
  `rounded-3xl bg-background p-6 shadow-xl ring-1 ring-foreground/5 sm:max-w-lg gap-4`
- **What changes the look:**
  - Wipes out modal body padding (`p-0`) and structure gap (`gap-0`).
  - Overrides `shadow-xl` with `shadow-2xl`.
  - Adds heavy `border border-border/80` fighting native `ring-1 ring-foreground/5`.

#### 9. Camera Modal Header
- **File:** [camera-modal.tsx](file:///e:/Products/vaatui/src/components/chat/main/attachments/camera-modal.tsx#L111)
- **Line:** 111
- **Applied Classes:**
  ```tsx
  className="p-4 border-b bg-muted/30"
  ```
- **Native Shadcn (`dialog.tsx`):**
  `flex flex-col gap-2 text-center sm:text-left`
- **What changes the look:**
  - Turns an open, clean shadcn dialog header into a boxed title strip with background shading and a hard divider line.

---

#### 10. Create Poll Modal Content
- **File:** [create-poll-modal.tsx](file:///e:/Products/vaatui/src/components/chat/main/attachments/create-poll-modal.tsx#L65)
- **Line:** 65
- **Applied Classes:**
  ```tsx
  className="p-0 overflow-hidden sm:max-w-md gap-0 rounded-3xl border border-border/80 bg-background shadow-2xl"
  ```
- **What changes the look:**
  - `p-0 gap-0 border border-border/80 shadow-2xl` (destroys native `p-6 gap-4 shadow-xl ring-1`).

#### 11. Create Poll Modal Header
- **File:** [create-poll-modal.tsx](file:///e:/Products/vaatui/src/components/chat/main/attachments/create-poll-modal.tsx#L68)
- **Line:** 68
- **Applied Classes:**
  ```tsx
  className="p-4 border-b bg-muted/30"
  ```
- **What changes the look:**
  - Boxed header with `bg-muted/30` and `border-b`.

---

#### 12. Share Contact Modal Content
- **File:** [share-contact-modal.tsx](file:///e:/Products/vaatui/src/components/chat/main/attachments/share-contact-modal.tsx#L47)
- **Line:** 47
- **Applied Classes:**
  ```tsx
  className="p-0 overflow-hidden sm:max-w-sm gap-0 rounded-3xl border border-border/80 bg-background shadow-2xl flex flex-col max-h-[75vh]"
  ```
- **What changes the look:**
  - `p-0 gap-0 border border-border/80 shadow-2xl`.

#### 13. Share Contact Modal Header
- **File:** [share-contact-modal.tsx](file:///e:/Products/vaatui/src/components/chat/main/attachments/share-contact-modal.tsx#L49)
- **Line:** 49
- **Applied Classes:**
  ```tsx
  className="p-4 border-b bg-muted/30"
  ```
- **What changes the look:**
  - Boxed header with `bg-muted/30` and `border-b`.

---

#### 14. Forward Message Dialog Content
- **File:** [forward-message-dialog.tsx](file:///e:/Products/vaatui/src/components/chat/main/forward-message-dialog.tsx#L114)
- **Line:** 114
- **Applied Classes:**
  ```tsx
  className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl border border-border/80 bg-popover/95 shadow-2xl backdrop-blur-xl"
  ```
- **Native Shadcn (`dialog.tsx`):**
  `rounded-3xl bg-background p-6 shadow-xl ring-1 ring-foreground/5 sm:max-w-lg`
- **What changes the look:**
  - Forces `rounded-2xl` instead of `rounded-3xl`.
  - Overrides background to `bg-popover/95 backdrop-blur-xl`.
  - Strips `p-6` to `p-0` and `gap-4` to `gap-0`.
  - Overrides shadow to `shadow-2xl`.

---

### 3. Sheet Components (`<SheetContent>`, `<SheetHeader>`)

#### 15. Saved / Pinned Messages Sheet Content
- **File:** [saved-messages-sheet.tsx](file:///e:/Products/vaatui/src/components/chat/main/saved-messages-sheet.tsx#L154-L156)
- **Line:** 154–156
- **Applied Classes:**
  ```tsx
  className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border/80"
  ```
- **Native Shadcn (`sheet.tsx`):**
  `bg-background p-6 shadow-2xl transition-all duration-150 data-[side=right]:border-l sm:max-w-sm`
- **What changes the look:**
  - Wipes out native `p-6` to `p-0`.
  - Adds redundant `border-l border-border/80` (native sheet already handles side borders).

#### 16. Saved / Pinned Messages Sheet Header
- **File:** [saved-messages-sheet.tsx](file:///e:/Products/vaatui/src/components/chat/main/saved-messages-sheet.tsx#L159)
- **Line:** 159
- **Applied Classes:**
  ```tsx
  className="p-4 border-b bg-muted/30 shrink-0"
  ```
- **Native Shadcn (`sheet.tsx`):**
  `flex flex-col gap-1.5 p-4`
- **What changes the look:**
  - Injects `bg-muted/30` and `border-b` into what should be a clean header.

---

### 4. Button Components (`<Button>`, `<AlertDialogAction>`)

#### 17. Input Bar Attachment Plus Button
- **File:** [chat-input-bar.tsx](file:///e:/Products/vaatui/src/components/chat/main/chat-input-bar.tsx#L723-L729)
- **Line:** 723–729
- **Applied Classes:**
  ```tsx
  <Button
    variant="ghost"
    size="icon"
    className="size-9 shrink-0 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
  />
  ```
- **What changes the look:**
  - Uses `variant="ghost"` and then manually writes `bg-secondary text-secondary-foreground hover:bg-secondary/80` — this is literally what `variant="secondary"` does natively!
  - Forces `rounded-full` instead of shadcn's base-luma button shape (`rounded-xl`).
  - Manually hardcodes `size-9` when `size="icon"` already handles the sizing.

#### 18. Input Bar Send Button
- **File:** [chat-input-bar.tsx](file:///e:/Products/vaatui/src/components/chat/main/chat-input-bar.tsx#L881-L886)
- **Line:** 881–886
- **Applied Classes:**
  ```tsx
  <Button
    size="icon"
    className="size-9 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
  />
  ```
- **What changes the look:**
  - Forces `rounded-full` over `rounded-xl`.
  - Manually passes `bg-primary text-primary-foreground hover:bg-primary/90` which is already the native `default` variant.
  - Adds manual `shadow-xs`.

#### 19. Input Bar Mic Button
- **File:** [chat-input-bar.tsx](file:///e:/Products/vaatui/src/components/chat/main/chat-input-bar.tsx#L868-L872)
- **Line:** 868–872
- **Applied Classes:**
  ```tsx
  <Button
    variant="ghost"
    size="icon"
    className="size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
  />
  ```
- **What changes the look:**
  - Forces `rounded-full` and `size-9`.

#### 20. Voice Recording Action Buttons (Resume, Cancel, Send)
- **File:** [chat-input-bar.tsx](file:///e:/Products/vaatui/src/components/chat/main/chat-input-bar.tsx#L678-L715)
- **Line:** 678, 694, 706
- **Applied Classes:**
  - Line 678: `size-8 rounded-full text-foreground hover:bg-destructive/15 cursor-pointer shrink-0`
  - Line 694: `size-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/15 cursor-pointer shrink-0`
  - Line 706: `size-9 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs cursor-pointer shrink-0`
- **What changes the look:**
  - Hardcoded `rounded-full`, `size-8`, `size-9`, `shadow-xs`, and manual destructive background classes instead of using `variant="destructive" size="icon"`.

#### 21. Details Hero Action Buttons
- **File:** [details-hero.tsx](file:///e:/Products/vaatui/src/components/chat/details/details-hero.tsx#L103-L163)
- **Line:** 103, 113, 123, 138, 147, 161
- **Applied Classes:**
  ```tsx
  className="flex-1 h-8 text-xs gap-1.5 rounded-lg border-border/80 cursor-pointer shadow-2xs hover:bg-muted"
  ```
- **Native Shadcn (`button.tsx`):**
  `rounded-xl`, `border-input`, `size="sm"` (`h-8 px-3 gap-1.5 text-xs`)
- **What changes the look:**
  - Overrides button curvature with `rounded-lg`.
  - Adds custom `shadow-2xs` and `hover:bg-muted` on an outline button that already has outline styling.

#### 22. Create Tab Sheet Close Button
- **File:** [create-tab-sheet.tsx](file:///e:/Products/vaatui/src/components/chat/sidebar/header/create-tab-sheet.tsx#L96)
- **Line:** 96
- **Applied Classes:**
  ```tsx
  <Button variant="ghost" size="icon-sm" className="bg-secondary shrink-0" />
  ```
- **What changes the look:**
  - Declares `variant="ghost"` and then manually passes `bg-secondary` instead of `variant="secondary"`.

#### 23. User Settings Alert Dialog Action
- **File:** [user-settings-sheet.tsx](file:///e:/Products/vaatui/src/components/chat/sidebar/settings/user-settings-sheet.tsx#L299)
- **Line:** 299
- **Applied Classes:**
  ```tsx
  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  ```
- **What changes the look:**
  - Manually hardcodes destructive classes instead of simply setting `variant="destructive"`.

---

### 5. Tabs Components (`<TabsList>`, `<TabsContent>`)

#### 24. Details Tabs List
- **File:** [details-tabs.tsx](file:///e:/Products/vaatui/src/components/chat/details/tabs/details-tabs.tsx#L37)
- **Line:** 37
- **Applied Classes:**
  ```tsx
  <TabsList className="grid grid-cols-3 h-8 p-0.5 bg-muted/60 shrink-0">
  ```
- **Native Shadcn (`tabs.tsx`):**
  `inline-flex h-9 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground`
- **What changes the look:**
  - Compresses native height (`h-8` instead of `h-9`).
  - Shrinks native padding (`p-0.5` instead of `p-1`).
  - Weakens background with `bg-muted/60` instead of solid `bg-muted`.

#### 25. Details Tabs Content
- **File:** [details-tabs.tsx](file:///e:/Products/vaatui/src/components/chat/details/tabs/details-tabs.tsx#L70-L81)
- **Line:** 70, 77, 81
- **Applied Classes:**
  ```tsx
  <TabsContent value="..." className="mt-0">
  ```
- **What changes the look:**
  - Forces `mt-0` overriding native spacing.

---

### 6. Separator (`<Separator>`)

#### 26. Separator Opacity Overrides
- **Files:**
  - [contact-info-card.tsx](file:///e:/Products/vaatui/src/components/chat/details/contact-info-card.tsx#L67): Lines 67, 125, 165
  - [group-info-card.tsx](file:///e:/Products/vaatui/src/components/chat/details/group-info-card.tsx#L56): Lines 56, 132
- **Applied Classes:**
  ```tsx
  <Separator className="opacity-60" />
  ```
- **Native Shadcn (`separator.tsx`):**
  `bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full`
- **What changes the look:**
  - Hardcodes `opacity-60` on the divider line instead of respecting the semantic `--border` variable.

---

### 7. Resizable Panel Handle (`<ResizableHandle>`)

#### 27. Stripped Handle Affordance
- **File:** [chat-layout.tsx](file:///e:/Products/vaatui/src/components/chat/chat-layout.tsx#L31)
- **Line:** 31
- **Applied Classes:**
  ```tsx
  <ResizableHandle className="relative z-10 -mx-1 w-2 cursor-col-resize bg-transparent after:hidden hover:bg-transparent focus-visible:ring-0 focus-visible:outline-hidden" />
  ```
- **Native Shadcn (`resizable.tsx`):**
  Features a visible divider line and an interactive grip indicator on hover/focus.
- **What changes the look:**
  - `bg-transparent after:hidden hover:bg-transparent` completely strips the visual divider and grip, leaving an invisible hit-area.
