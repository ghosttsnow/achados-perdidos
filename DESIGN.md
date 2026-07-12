---
name: Achados e Perdidos - Colégio Batista Nova Betânia
description: Sistema de achados e perdidos escolar com design acolhedor e funcional
colors:
  primary: "#1e3a5f"
  primary-light: "#2d5a8e"
  success: "#22c55e"
  warning: "#f97316"
  neutral-bg: "#f8fafc"
  neutral-surface: "#ffffff"
  neutral-text: "#1e293b"
  neutral-muted: "#64748b"
  neutral-border: "#e2e8f0"
  category-purple: "#f3e8ff"
  category-blue: "#eff6ff"
  category-amber: "#fef3c7"
  category-gray: "#f9fafb"
  status-orange: "#fff7ed"
  status-orange-text: "#c2410c"
  status-green: "#f0fdf4"
  status-green-text: "#15803d"
  status-blue: "#eff6ff"
  status-blue-text: "#1d4ed8"
typography:
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.3
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.xl}"
    padding: "0px"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  chip:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-muted}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
---

# Design System: Achados e Perdidos

## 1. Overview

**Creative North Star: "O Quadro de Avisos Digital"**

Um sistema que evoca a familiaridade de um quadro de aviso escolar — organizado, acessível, direto — mas com a fluidez de uma interface moderna. A estética é institucional sem ser fria, funcional sem ser sem alma. Rejects explicitamente dashboards corporativos cinza e interfaces escolares infantilizadas com cores chapadas.

