#!/bin/bash
# Renames PascalCase shadcn-vue component files to kebab-case
# and updates index.ts imports accordingly.
#
# Usage: ./scripts/kebab-shadcn.sh [component-folder]
# Example: ./scripts/kebab-shadcn.sh src/common/ui/button
#          ./scripts/kebab-shadcn.sh  (processes all ui folders)

UI_DIR="src/common/ui"

process_folder() {
  local folder="$1"

  # Skip if no .vue files
  ls "$folder"/*.vue &>/dev/null || return

  for file in "$folder"/*.vue; do
    local basename=$(basename "$file" .vue)
    # Convert PascalCase to kebab-case
    local kebab=$(echo "$basename" | sed -E 's/([a-z])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')

    if [ "$basename" != "$kebab" ]; then
      local new_file="$folder/$kebab.vue"
      mv "$file" "$new_file"
      echo "  renamed: $basename.vue → $kebab.vue"

      # Update index.ts imports
      if [ -f "$folder/index.ts" ]; then
        sed -i '' "s|./${basename}.vue|./${kebab}.vue|g" "$folder/index.ts"
      fi

      # Replace @/ alias with #src/ in component
      sed -i '' 's|@/common/|#src/common/|g' "$new_file"
    fi
  done
}

if [ -n "$1" ]; then
  echo "Processing: $1"
  process_folder "$1"
else
  echo "Processing all components in $UI_DIR..."
  for dir in "$UI_DIR"/*/; do
    [ -d "$dir" ] || continue
    echo "Processing: $dir"
    process_folder "$dir"
  done
fi

echo "Done."
