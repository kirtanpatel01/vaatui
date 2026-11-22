# DESIGN & IMPLEMENTATION RULES

Strict rules for all agents working on VaatUI. Read and adhere to these before touching any code.

---

## 1. NEVER Override Component Styling with `className`
- **Use built-in variants only:** Always use component props (`variant="outline"`, `size="lg"`, etc.).
- **DO NOT pass custom styling classes into shadcn components:**
  - ❌ `<Button className="h-12 px-6 font-semibold shadow-sm cursor-pointer text-muted-foreground">`
  - ✅ `<Button variant="outline" size="lg">`
- **`className` is strictly for layout placement:** Only use `className` on a component when needed for positioning in a parent grid or flex container (e.g. `col-span-2`, `w-full`). Never for colors, typography, borders, heights, padding, or cursors.

---

## 2. Base UI Primitives (`@base-ui/react`), NOT Radix UI
- **NEVER use `asChild`:** Radix's `asChild` does NOT exist in Base UI.
- **Use `render` prop for composition:**
  - ❌ `<Button asChild><Link to="/preview">...</Link></Button>`
  - ❌ `<Button><Link to="/preview">...</Link></Button>` (never nest `<a>` inside `<button>`)
  - ✅ `<Button render={<Link to="/preview" />} nativeButton={false}>...</Button>`
- **`nativeButton={false}` is required:** Whenever `render` changes a button to an anchor/link (`<a>`, `<Link>`), you MUST pass `nativeButton={false}`.

---

## 3. Keep `src/components/ui/` 100% Pristine
- Never add custom Tailwind classes or ad-hoc styling hacks inside `src/components/ui/*`.
- shadcn UI primitives must remain standard and unpolluted.

---

## 4. Icon Guidelines
- **Use `data-icon` in buttons & components:**
  - ✅ `<IconEye data-icon="inline-start" />`
  - ✅ `<IconArrowRight data-icon="inline-end" />`
- **DO NOT add sizing classes to icons inside buttons:**
  - ❌ `<Button><IconEye className="size-5" />...</Button>`
  - ✅ `<Button><IconEye data-icon="inline-start" />...</Button>`

---

## 5. Colors & Theming
- **Semantic tokens only:** Always use `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, etc.
- **No raw color classes:** Never use `text-blue-500`, `bg-gray-100`, etc.
- **No manual `dark:` color overrides:** Semantic CSS variables handle dark mode automatically.

---

## 6. Layout & Spacing
- Use `flex` with `gap-*` or `grid` with `gap-*`.
- **Never use `space-x-*` or `space-y-*`.**
- Use `size-*` when width and height are equal (`size-8`, not `w-8 h-8`).

---

## 7. Workflow & Git Rules
- **NEVER push to remote (`git push`):** Keep all work strictly local unless the user explicitly commands a push.
- **Always verify builds:** Run `bun run build` before considering any UI change complete to guarantee clean compilation.
