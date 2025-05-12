# Storefront-New Full Audit and Optimization Plan

---

## **Medusa Integration**

- Centralize all API calls in a single, well-typed `medusaStoreApi`.
- Remove all direct fetch calls scattered across components.
- Ensure all requests include the publishable API key.
- Implement full CRUD for:
  - Customer login, registration, password reset
  - Profile management
  - Address management (list, add, edit, delete, set default)
  - Cart and checkout
  - Orders
- Persist customer authentication and session tokens.
- Use environment variables for backend URLs and API keys.

---

## **Code Quality**

- Remove duplicate or dead code.
- Fix syntax errors and ensure consistent TypeScript usage.
- Modularize large files into smaller, focused components.
- Add error handling and loading states throughout.
- Add tests for critical flows.

---

## **Architecture**

- Organize pages under `/app` with clear routes.
- Use context providers for auth, cart, and user state.
- Implement hooks for data fetching and mutations.
- Use a design system or component library for consistent UI.
- Optimize responsiveness and mobile experience.

---

## **UI/UX**

- Improve `/account` page with integrated profile and address management.
- Enhance navigation, feedback, and accessibility.
- Use modals or inline forms for add/edit.
- Add section headers, icons, and consistent styling.
- Optimize for performance and SEO.

---

## **Next Steps**

- Break this plan into subtasks for implementation.
- Switch to Code mode to execute changes.
- Test end-to-end flows after each step.

---

*Generated on 2025-04-08*