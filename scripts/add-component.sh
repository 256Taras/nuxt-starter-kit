#!/bin/bash
# Adds a shadcn-vue component, renames to kebab-case, fixes aliases,
# and moves to the correct Atomic Design level.
#
# Usage: ./scripts/add-component.sh <component> [level]
#
# Levels: atoms, molecules, organisms
# If level is omitted, it will be auto-detected from a built-in map.
#
# Examples:
#   ./scripts/add-component.sh button
#   ./scripts/add-component.sh dialog organisms
#   ./scripts/add-component.sh card molecules

set -e

COMPONENT="$1"
LEVEL="$2"
UI_DIR="src/common/components"

if [ -z "$COMPONENT" ]; then
  echo "Usage: ./scripts/add-component.sh <component> [atoms|molecules|organisms]"
  exit 1
fi

# ─────────────────────────────────────────────────────────────────────
# Auto-detect level if not provided
# ─────────────────────────────────────────────────────────────────────
declare -A LEVEL_MAP
# Atoms — smallest UI primitives, no internal composition
LEVEL_MAP[avatar]=atoms
LEVEL_MAP[badge]=atoms
LEVEL_MAP[button]=atoms
LEVEL_MAP[checkbox]=atoms
LEVEL_MAP[input]=atoms
LEVEL_MAP[label]=atoms
LEVEL_MAP[progress]=atoms
LEVEL_MAP[radio-group]=atoms
LEVEL_MAP[separator]=atoms
LEVEL_MAP[skeleton]=atoms
LEVEL_MAP[slider]=atoms
LEVEL_MAP[spinner]=atoms
LEVEL_MAP[switch]=atoms
LEVEL_MAP[textarea]=atoms
LEVEL_MAP[toggle]=atoms
LEVEL_MAP[toggle-group]=atoms

# Molecules — composed from atoms, single responsibility
LEVEL_MAP[accordion]=molecules
LEVEL_MAP[alert]=molecules
LEVEL_MAP[alert-dialog]=molecules
LEVEL_MAP[aspect-ratio]=molecules
LEVEL_MAP[breadcrumb]=molecules
LEVEL_MAP[calendar]=molecules
LEVEL_MAP[card]=molecules
LEVEL_MAP[carousel]=molecules
LEVEL_MAP[collapsible]=molecules
LEVEL_MAP[combobox]=molecules
LEVEL_MAP[context-menu]=molecules
LEVEL_MAP[date-picker]=molecules
LEVEL_MAP[dropdown-menu]=molecules
LEVEL_MAP[form]=molecules
LEVEL_MAP[hover-card]=molecules
LEVEL_MAP[menubar]=molecules
LEVEL_MAP[number-field]=molecules
LEVEL_MAP[pagination]=molecules
LEVEL_MAP[pin-input]=molecules
LEVEL_MAP[popover]=molecules
LEVEL_MAP[range-calendar]=molecules
LEVEL_MAP[scroll-area]=molecules
LEVEL_MAP[select]=molecules
LEVEL_MAP[sonner]=molecules
LEVEL_MAP[tabs]=molecules
LEVEL_MAP[toast]=molecules
LEVEL_MAP[tooltip]=molecules
LEVEL_MAP[tags-input]=molecules

# Organisms — complex, multi-molecule compositions
LEVEL_MAP[command]=organisms
LEVEL_MAP[data-table]=organisms
LEVEL_MAP[dialog]=organisms
LEVEL_MAP[drawer]=organisms
LEVEL_MAP[navigation-menu]=organisms
LEVEL_MAP[resizable]=organisms
LEVEL_MAP[sheet]=organisms
LEVEL_MAP[sidebar]=organisms
LEVEL_MAP[stepper]=organisms
LEVEL_MAP[table]=organisms

if [ -z "$LEVEL" ]; then
  LEVEL="${LEVEL_MAP[$COMPONENT]}"
  if [ -z "$LEVEL" ]; then
    echo "Error: Unknown component '$COMPONENT'. Specify level manually:"
    echo "  ./scripts/add-component.sh $COMPONENT atoms|molecules|organisms"
    exit 1
  fi
  echo "Auto-detected level: $LEVEL"
fi

# Validate level
if [[ "$LEVEL" != "atoms" && "$LEVEL" != "molecules" && "$LEVEL" != "organisms" ]]; then
  echo "Error: Invalid level '$LEVEL'. Must be: atoms, molecules, organisms"
  exit 1
fi

TARGET_DIR="$UI_DIR/$LEVEL/$COMPONENT"

# ─────────────────────────────────────────────────────────────────────
# Step 1: Run shadcn add
# ─────────────────────────────────────────────────────────────────────
echo "1. Adding shadcn component: $COMPONENT"
pnpm dlx shadcn-vue@latest add "$COMPONENT" --yes 2>&1

# shadcn puts files in $UI_DIR/$COMPONENT/
SOURCE_DIR="$UI_DIR/$COMPONENT"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: shadcn did not create $SOURCE_DIR"
  exit 1
fi

# ─────────────────────────────────────────────────────────────────────
# Step 2: Move to atomic level
# ─────────────────────────────────────────────────────────────────────
echo "2. Moving to $TARGET_DIR"
mkdir -p "$UI_DIR/$LEVEL"
mv "$SOURCE_DIR" "$TARGET_DIR"

# ─────────────────────────────────────────────────────────────────────
# Step 3: Rename PascalCase to kebab-case
# ─────────────────────────────────────────────────────────────────────
echo "3. Renaming to kebab-case"
for file in "$TARGET_DIR"/*.vue; do
  [ -f "$file" ] || continue
  basename=$(basename "$file" .vue)
  kebab=$(echo "$basename" | sed -E 's/([a-z])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')

  if [ "$basename" != "$kebab" ]; then
    mv "$file" "$TARGET_DIR/$kebab.vue"
    echo "   $basename.vue → $kebab.vue"

    # Update index.ts
    if [ -f "$TARGET_DIR/index.ts" ]; then
      sed -i '' "s|./${basename}.vue|./${kebab}.vue|g" "$TARGET_DIR/index.ts"
    fi
  fi
done

# ─────────────────────────────────────────────────────────────────────
# Step 4: Fix aliases (@/ → #src/)
# ─────────────────────────────────────────────────────────────────────
echo "4. Fixing aliases"
find "$TARGET_DIR" -name "*.vue" -o -name "*.ts" | while read -r file; do
  sed -i '' 's|@/common/|#src/common/|g' "$file"
done

# ─────────────────────────────────────────────────────────────────────
# Step 5: Fix internal cross-references between shadcn components
#         e.g. button imports from "../button" → "../../atoms/button"
# ─────────────────────────────────────────────────────────────────────
echo "5. Fixing cross-references"
find "$TARGET_DIR" -name "*.vue" -o -name "*.ts" | while read -r file; do
  # Fix references like from '#src/common/ui/button' to '#src/common/ui/atoms/button'
  for atom in "${!LEVEL_MAP[@]}"; do
    atom_level="${LEVEL_MAP[$atom]}"
    sed -i '' "s|#src/common/ui/${atom}|#src/common/ui/${atom_level}/${atom}|g" "$file"
  done
done

# ─────────────────────────────────────────────────────────────────────
# Step 6: Run prettier on new files
# ─────────────────────────────────────────────────────────────────────
echo "6. Formatting"
pnpm prettier --write "$TARGET_DIR" 2>/dev/null || true

echo ""
echo "Done! Component added to: $TARGET_DIR"
echo ""
echo "Import:"
echo "  import { ... } from \"#src/common/ui/$LEVEL/$COMPONENT\";"
