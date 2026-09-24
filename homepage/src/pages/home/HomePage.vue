<template>
  <MainLayout hide-footer>
    <!-- Hero -->
    <section class="td-hero-section">
      <div class="td-container">
        <div class="flex flex-wrap gap-2">
          <GBadge
            label="npm"
            :value="`v${SQLINGO_VERSION}`"
            :color="GPillColor.Blue"
            :size="GBadgeSize.Lg"
            href="https://www.npmjs.com/package/sqlingo"
          />
          <GBadge
            label="tracks sqlglot"
            :value="`v${SQLGLOT_VERSION}`"
            :color="GPillColor.Violet"
            :size="GBadgeSize.Lg"
            href="https://github.com/tobymao/sqlglot"
          />
        </div>

        <h1 class="td-hero-title">
          TypeScript <span class="td-hero-accent">SQL parser</span> and transpiler.
        </h1>
        <p class="td-hero-desc">
          sqlingo is a port of <a
            href="https://github.com/tobymao/sqlglot"
            target="_blank"
            rel="noopener noreferrer"
            class="td-link"
          >SQLGlot</a>. Parse, transpile, and optimize SQL across 32 dialects, in the browser or Node.js.
        </p>

        <div class="td-hero-actions">
          <a
            href="/sqlingo/playground/"
            class="td-cta-btn"
          >
            Try the playground
          </a>
          <div class="td-install-box">
            <code class="td-install-text">
              <span class="td-install-prompt">$</span> npm install sqlingo
            </code>
            <div class="flex-1" />
            <button
              type="button"
              class="td-install-copy"
              @click="copyInstall"
            >
              {{ installCopied ? "copied" : "copy" }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Code demo -->
    <section class="td-demo-section">
      <div class="td-container">
        <div class="td-demo-header">
          <div>
            <div class="td-section-label">
              01 / API demo
            </div>
          </div>
          <div class="td-demo-tabs">
            <button
              v-for="(_, name) in demos"
              :key="name"
              type="button"
              class="td-demo-tab"
              :class="{
                'td-demo-tab--active': activeDemo === name,
              }"
              @click="() => activeDemo = name"
            >
              {{ name }}
            </button>
          </div>
        </div>

        <div class="td-demo-card">
          <div
            v-for="(demo, name) in demos"
            v-show="activeDemo === name"
            :key="name"
          >
            <div class="td-demo-bar">
              <span class="td-demo-dot td-demo-dot--primary" />
              <span class="td-demo-bar-label">EXAMPLE</span>
              <div class="flex-1" />
              <button
                type="button"
                class="td-demo-copy"
                @click="() => copyCode(demo.code)"
              >
                {{ codeCopied ? 'copied' : 'copy' }}
              </button>
            </div>
            <ClientOnly>
              <template #fallback>
                <div class="td-code-placeholder" />
              </template>
              <GCodeBlock
                :id="`demo-${name}`"
                :code="demo.code"
                :language="GCodeLanguage.Typescript"
                :highlight-theme="GHighlightTheme.AtomOne"
                show-line-numbers
                hide-header
                class="border-none bg-white py-3"
              />
            </ClientOnly>
            <div class="td-demo-bar td-demo-bar--returns">
              <span class="td-demo-dot td-demo-dot--success" />
              <span class="td-demo-bar-label td-demo-bar-label--success">RETURNS</span>
            </div>
            <ClientOnly>
              <template #fallback>
                <div class="td-code-placeholder td-code-placeholder--short" />
              </template>
              <GCodeBlock
                :id="`demo-result-${name}`"
                :code="demo.result"
                :language="GCodeLanguage.Typescript"
                :highlight-theme="GHighlightTheme.AtomOne"
                show-line-numbers
                hide-header
                class="border-none bg-white py-3"
              />
            </ClientOnly>
            <div class="td-demo-caption">
              {{ demo.note }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dialects -->
    <section class="td-dialects-section">
      <div class="td-container">
        <div class="td-dialects-header">
          <div>
            <div class="td-section-label">
              02 / Supported dialects
            </div>
            <p class="td-dialects-subtitle">
              {{ shownCount }} of {{ ALL_DIALECTS_TOTAL }} - one-for-one with upstream
            </p>
          </div>
          <input
            v-model="dialectQuery"
            placeholder="Filter dialects..."
            class="td-filter-input"
          >
        </div>

        <div class="td-dialect-groups">
          <div
            v-for="group in filteredGroups"
            :key="group.name"
            class="td-dialect-group"
          >
            <div class="td-dialect-group-label">
              <h3 class="td-dialect-group-name">
                {{ group.name }}
              </h3>
              <span class="td-dialect-group-count">{{ group.items.length }} dialects</span>
            </div>
            <div class="td-dialect-group-items">
              <span
                v-for="d in group.items"
                :key="d"
                class="td-dialect-chip"
              >{{ d }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section class="td-cards-section">
      <div class="td-container td-cards-grid">
        <a
          href="/sqlingo/playground/"
          class="td-card td-card--dark"
        >
          <div class="td-card-eyebrow td-card-eyebrow--dark">
            Playground
          </div>
          <h3 class="td-card-title td-card-title--dark">
            Transpile SQL in the browser
          </h3>
          <p class="td-card-desc td-card-desc--dark">
            Paste a query, pick two dialects, and watch it convert. Also does
            SQL to DBML.
          </p>
          <span class="td-card-action td-card-action--dark">Open the playground &rarr;</span>
        </a>
        <a
          href="./api-reference/"
          class="td-card td-card--light"
        >
          <div class="td-card-eyebrow td-card-eyebrow--light">
            API reference
          </div>
          <h3 class="td-card-title">
            Every class and function, typed
          </h3>
          <p class="td-card-desc">
            Full TypeScript types generated from source, with examples for each
            expression node.
          </p>
          <span class="td-card-action">Browse the docs &rarr;</span>
        </a>
      </div>
    </section>

    <!-- Why this exists -->
    <section class="td-why-section">
      <div class="td-container td-why-grid">
        <div>
          <div class="td-section-label">
            03 / Why this exists
          </div>
        </div>
        <div class="td-prose">
          <p class="td-prose-lead">
            At work I maintain
            <a
              href="https://github.com/holistics/dbml"
              target="_blank"
              rel="noopener noreferrer"
              class="td-link"
            >@dbml/core</a>, a library that converts between DBML and SQL.
            Under the hood it uses ANTLR, and it has not aged well:
          </p>
          <ul class="td-prose-list">
            <li>The package is 33 MB. It actually broke our CI with out-of-memory errors.</li>
            <li>Adding a new dialect means making the bundle even larger.</li>
            <li>The parser is incomplete, with error messages like <code>No viable alternative at....</code></li>
            <li>After all of that, we still only support 5 dialects.</li>
          </ul>
          <p class="td-prose-body">
            At a hackathon I stumbled on
            <a
              href="https://github.com/tobymao/sqlglot"
              target="_blank"
              rel="noopener noreferrer"
              class="td-link"
            >SQLGlot</a>,
            which does exactly what I needed. The catch: it's Python.
            I tried running it via Pyodide, but the runtime is too heavy to ship.
          </p>
          <p class="td-prose-body">
            So I started porting it to JavaScript. Two weeks in,
            <a
              href="https://github.com/tobilg/polyglot"
              target="_blank"
              rel="noopener noreferrer"
              class="td-link"
            >polyglot</a>
            was announced. I kept going because I wanted full control over the
            implementation and a reliable way to stay in sync with upstream.
            sqlingo mirrors SQLGlot file for file, so catching up with a new
            release is a diff, not a rewrite.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="td-footer">
      <div class="td-container td-footer-inner">
        <span>sqlingo is <a
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
          class="td-footer-link"
        >MIT licensed</a>. Based on <a
          href="https://github.com/tobymao/sqlglot"
          target="_blank"
          rel="noopener noreferrer"
          class="td-footer-link"
        >SQLGlot</a> by Toby Mao, also MIT.</span>
        <a
          href="https://github.com/huydo862003/sqlingo/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="td-footer-link"
        >Report an issue</a>
      </div>
    </footer>

    <component
      :is="scriptTag"
      type="application/ld+json"
    >
      {{ JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "sqlingo",
        "description": "sqlingo (sqlingojs) is a TypeScript/JavaScript SQL parser, transpiler,"
          + " and query optimizer. Port of Python SQLGlot supporting 32 SQL dialects.",
        "alternateName": "sqlingojs",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All",
        "license": "https://opensource.org/licenses/MIT",
        "softwareVersion": SQLINGO_VERSION,
        "url": "https://huydo862003.github.io/sqlingo/",
        "author": {
          "@type": "Person",
          "name": "Huy Do",
        },
      }) }}
    </component>
  </MainLayout>