**Key Characteristics:**
- Fundo neutro claro (#f8fafc) que empresta calor sem ser cream/sand
- Azul profundo (#1e3a5f) como âncora de confiança e seriedade
- Cards brancos com sombras sutis que criam hierarquia sem sobrecarga
- Animações de entrada suaves que guiam o olhar sem distrair
- Badges de status com cores semânticas (laranja/verde/azul) para feedback instantâneo

## 2. Colors

A paleta é institutional-minimal: um azul profundo como âncora, neutros calorosos para fundo, e cores semânticas para status. Restraint é a palavra-chave.

### Primary
- **Deep Navy** (#1e3a5f): Cor principal — navbar, botões primários, títulos, filtros ativos. Usada com moderação para transmitir confiança institucional.
- **Soft Navy** (#2d5a8e): Versão mais clara — hover states, ícones, destaques secundários.

### Semantic
- **Status Orange** (#f97316 / bg #fff7ed): Itens perdidos — urgência sem alarme.
- **Status Green** (#22c55e / bg #f0fdf4): Itens encontrados — resolução, sucesso.
- **Status Blue** (#3b82f6 / bg #eff6ff): Itens devolvidos — conclusão, ciclo fechado.

### Category
- **Uniforme** (bg #f3e8ff, text #7c3aed): Violeta suave para uniformes.
- **Eletrônico** (bg #eff6ff, text #2563eb): Azul claro para dispositivos.
- **Material** (bg #fef3c7, text #d97706): Âmbar para material escolar.
- **Outro** (bg #f9fafb, text #6b7280): Cinza neutro para categorias diversas.

### Neutral
- **Background** (#f8fafc): Fundo da página — branco levemente azulado, não cream.
- **Surface** (#ffffff): Cards, formulários, modais.
- **Text** (#1e293b): Texto principal — alto contraste, legível.
- **Muted** (#64748b): Texto secundário, placeholders, labels.
- **Border** (#e2e8f0): Divisores, bordas de inputs.

### Named Rules
**The Institutional Accent Rule.** O azul profundo aparece em ≤15% de qualquer tela. Sua raridade é o que transmite autoridade sem dominar.

## 3. Typography

**Display Font:** Inter (system-ui fallback)
**Body Font:** Inter (system-ui fallback)

**Character:** Tipografia sans-serif limpa e profissional. Inter transmite modernidade sem frieza, com boa legibilidade em todos os tamanhos.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3rem), 1.2): Títulos de página — "Encontrou? Perdeu?", headings de seção.
- **Headline** (700, clamp(1.5rem, 4vw, 2.25rem), 1.3): Subtítulos de seção, títulos de card.
- **Title** (600, 1.25rem, 1.4): Nomes de itens, labels de navegação.
- **Body** (400, 16px, 1.5): Descrições, textos de apoio. Max line-length: 65ch.
- **Label** (500, 14px, normal): Badges, chips de categoria, botões, metadados.

### Named Rules
**The School Bulletin Rule.** Títulos são diretos e curtos como em um quadro de avisos. Nunca mais de 8 palavras em um heading de página.

## 4. Elevation

Sistema flat com sombras sutis para criar hierarquia. Superfícies são planas em repouso; sombras aparecem apenas como resposta a estado (hover, elevation, focus).

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 3px rgba(0,0,0,0.1)`): Cards em estado normal — presença sem peso.
- **Hover** (`box-shadow: 0 10px 25px rgba(0,0,0,0.1)`): Cards em hover — elevação sutil que convida interação.
- **Focus** (`box-shadow: 0 0 0 3px rgba(30,58,95,0.1)`): Anéis de foco — acessibilidade sem agressividade.

### Named Rules
**The Flat-By-Default Rule.** Superfícies são planas. Sombras são reação, não decoração. Se uma sombra está sempre visível, ela está pesada demais.

## 5. Components

### Buttons
- **Shape:** Border-radius 16px (rounded-lg) — bordas gentemente curvadas, não pill-shaped.
- **Primary:** Deep Navy (#1e3a5f) background, white text, padding 12px 24px, font-weight 500.
- **Hover:** Transição suave (200ms), elevação sutil via shadow, leve scale(1.02).
- **Secondary/Outline:** Transparente com borda Deep Navy, texto Deep Navy. Usado para ações secundárias.
- **Ghost:** Sem borda, sem fundo. Texto Deep Navy. Para ações discretas.

### Chips / Category Filters
- **Inactive:** Fundo branco, borda cinza, texto cinza. Hover: fundo cinza claro.
- **Active:** Fundo Deep Navy, texto branco, sombra sutil. Transição 200ms.
- **Shape:** Pill (rounded-full) — forma amigável e moderna.

### Cards (ItemCard)
- **Corner Style:** 24px (rounded-xl) — bordas generosas, não quadradas.
- **Background:** Branco puro.
- **Shadow Strategy:** Sombra mínima em repouso, shadow-md em hover com transição 300ms.
- **Border:** 1px sólida cinza claro (#e2e8f0) — separação sutil.
- **Internal Padding:** 0 (imagem ocupa topo), padding interno 16-24px no conteúdo.
- **Image:** Altura fixa 192px (h-48), object-cover, scale suave em hover.

### Status Badges
- **Shape:** Pill (rounded-full), padding 2px 10px.
- **Perdido:** Fundo laranja claro (#fff7ed), texto laranja escuro (#c2410c).
- **Encontrado:** Fundo verde claro (#f0fdf4), texto verde escuro (#15803d).
- **Devolvido:** Fundo azul claro (#eff6ff), texto azul escuro (#1d4ed8).
- **Typography:** 12px, font-weight 500.

### Inputs / Fields
- **Style:** Fundo branco, borda cinza (#e2e8f0), border-radius 12px.
- **Focus:** Borda muda para Deep Navy, ring de foco azul sutil.
- **Placeholder:** Texto muted (#64748b).
- **Padding:** 12px 16px.

### Navigation (Navbar)
- **Style:** Fixa no topo, fundo branco, borda inferior cinza.
- **Logo:** Ícone BookOpen + texto bold Deep Navy.
- **Links:** Texto cinza em repouso, fundo azul claro + texto azul em active.
- **Mobile:** Hamburger menu com slide-down animado.
- **User Menu:** Dropdown com avatar, nome, email, links de ação.

### Hero Section (Home)
- **Layout:** Texto centralizado, max-width 6xl, padding generoso.
- **Heading:** Display size, Deep Navy, "Encontrou? Perdeu?"
- **Subtext:** Body size, muted, max-width 2xl centralizado.
- **CTA:** Dois botões lado a lado — "Ver Galeria" (outline) + "Reportar Item" (primary).

## 6. Do's and Don't

### Do:
- **Do** usar Deep Navy (#1e3a5f) como âncora visual — é a cor de confiança e autoridade do sistema.
- **Do** manter fundo neutro claro (#f8fafc) — não é cream, não é sand, é branco levemente azulado.
- **Do** usar cores semânticas para status (laranja=perdido, verde=encontrado, azul=devolvido) — são universais e intuitivas.
- **Do** aplicar sombras apenas em hover/active — o sistema é flat por padrão.
- **Do** usar border-radius generoso (16-24px) — bordas gentes transmitem acolhimento.
- **Do** manter headings curtos como em um quadro de avisos escolar — direto ao ponto.
- **Do** usar Inter como família tipográfica — limpa, profissional, boa legibilidade.

### Don't:
- **Don't** usar cores cream/sand/beige no fundo — é o padrão AI saturado de 2026, o sistema já tem fundo próprio (#f8fafc).
- **Don't** aplicar gradientes em textos — decorativo, nunca significativo. Use uma cor sólida.
- **Don't** usar glassmorphism como padrão — blur e glass cards devem ser raros e intencionais.
- **Don't** criar grids de cards idênticos com ícone + heading + texto repetidos — varie o layout.
- **Don't** usar `border-left` ou `border-right` maior que 1px como acento colorido — proibido.
- **Don't** infantilizar com cores primárias chapadas — o sistema é sério mas acolhedor, não cartoon.
- **Don't** criar dashboards corporativos cinza frio — o sistema é escolar, não SaaS.
- **Don't** usar small uppercase tracked eyebrow em cada seção — é o scaffolding AI saturado, não voz da marca.
- **Don't** colocar números 01/02/03 como marcadores de seção — use apenas quando a sequência é informativa.
- **Don't** deixar texto transbender o container — teste headings em todos os breakpoints.
