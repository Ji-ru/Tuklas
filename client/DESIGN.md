---
name: Eco-Adventurous Modern
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#414844'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#1c6390'
  on-secondary: '#ffffff'
  secondary-container: '#90cdff'
  on-secondary-container: '#025783'
  tertiary: '#2d2519'
  on-tertiary: '#ffffff'
  tertiary-container: '#443b2d'
  on-tertiary-container: '#b2a593'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#cbe6ff'
  secondary-fixed-dim: '#90cdff'
  on-secondary-fixed: '#001e31'
  on-secondary-fixed-variant: '#004b72'
  tertiary-fixed: '#efe0cd'
  tertiary-fixed-dim: '#d2c4b2'
  on-tertiary-fixed: '#221a0f'
  on-tertiary-fixed-variant: '#4f4538'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Epilogue
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Epilogue
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Epilogue
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system embodies an **Eco-Adventurous & Modern** aesthetic, designed for premium travel and sustainable exploration. It balances the rugged, visceral energy of the outdoors with a sharp, logistically precise interface. 

The visual narrative is driven by a fusion of **Corporate Modern** structure and **Glassmorphism** overlays. This creates a "tech-in-nature" feel—reliable and high-performing, yet deeply connected to the environment. The UI should evoke a sense of discovery and high-end stewardship, utilizing heavy whitespace to allow photography of natural landscapes to serve as the primary emotional anchor.

## Colors

The palette is grounded in an earthy, high-contrast light mode that feels both organic and prestigious.

*   **Primary (Forest Green):** Used for primary actions, branding, and active states. It represents sustainability and growth.
*   **Secondary (Deep Ocean Teal):** Used for secondary interactions, links, and accents to provide a sense of depth and fluidity.
*   **Tertiary (Warm Sand):** Utilized for large surface areas, background containers, and soft highlights to prevent the UI from feeling "clinical."
*   **Neutral:** A deep navy-black used for primary text and structural borders to maintain logistical sharpness.

Surface colors should lean into the **Warm Sand** (#F5E6D3) for containers, creating a "tactile paper" or "grounded earth" foundation against the clean white background.

## Typography

This design system utilizes **Epilogue** exclusively to maintain a cohesive, editorial, and distinctive voice. 

Headlines use **Bold (700)** and **ExtraBold (800)** weights to create a rugged, impactful hierarchy that mirrors the scale of nature. Body text is kept clean and legible with standard weights, while labels utilize uppercase styling and bold weights to evoke the feeling of logistical tags and field equipment. Line heights are generous to ensure a premium, airy feel.

## Layout & Spacing

The layout follows a **Fluid Grid** model with high-density margins to frame content like a luxury travel journal. 

*   **Desktop:** 12-column grid with 24px gutters and 64px outer margins.
*   **Mobile:** 4-column grid with 16px gutters and 16px outer margins.

The spacing rhythm is built on an 8px base unit. Use **xl (80px)** vertical padding between major sections to emphasize the premium, minimalist aesthetic. Content should be grouped in logical "cards" or "modules" that utilize internal **md (24px)** padding to maintain a sharp, organized appearance.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** combined with **Glassmorphism**. 

Instead of traditional heavy shadows, use:
1.  **Backdrop Blurs:** For navigation bars, modal overlays, and floating filters, use a semi-transparent white (60% opacity) with a 12px-20px blur. This keeps the interface feeling "tech-forward" and light.
2.  **Low-Contrast Outlines:** Use 1px solid borders in a slightly darker shade of the surface color (e.g., Deep Ocean Teal at 10% opacity) to define boundaries without adding visual weight.
3.  **Tonal Stacking:** Raise elements by shifting background colors from pure white to **Warm Sand**, creating depth through color temperature rather than shadow.

## Shapes

The shape language is **Rounded (Level 2)**. 

Standard components (buttons, inputs) use a **0.5rem (8px)** radius to feel approachable and organic. Larger containers and cards use **1rem (16px)** to emphasize the "Eco" aesthetic. This softness is balanced by **crisp, 1px borders** to ensure the design remains "logistically sharp" and professional. Avoid pill-shapes for primary buttons to maintain a more architectural, modern look.

## Components

### Buttons
*   **Primary:** Solid Forest Green with white text. 8px border radius. Bold Epilogue labels.
*   **Secondary:** Ghost style with Deep Ocean Teal 1px border.
*   **Tertiary:** Warm Sand background with Forest Green text for low-priority actions.

### Cards
*   Cards should feature high-quality imagery with a subtle 1px Forest Green (10% opacity) border. 
*   Use a bottom-aligned "Glass" overlay for image captions or titles to maintain legibility over photography.

### Input Fields
*   Outlined style using the Neutral color at 20% opacity. 
*   Active states should transition to a 2px Forest Green border.

### Chips & Tags
*   Small, 4px rounded tags. Use the Tertiary (Warm Sand) color for backgrounds with bold, small-caps Forest Green text. These should look like professional equipment labels.

### Lists
*   Clean, un-bordered lists with 24px vertical spacing between items. Use custom Forest Green icons for bullet points to reinforce the brand personality.