</template>

<script setup lang="ts">
import {
  ref, computed,
} from 'vue';
import {
  GBadge,
  GBadgeSize,
  GPillColor,
  GCodeBlock,
  GCodeLanguage,
  GHighlightTheme,
} from '@hdnax/genuix';
import {
  useSeoMeta,
} from '@unhead/vue';
import MainLayout from '@/layout/main/MainLayout.vue';
import {
  SQLINGO_VERSION,
  SQLGLOT_VERSION,
} from '@/constants';

const scriptTag = 'script';

useSeoMeta({
  title: 'sqlingo: TypeScript SQL Parser, Transpiler & Optimizer',
  ogTitle: 'sqlingo: TypeScript SQL Parser, Transpiler & Optimizer',
  ogType: 'website',
  ogUrl: 'https://huydo862003.github.io/sqlingo/',
  ogImage: 'https://huydo862003.github.io/sqlingo/og-image.png',
  description:
    'sqlingo (sqlingojs) is a TypeScript/JavaScript SQL parser, transpiler, and query optimizer ported from Python SQLGlot. Parse, convert, and optimize SQL across 32 dialects including BigQuery, Snowflake, Postgres, MySQL, DuckDB, and Spark. Runs in Node.js and the browser.',
  ogDescription:
    'TypeScript SQL parser and transpiler supporting 32 dialects. Convert SQL between BigQuery, Snowflake, Postgres, MySQL, DuckDB, and more. Open-source port of SQLGlot.',
});

