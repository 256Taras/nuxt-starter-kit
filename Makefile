.PHONY: help install dev build preview lint fix typecheck gen-sdk test test-watch test-coverage e2e e2e-ui plop storybook clean

help:
	@echo "Available targets:"
	@echo "  install       Install dependencies"
	@echo "  dev           Start Nuxt dev server"
	@echo "  build         Production build"
	@echo "  preview       Preview production build"
	@echo ""
	@echo "  lint          Run ESLint"
	@echo "  fix           Run ESLint --fix + Prettier"
	@echo "  typecheck     Strict typecheck (nuxi typecheck)"
	@echo ""
	@echo "  gen-sdk       Regenerate SDK from backend OpenAPI"
	@echo "  plop          Interactive code generator"
	@echo ""
	@echo "  test          Run unit tests"
	@echo "  test-watch    Run unit tests in watch mode"
	@echo "  test-coverage Run unit tests with coverage"
	@echo "  e2e           Run Playwright e2e tests"
	@echo "  e2e-ui        Run Playwright e2e tests in UI mode"
	@echo ""
	@echo "  storybook     Run Storybook dev server"
	@echo "  clean         Remove build artifacts and caches"

install:
	@echo "📦 Installing dependencies..."
	pnpm install

dev:
	@echo "🚀 Starting dev server..."
	pnpm dev

build:
	@echo "🏗  Building for production..."
	pnpm build

preview:
	@echo "👀 Previewing production build..."
	pnpm preview

lint:
	@echo "🔎 Linting..."
	pnpm lint

fix:
	@echo "🔧 Fixing lint and formatting..."
	pnpm lint:fix
	pnpm prettier:fix

typecheck:
	@echo "🧠 Typechecking..."
	npx nuxi typecheck

gen-sdk:
	@echo "📡 Regenerating SDK from backend OpenAPI..."
	pnpm gen:sdk

plop:
	@echo "🏗  Launching Plop..."
	pnpm plop

test:
	@echo "🧪 Running unit tests..."
	pnpm vitest run

test-watch:
	@echo "👁  Running unit tests in watch mode..."
	pnpm vitest

test-coverage:
	@echo "📊 Running unit tests with coverage..."
	pnpm vitest run --coverage

e2e:
	@echo "🎭 Running Playwright e2e tests..."
	pnpm playwright test

e2e-ui:
	@echo "🎭 Running Playwright in UI mode..."
	pnpm playwright test --ui

storybook:
	@echo "📚 Starting Storybook..."
	pnpm storybook

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf .nuxt .output dist node_modules/.cache coverage playwright-report test-results
	@echo "✅ Done"
