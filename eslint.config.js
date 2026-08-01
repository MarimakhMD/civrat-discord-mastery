import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// The Vite application is rooted at src/main.tsx and src/App.tsx.  The ignored
// TanStack/React-Start scaffold is an inactive legacy export kept outside the
// active runtime until its independent removal can be coordinated.
export default defineConfig([
  globalIgnores(['dist', 'src/routes/**', 'src/routeTree.gen.ts', 'src/router.tsx', 'src/server.ts', 'src/start.ts', 'src/components/civrat/**', 'src/components/ui/{accordion,alert-dialog,alert,aspect-ratio,avatar,badge,breadcrumb,button,calendar,carousel,card,chart,checkbox,collapsible,command,context-menu,dialog,drawer,dropdown-menu,form,hover-card,input,input-otp,menubar,navigation-menu,pagination,popover,progress,radio-group,resizable,scroll-area,separator,sheet,sidebar,skeleton,slider,sonner,table,tabs,textarea,tooltip}.tsx', 'src/lib/{auth,config.server,error-capture,error-page,lovable-error-reporting,supabase,use-guild-config}.ts', 'src/lib/api/**', 'src/hooks/use-mobile.tsx']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { globals: globals.browser },
  },
  { files: ['src/context/**/*.tsx'], rules: { 'react-refresh/only-export-components': 'off' } },
])