const installCopied = ref(false);

function copyInstall () {
  navigator.clipboard?.writeText('npm install sqlingo');
  installCopied.value = true;
  setTimeout(() => {
    installCopied.value = false;
  }, 1400);
}

const activeDemo = ref('parse');
const codeCopied = ref(false);

function copyCode (code: string) {
  navigator.clipboard?.writeText(code);
  codeCopied.value = true;
  setTimeout(() => {
    codeCopied.value = false;
  }, 1400);
}

const demos: Record<string, {
  code: string;
  result: string;
  note: string;
}> = {
  parse: {
    code: `import { parse } from "sqlingo";
import { MySQL } from "sqlingo/mysql";

const [ast] = parse(
  "SELECT a, b FROM t WHERE a > 1",
  { read: MySQL },
);`,
    result: `Select(
  expressions=[Column(a), Column(b)],
  from=From(this=Table(t)),
  where=Where(this=GT(...)),
)`,
    note: 'A full expression tree, mirroring SQLGlot\'s node classes one for one.',
  },
  transpile: {
    code: `import { transpile } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const [sql] = transpile(
  "SELECT DATE_SUB(d, INTERVAL 1 DAY) FROM t",
  { read: MySQL, write: Postgres },
);`,
    result: 'SELECT d - INTERVAL \'1 DAY\' FROM t',
    note: 'Dialect quirks (quoting, date math, casts) are rewritten for the target.',
  },
  optimize: {
    code: `import { optimize } from "sqlingo";

const sql = optimize(
  "SELECT * FROM t WHERE 1 = 1 AND x > 2",
  { schema: { t: { x: "INT" } } },
);`,
    result: 'SELECT t.x AS x FROM t AS t WHERE t.x > 2',
    note: 'Qualifies columns, expands stars, and folds constant predicates.',
  },
};

