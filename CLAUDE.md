{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # GridAI \'97 Developer Context for Claude Code\
\
This file is read automatically by Claude Code when you run `claude` in this repo.\
It contains everything you need to understand and contribute to GridAI.\
\
---\
\
## What is GridAI?\
\
GridAI is a privacy-first desktop AI client for Swiss real estate agents using the Gridwork platform. It connects to Gridwork via MCP and processes requests through a pluggable LLM provider (default: Mistral AI).\
\
**Core principles:**\
- Security at design \'97 no own server, no third-party data sharing\
- Multi-provider LLM \'97 swap providers without changing app logic\
- Two deployment modes \'97 SaaS (GridAI pays, bills customer) or Enterprise (BYO key)\
- MCP for Gridwork \'97 all Gridwork data via MCP protocol, never direct REST calls\
- German UI \'97 users are Swiss German-speaking real estate agents\
\
---\
\
## Tech Stack\
\
| Layer | Technology |\
|---|---|\
| Desktop shell | Tauri v2 (Rust) |\
| Frontend | React 18 + TypeScript |\
| Styling | Tailwind CSS |\
| State | Zustand with persist middleware |\
| LLM | Pluggable provider (Mistral default) |\
| Gridwork data | MCP via Tauri Rust commands |\
| Auth | Keycloak OAuth 2.0 (localhost:7891 callback) |\
\
---\
\
## Project Structure\
\
```\
gridai/\
\uc0\u9500 \u9472 \u9472  CLAUDE.md                          # \u8592  you are here\
\uc0\u9500 \u9472 \u9472  index.html\
\uc0\u9500 \u9472 \u9472  package.json\
\uc0\u9500 \u9472 \u9472  vite.config.ts\
\uc0\u9500 \u9472 \u9472  tailwind.config.ts\
\uc0\u9500 \u9472 \u9472  tsconfig.json\
\uc0\u9500 \u9472 \u9472  src/\
\uc0\u9474    \u9500 \u9472 \u9472  main.tsx                       # React entry point\
\uc0\u9474    \u9500 \u9472 \u9472  index.css                      # Tailwind directives\
\uc0\u9474    \u9500 \u9472 \u9472  App.tsx                        # Root layout, view routing\
\uc0\u9474    \u9500 \u9472 \u9472  types/\
\uc0\u9474    \u9474    \u9492 \u9472 \u9472  index.ts                   # Message, Transaction, Task, Contact, GridworkContext\
\uc0\u9474    \u9500 \u9472 \u9472  store/\
\uc0\u9474    \u9474    \u9500 \u9472 \u9472  chatStore.ts               # Zustand: messages, addMessage, clearMessages\
\uc0\u9474    \u9474    \u9492 \u9472 \u9472  settingsStore.ts           # Zustand: deploymentMode, activeProvider, mcp config\
\uc0\u9474    \u9500 \u9472 \u9472  services/\
\uc0\u9474    \u9474    \u9500 \u9472 \u9472  gridwork.ts                # MCP calls via Tauri invoke(), context builder\
\uc0\u9474    \u9474    \u9492 \u9472 \u9472  llm/\
\uc0\u9474    \u9474        \u9500 \u9472 \u9472  types.ts               # LLMProvider interface, LLMModel, StreamChunk\
\uc0\u9474    \u9474        \u9500 \u9472 \u9472  index.ts               # Registry, streamMessageForDeployment()\
\uc0\u9474    \u9474        \u9500 \u9472 \u9472  mistral.ts             # Mistral AI provider (DEFAULT)\
\uc0\u9474    \u9474        \u9500 \u9472 \u9472  claude.ts              # Anthropic Claude provider\
\uc0\u9474    \u9474        \u9492 \u9472 \u9472  openai.ts              # OpenAI provider\
\uc0\u9474    \u9500 \u9472 \u9472  hooks/\
\uc0\u9474    \u9474    \u9492 \u9472 \u9472  useChat.ts                 # Main hook: send(), retry(), streaming\
\uc0\u9474    \u9500 \u9472 \u9472  plugins/                       # Plugin system (see Plugin Architecture below)\
\uc0\u9474    \u9474    \u9492 \u9472 \u9472  types.ts                   # GridAIPlugin interface\
\uc0\u9474    \u9492 \u9472 \u9472  components/\
\uc0\u9474        \u9500 \u9472 \u9472  Sidebar.tsx                # Navigation + connection status\
\uc0\u9474        \u9500 \u9472 \u9472  ChatWindow.tsx             # Message list + empty state\
\uc0\u9474        \u9500 \u9472 \u9472  MessageBubble.tsx          # Markdown rendering + streaming cursor\
\uc0\u9474        \u9500 \u9472 \u9472  InputBar.tsx               # Textarea + quick chips + send/stop\
\uc0\u9474        \u9500 \u9472 \u9472  ContextPanel.tsx           # Right panel: live Gridwork data\
\uc0\u9474        \u9492 \u9472 \u9472  Settings/\
\uc0\u9474            \u9492 \u9472 \u9472  ProviderSettings.tsx   # LLM + MCP config screen\
\uc0\u9492 \u9472 \u9472  src-tauri/\
    \uc0\u9500 \u9472 \u9472  Cargo.toml\
    \uc0\u9500 \u9472 \u9472  tauri.conf.json\
    \uc0\u9492 \u9472 \u9472  src/\
        \uc0\u9500 \u9472 \u9472  main.rs                    # Tauri entry, registers commands\
        \uc0\u9500 \u9472 \u9472  mcp.rs                     # MCP JSON-RPC client + Tauri commands\
        \uc0\u9492 \u9472 \u9472  oauth.rs                   # OAuth flow + localhost:7891 callback server\
```\
\
---\
\
## LLM Abstraction Layer\
\
The most important architectural decision. All LLM calls go through this interface:\
\
```typescript\
// src/services/llm/types.ts\
interface LLMProvider \{\
  id: string\
  name: string\
  models: LLMModel[]\
  defaultModel: string\
  validateConfig(config: LLMProviderConfig): Promise<boolean>\
  sendMessage(params: SendMessageParams, config: LLMProviderConfig): Promise<LLMResponse>\
  streamMessage(params: SendMessageParams, config: LLMProviderConfig): AsyncGenerator<LLMStreamChunk>\
\}\
```\
\
**Available providers:** `mistral` (default), `claude`, `openai`\
\
**Never call a provider directly** \'97 always use `streamMessageForDeployment()` from `src/services/llm/index.ts`. This handles both SaaS and Enterprise deployment modes transparently.\
\
**To add a new provider:** implement `LLMProvider`, add to registry in `src/services/llm/index.ts`.\
\
---\
\
## MCP Architecture\
\
Gridwork data flows through Rust, never direct from the frontend:\
\
```\
Frontend (TypeScript)\
  \uc0\u9492 \u9472 \u9472  invoke('mcp_call_tool', \{ toolName, arguments \})\
        \uc0\u9492 \u9472 \u9472  src-tauri/src/mcp.rs\
              \uc0\u9492 \u9472 \u9472  HTTP POST to https://api.app.gridwork.ch/grid/mcp\
                  (MCP JSON-RPC 2.0 protocol)\
```\
\
**Tauri commands available:**\
- `mcp_connect(endpoint, sessionToken)` \'97 initialize MCP handshake\
- `mcp_call_tool(toolName, arguments)` \'97 call any Gridwork MCP tool\
- `mcp_list_tools()` \'97 list available tools\
- `mcp_status()` \'97 check if connected\
\
**Frontend usage:**\
```typescript\
import \{ invoke \} from '@tauri-apps/api/core'\
const result = await invoke('mcp_call_tool', \{\
  toolName: 'gridwork_list_tasks',\
  arguments: \{ limit: 10 \}\
\})\
```\
\
---\
\
## OAuth Flow\
\
Gridwork uses Keycloak. The OAuth flow:\
\
1. `oauth_start()` \'97 starts local HTTP server on port 7891, opens browser\
2. User logs in at `app.gridwork.ch/auth/realms/portal/protocol/openid-connect/auth`\
3. Keycloak redirects to `http://localhost:7891/callback?code=...`\
4. Rust server captures the code, emits `oauth-callback` event to frontend\
5. Frontend polls `oauth_get_token()` every second until token appears\
6. Token used as Bearer for all MCP calls\
\
**Critical OAuth params:**\
- `client_id=grid-mcp`\
- `redirect_uri=http://localhost:7891/callback`\
- `scope=openid profile email Provider-CRM` \uc0\u8592  Provider-CRM scope sets correct audience\
\
**Known issue:** MCP still returns 401 \'97 Gridwork needs to add Audience Mapper in Keycloak for `grid-mcp` client. The `aud` claim must match the MCP resource server. Follow up with Gridwork team.\
\
---\
\
## Deployment Modes\
\
```typescript\
type DeploymentMode =\
  | \{ mode: 'saas'; endpoint: string \}           // GridAI proxy, no key needed\
  | \{ mode: 'enterprise'; providerId: string; config: LLMProviderConfig \}\
```\
\
Use `getDeploymentMode()` from `settingsStore` \'97 never check the mode manually in components.\
\
---\
\
## Settings Store\
\
```typescript\
// Key selectors\
selectIsConfigured    // boolean \'97 app ready to use\
selectActiveProvider  // \{ providerId, model, config, validated \}\
selectMcp             // \{ endpoint, sessionToken, connected, serverName \}\
selectDeploymentMode  // 'saas' | 'enterprise'\
\
// Key actions\
validateAndSaveApiKey(providerId, apiKey, baseUrl?)  // tests key live\
connectToMcp(sessionToken?)                           // OAuth + MCP handshake\
getDeploymentMode()                                   // returns DeploymentMode object\
```\
\
---\
\
## Chat Flow\
\
```\
User types \uc0\u8594  InputBar.send()\
  \uc0\u8594  useChat.sendMessage()\
    \uc0\u8594  buildGridworkContext(userMessage)    // fetches relevant MCP data\
    \uc0\u8594  serializeContext(ctx)               // formats as markdown for LLM\
    \uc0\u8594  streamMessageForDeployment()        // streams from LLM provider\
    \uc0\u8594  setStreamingContent(delta)          // live update UI\
    \uc0\u8594  addMessage(fullContent)             // commit to store\
```\
\
The system prompt is in `src/hooks/useChat.ts` \'97 German, informal "du" tone, real estate focused.\
\
---\
\
## Plugin System\
\
GridAI supports first-party plugins. Interface:\
\
```typescript\
// src/plugins/types.ts\
export interface GridAIPlugin \{\
  id: string\
  name: string\
  icon: React.ComponentType        // \uc0\u8592  ComponentType, NOT ReactNode\
  sidebar: React.ComponentType     // \uc0\u8592  ComponentType, NOT ReactNode\
  contextProvider?: (userMessage: string) => Promise<string>\
\}\
```\
\
**Critical:** `sidebar` and `icon` must be `React.ComponentType` (the component function itself), not `<Component />` (a rendered element). GridAI renders plugins inside an Error Boundary so a plugin crash cannot crash the main app.\
\
**To register a plugin:**\
```typescript\
// src/plugins/index.ts\
import \{ GridbidPlugin \} from '@gridwork/gridbid-plugin'\
export const PLUGINS = [GridbidPlugin]\
```\
\
**SDK for plugin authors:** `@gridwork/gridai-sdk` \'97 publishes the `GridAIPlugin` interface and re-exports `useSettingsStore`, `useChatStore` so plugins can access auth tokens and trigger chat messages.\
\
---\
\
## Gridbid Plugin (in development \'97 Fabio)\
\
Gridbid is an auction/bidding platform by Gridwork. It will be the first GridAI plugin.\
\
- Package: `@gridwork/gridbid-plugin`\
- Author: Fabio\
- Repo: TBD\
- Interface: implements `GridAIPlugin`\
- Auth: shares the same Gridwork OAuth token from `settingsStore`\
- peerDependencies: React, gridai-sdk (never as dependencies \'97 causes double-React)\
\
See `docs/gridbid-plugin-briefing.md` for full spec.\
\
---\
\
## Coding Conventions\
\
- **Language:** German UI text everywhere\
- **Tone:** informal "du" (not "Sie")\
- **Styling:** Tailwind utility classes only, no custom CSS\
- **Primary color:** violet-600 (#7F77DD)\
- **State:** Zustand \'97 use selectors to avoid unnecessary re-renders\
- **Async:** always use `Promise.allSettled()` for parallel fetches\
- **Errors:** errors show as chat messages, never as modal dialogs\
- **TypeScript:** strict mode, no `any`\
- **Formatting:** CHF currency via `Intl.NumberFormat('de-CH')`, dates via `Intl.DateTimeFormat('de-CH')`\
\
---\
\
## Open Issues\
\
| Issue | Status | Owner |\
|---|---|---|\
| MCP 401 \'97 Gridwork needs Audience Mapper for `grid-mcp` in Keycloak | Waiting on Gridwork | Gridwork team |\
| UI redesign to match Gridwork Figma design system | Not started | Michael |\
| i18n (DE/EN/FR) | Not started | Michael |\
| Tauri Stronghold for OS keychain (currently localStorage) | Planned v0.2 | Michael |\
| Auto-updater (tauri-plugin-updater) | Planned v0.2 | Michael |\
| Code signing for Mac + Windows distribution | Planned v0.2 | Michael |\
| Gridbid plugin | In progress | Fabio |\
| Tasks view | Planned v0.2 | Michael |\
| Contacts view | Planned v0.2 | Michael |\
\
---\
\
## Running the Project\
\
```bash\
# Install dependencies\
npm install\
\
# Start dev mode (compiles Rust + React, hot reload)\
npm run tauri dev\
\
# Build for production\
npm run tauri build\
```\
\
First run takes 3-5 minutes (Rust compilation). Subsequent runs are fast.\
\
**Prerequisites:** Rust (rustup), Node 20+, Xcode CLI tools (Mac)\
\
---\
\
## Key External Services\
\
| Service | URL | Purpose |\
|---|---|---|\
| Gridwork MCP | `https://api.app.gridwork.ch/grid/mcp` | All Gridwork data |\
| Keycloak OAuth | `https://app.gridwork.ch/auth/realms/portal` | Authentication |\
| Mistral AI | `https://api.mistral.ai/v1` | Default LLM |\
| Anthropic | `https://api.anthropic.com/v1` | Claude provider |\
| OpenAI | `https://api.openai.com/v1` | OpenAI provider |}