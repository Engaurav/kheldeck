# Glassmorphism & Liquid Glass Styling Recipes

Technical implementations for rendering modern glassmorphism and liquid glass surfaces in React Native (Expo) and Web.

---

## 1. Core Principles of Liquid Glass
Liquid glass differs from standard flat translucent boxes by simulating **refraction**, **surface tension sheen**, and **ambient specular highlights**.

Key ingredients:
1. **Specular Top Edge Sheen:** 1px top border with higher opacity than other edges to simulate light reflecting off polished glass.
2. **Double-Layered Gradient:** Soft linear gradient from high translucency at top to slightly darker translucency at bottom.
3. **Diffused Ambient Glow:** Soft box-shadow with low alpha spreading 20–30px.
4. **Frosted Blur Backdrop:** `backdrop-filter: blur(16px)` on Web, paired with clean elevated alpha surfaces on mobile.

---

## 2. React Native & Web StyleSheet Recipes

### A. Liquid Glass Card (Dark Mode)
```typescript
import { StyleSheet, Platform } from 'react-native';

export const glassStyles = StyleSheet.create({
  darkLiquidCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.22)', // Top specular catch
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },

  lightPorcelainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.95)', // Bright light catch
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.08)',
      },
      default: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
});
```

---

## 3. Quick-Tap Numeric Chip Styling

```typescript
export const chipStyles = StyleSheet.create({
  chipBase: {
    minWidth: 44,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 3,
    marginVertical: 4,
  },
  chipDarkInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  chipDarkActive: {
    backgroundColor: '#6366F1', // Indigo Glow
    borderColor: '#818CF8',
    borderTopColor: '#A5B4FC',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(99, 102, 241, 0.50)',
      },
      default: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  chipLightInactive: {
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  chipLightActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#6366F1',
    borderTopColor: '#818CF8',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(79, 70, 229, 0.35)',
      },
      default: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
});
```

---

## 4. Animation & Micro-Interactions
- **Touch down:** Slight scale shrink to `0.96` (`transform: [{ scale: 0.96 }]`).
- **Success pulse:** Emerald glow ring on round completion.
- **Error shake:** Quick 2-cycle horizontal vibration if total tricks exceed 13.