const DIALECT_GROUPS = [
  {
    name: 'Cloud warehouses',
    items: [
      'Athena',
      'BigQuery',
      'Databricks',
      'Dremio',
      'Fabric',
      'Redshift',
      'Snowflake',
    ],
  },
  {
    name: 'Transactional SQL',
    items: [
      'Exasol',
      'MySQL',
      'Oracle',
      'Postgres',
      'SingleStore',
      'SQLite',
      'Teradata',
      'TSQL',
    ],
  },
  {
    name: 'OLAP engines',
    items: [
      'ClickHouse',
      'Doris',
      'Dune',
      'Druid',
      'DuckDB',
      'Materialize',
      'RisingWave',
      'StarRocks',
    ],
  },
  {
    name: 'Query engines',
    items: [
      'Drill',
      'Hive',
      'Presto',
      'Solr',
      'Spark',
      'Spark2',
      'Trino',
    ],
  },
  {
    name: 'Other targets',
    items: [
      'PRQL',
      'Tableau',
    ],
  },
];

const ALL_DIALECTS_TOTAL = DIALECT_GROUPS.reduce((all, group) => all + group.items.length, 0);

const dialectQuery = ref('');

const filteredGroups = computed(() => {
  const query = dialectQuery.value.trim().toLowerCase();

  return DIALECT_GROUPS
    .map((group) => ({
      name: group.name,
      items: query ? group.items.filter((dialect) => dialect.toLowerCase().includes(query)) : group.items,
    }))
    .filter((group) => 0 < group.items.length);
});

const shownCount = computed(() =>
  filteredGroups.value.reduce((all, group) => all + group.items.length, 0));
</script>

<style scoped>
@reference "tailwindcss";

.td-container {
  max-width: 1040px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}

/* Hero */
.td-hero-section {
  padding: 64px 0 56px;
  background: linear-gradient(
    180deg,
    var(--gui-neutral-bg) 0%,
    var(--gui-neutral-bg-subtle) 60%,
    var(--gui-neutral-bg-active) 100%
  );
}

.td-hero-title {
  margin-top: 28px;
  font-size: clamp(2.5rem, 5.5vw, var(--text-3xl));
  font-weight: 600;
  line-height: 1.0;
  letter-spacing: -0.035em;
  max-width: 15ch;
  color: var(--gui-neutral-fg);
  text-wrap: balance;
}

.td-hero-accent {
  color: var(--gui-primary-solid);
}

.td-hero-desc {
  margin-top: 24px;
  max-width: 44ch;
  font-size: 21px;
  line-height: 1.5;
  font-weight: 450;
  color: var(--gui-neutral-solid);
  text-wrap: pretty;
}

.td-hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: 44px;
}

.td-cta-btn {
  display: inline-flex;
  align-items: center;
  height: 52px;
  padding: 0 28px;
  border-radius: var(--radius-lg);
  background: var(--gui-primary-solid);
  color: var(--color-neutral-1);
  font-size: var(--text-md);
  font-weight: 600;
  text-decoration: none;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.18),
    0 8px 24px -8px color-mix(in srgb, var(--gui-primary-solid) 55%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
  transition: background var(--duration-fast) var(--ease-default);
}

.td-cta-btn:hover {
  background: var(--gui-primary-solid-hover);
}

.td-install-box {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 52px;
  padding: 0 8px 0 18px;
  border-radius: var(--radius-lg);
  background: var(--color-neutral-1);
  border: 1px solid var(--gui-neutral-border-subtle);
  box-shadow: var(--shadow-xs);
}

