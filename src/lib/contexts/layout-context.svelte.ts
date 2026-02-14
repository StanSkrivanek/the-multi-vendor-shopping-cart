// src/lib/contexts/layout-context.svelte.ts

// Create a reactive state object - single source of truth
class LayoutState {
	hideMainHeader = $state(false)
}

export const layoutState = new LayoutState()