.td-install-text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--gui-neutral-fg);
  white-space: nowrap;
}

.td-install-prompt {
  color: var(--gui-neutral-border-strong);
}

.td-install-copy {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid var(--gui-neutral-border-subtle);
  background: var(--gui-neutral-bg-subtle);
  color: var(--gui-neutral-solid);
  border-radius: var(--radius-md);
  padding: 7px 10px;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
}

.td-install-copy:hover {
  background: var(--gui-neutral-bg-active);
  color: var(--gui-neutral-fg);
}

.td-section-label {
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--gui-primary-solid);
}

/* Code demo */
.td-demo-section {
  padding: 48px 0 56px;
  background: var(--gui-neutral-bg-active);
  border-top: 1px solid var(--gui-neutral-border-subtle);
  border-bottom: 1px solid var(--gui-neutral-border-subtle);
}

.td-demo-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.td-demo-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--gui-neutral-bg-active);
  border-radius: var(--radius-lg);
}

.td-demo-tab {
  border: 0;
  cursor: pointer;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  background: transparent;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gui-neutral-solid);
  transition:
    color var(--duration-fast) var(--ease-default),
    background var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.td-demo-tab:hover {
  color: var(--gui-neutral-fg);
}

.td-demo-tab--active {
  color: var(--gui-neutral-fg);
  font-weight: 600;
  background: var(--gui-neutral-bg);
  box-shadow: var(--shadow-xs);
}

.td-demo-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--color-neutral-1);
  border: 1px solid var(--gui-neutral-border-subtle);
  box-shadow:
    var(--shadow-xs),
    0 24px 48px -20px rgba(0, 0, 0, 0.22);
}

.td-demo-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--gui-neutral-bg-subtle);
  border-bottom: 1px solid var(--gui-neutral-border-subtle);
}

.td-demo-bar--returns {
  border-top: 1px solid var(--gui-neutral-border-subtle);
}

.td-demo-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.td-demo-dot--primary { background: var(--gui-primary-solid); }
.td-demo-dot--success { background: var(--gui-success-solid); }

.td-demo-bar-label {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--gui-primary-solid-hover);
}

.td-demo-bar-label--success {
  color: var(--gui-success-fg-muted);
}

.td-demo-copy {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid var(--gui-neutral-border-subtle);
  background: var(--gui-neutral-bg);
  color: var(--gui-neutral-solid);
  border-radius: var(--radius-md);
  padding: 4px 8px;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
}

.td-demo-copy:hover {
  background: var(--gui-neutral-bg-active);
  color: var(--gui-neutral-fg);
}

.td-code-placeholder {
  min-height: 180px;
  background: var(--color-neutral-1);
}

.td-code-placeholder--short {
  min-height: 100px;
}

.td-demo-caption {
  padding: 16px 20px;
  background: var(--gui-neutral-bg-subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--gui-neutral-solid);
}

/* Dialects */
.td-dialects-section {
  padding: 48px 0 56px;
  background: var(--gui-neutral-bg);
}

.td-dialects-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.td-dialects-subtitle {
  margin: 8px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--gui-neutral-solid);
}

.td-filter-input {
  width: 240px;
  height: 40px;
  padding: 0 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gui-neutral-border-subtle);
  background: var(--color-neutral-1);
  font-size: var(--text-sm);
  color: var(--gui-neutral-fg);
  outline: none;
  transition:
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.td-filter-input:focus {
  border-color: var(--gui-primary-solid);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--gui-primary-solid) 12%, transparent);
}

.td-dialect-groups {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.td-dialect-group {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  padding: 16px 0;
  border-top: 1px solid var(--gui-neutral-border-subtle);
}

@media (max-width: 640px) {
  .td-dialect-group {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.td-dialect-group-name {
  margin: 0 0 4px;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.td-dialect-group-count {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--gui-neutral-solid);
}

.td-dialect-group-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.td-dialect-chip {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--gui-neutral-fg);
  background: var(--gui-neutral-bg-active);
  border: 1px solid var(--gui-neutral-border-subtle);
  border-radius: var(--radius-md);
  padding: 5px 9px;
  transition:
    background var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default);
}

.td-dialect-chip:hover {
  background: var(--color-neutral-1);
  border-color: var(--gui-neutral-border-strong);
}

/* Cards */
.td-cards-section {
  padding: 48px 0;
  background: var(--gui-neutral-bg-subtle);
  border-top: 1px solid var(--gui-neutral-border-subtle);
}

.td-cards-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .td-cards-grid {
    grid-template-columns: 1fr;
  }
}

.td-card {
  display: block;
  padding: 34px 36px;
  border-radius: var(--radius-2xl);
  text-decoration: none;
  transition:
    background var(--duration-normal) var(--ease-default),
    border-color var(--duration-normal) var(--ease-default);
}

.td-card--dark {
  background: var(--color-neutral-12);
  color: var(--gui-neutral-bg-subtle);
  box-shadow:
    var(--shadow-xs),
    0 28px 56px -24px rgba(0, 0, 0, 0.45);
}

.td-card--dark:hover {
  background: var(--color-neutral-12);
}

.td-card--light {
  background: var(--color-neutral-1);
  border: 1px solid var(--gui-neutral-border-subtle);
  box-shadow: var(--shadow-xs);
}

.td-card--light:hover {
  border-color: var(--gui-neutral-border-strong);
}

.td-card-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 22px;
}

.td-card-eyebrow--dark { color: var(--color-primary-8); }
.td-card-eyebrow--light { color: var(--gui-neutral-solid); }

.td-card-title {
  margin: 0 0 14px;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--gui-neutral-fg);
}

.td-card-title--dark {
  font-size: 30px;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: var(--color-neutral-1);
}

.td-card-desc {
  margin: 0 0 26px;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--gui-neutral-solid);
  max-width: 40ch;
}

.td-card-desc--dark {
  color: var(--gui-neutral-border-strong);
}

.td-card-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gui-primary-solid);
}

.td-card-action--dark {
  color: var(--color-primary-8);
}

/* Why */
.td-why-section {
  padding: 48px 0 56px;
  background: var(--gui-neutral-bg);
  border-top: 1px solid var(--gui-neutral-border-subtle);
}

.td-why-grid {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 28px;
}

@media (max-width: 768px) {
  .td-why-grid {
    grid-template-columns: 1fr;
  }
}

.td-prose {
  max-width: 64ch;
}

.td-prose-lead {
  margin: 0 0 22px;
  font-size: 19px;
  line-height: 1.65;
  color: var(--gui-neutral-fg);
  font-weight: 450;
}

.td-prose-list {
  margin: 0 0 26px;
  padding: 0 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: var(--text-md);
  line-height: 1.6;
  color: var(--gui-neutral-solid);
}

.td-prose-list code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background: var(--gui-neutral-bg-active);
  padding: 1px 5px;
  border-radius: var(--radius-sm);
}

.td-prose-body {
  margin: 0 0 20px;
  font-size: var(--text-md);
  line-height: 1.7;
  color: var(--gui-neutral-solid);
}

.td-link {
  color: var(--gui-primary-solid);
  text-decoration: none;
}

.td-link:hover {
  color: var(--gui-primary-solid-hover);
  text-decoration: underline;
}

/* Footer */
.td-footer {
  padding: 28px 0;
  background: var(--color-neutral-12);
}

.td-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  font-size: var(--text-sm);
  color: var(--gui-neutral-border-strong);
}

.td-footer-link {
  color: var(--color-primary-8);
  text-decoration: none;
}

.td-footer-link:hover {
  text-decoration: underline;
}
</style>
