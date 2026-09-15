<template>
  <MainLayout>
    <main class="mx-auto max-w-[1080px] px-7">
      <!-- Hero -->
      <div class="mt-8 items-start">
        <div>
          <div class="mt-6 flex flex-wrap items-center gap-2">
            <GBadge
              label="npm"
              :value="`v${SQLINGO_VERSION}`"
              :color="GPillColor.Blue"
              :size="GBadgeSize.Lg"
              href="https://www.npmjs.com/package/@hdnax/sqlingo.js"
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
            A TypeScript port of <span class="td-hero-accent">SQLGlot</span>.
          </h1>
          <p class="td-hero-desc">
            Parse, transpile, and optimize SQL across 32 dialects, in the
            browser or in Node.js.
          </p>
        </div>

        <div class="mt-4 flex max-w-[33em] flex-wrap items-center gap-3">
          <div class="td-install-box">
            <span class="td-install-text">
              <span class="td-install-prompt">$</span> npm install
              @hdnax/sqlingo.js
            </span>
            <div class="flex-1" />
            <button
              type="button"
              class="td-install-copy"
              @click="copyInstall"
            >
              {{ installCopied ? "copied" : "copy" }}
            </button>
          </div>
          <a
            href="/sqlingo.js/playground/"
            class="td-cta-btn"
          >
            Try the playground
          </a>
        </div>
      </div>

      <!-- Code demo -->
      <GTab
        class="gui-primary-border-subtle mt-8 overflow-hidden rounded-[14px] border bg-white shadow-xs md:mt-14"
      >
        <GTabPanel
          v-for="(demo, name) in demos"
          :key="name"
          :name="name.toUpperCase()"
        >
          <div
            class="gui-primary-fg text-2xs mt-6 px-5 pb-2 font-mono font-semibold tracking-widest uppercase"
          >
            Example
          </div>
          <GCodeBlock
            :id="`demo-${name}`"
            :code="demo.code"
            :language="GCodeLanguage.Typescript"
            :highlight-theme="GHighlightTheme.AtomOne"
            show-line-numbers
            hide-header
            class="border-none bg-white py-2"
          />
          <div class="border-t border-(--color-primary-3)">
            <div
              class="gui-primary-bg-subtle gui-primary-fg text-2xs px-5 pt-4 pb-2 font-mono font-semibold tracking-widest uppercase"
            >
              Returns
            </div>
            <GCodeBlock
              :id="`demo-result-${name}`"
              :code="demo.result"
              :language="GCodeLanguage.Typescript"
              :highlight-theme="GHighlightTheme.AtomOne"
              show-line-numbers
              hide-header
              class="border-none bg-white py-2"
            />
            <p
              class="gui-neutral-fg-muted gui-primary-bg-subtle mt-4 px-5 pb-4 text-sm/relaxed"
            >
              {{ demo.note }}
            </p>
          </div>
        </GTabPanel>
      </GTab>

      <!-- Dialects -->
      <div class="mt-8 flex flex-wrap items-baseline gap-4">
        <h2 class="td-section-title">
          Supported dialects
        </h2>
        <span class="td-dialect-count">{{ filteredDialects.length }} of 32</span>
        <div class="flex-1" />
        <input
          v-model="dialectQuery"
          placeholder="Filter dialects..."
          class="td-filter-input"
        >
      </div>
      <div class="td-dialect-grid">
        <div
          v-for="d in filteredDialects"
          :key="d"
          class="td-dialect-chip"
        >
          {{ d }}
        </div>
      </div>

      <!-- Cards -->
      <div class="mt-8 grid gap-4 lg:grid-cols-2">
        <a
          href="./api-reference/"
          class="td-card"
        >
          <div class="td-card-eyebrow">API reference</div>
          <div class="td-card-title">Every class and function, typed</div>
          <div class="td-card-desc">
            Full TypeScript types generated from source, with examples for each
            expression node.
          </div>
          <div class="td-card-action">Browse the docs</div>
        </a>
        <a
          href="/sqlingo.js/playground/"
          class="td-card"
        >
          <div class="td-card-eyebrow">Playground</div>
          <div class="td-card-title">Transpile SQL in the browser</div>
          <div class="td-card-desc">
            Paste a query, pick two dialects, and watch it convert. Also does
            SQL to DBML.
          </div>
          <div class="td-card-action">Open the playground</div>
        </a>
      </div>

      <!-- Why this exists -->
      <div class="mt-8">
        <div class="td-card-eyebrow">Why this exists</div>
        <div class="td-prose">
          <p class="m-0">
            I maintain
            <a
              href="https://github.com/holistics/dbml"
              target="_blank"
              rel="noopener noreferrer"
              class="td-link"
            >@dbml/core</a>
            at work, a library that converts between DBML and SQL. Under the
            hood it uses ANTLR, and honestly it has been a mess:
          </p>
          <ul class="mt-4 ml-5 list-disc leading-loose">
            <li><code>@dbml/core</code> is 33MB, which is quite insane to be honest. It actually broke our CI with OOM errors.</li>
            <li>We can't add more dialects without making the bundle even larger.</li>
            <li>The parser is feature-incomplete and spits out user-unfriendly error messages like <code>No viable alternative at....</code></li>
            <li>After all that, we only support 5 dialects.</li>
          </ul>

          <p class="mt-4 leading-loose">
            At a hackathon I stumbled on
            <a
              href="https://github.com/tobymao/sqlglot"
              target="_blank"
              rel="noopener noreferrer"
              class="td-link"
            >SQLGlot</a>. It was amazing that a library like this existed. Too bad it was
            in Python. I tried Pyodide as a hack, but the runtime is too heavy
            to ship anywhere that matters.
          </p>
          <p class="mt-4 leading-loose">
            So I started porting it to JavaScript. Two weeks in,
            <a
              href="https://github.com/tobilg/polyglot"
              target="_blank"
              rel="noopener noreferrer"
              class="td-link"
            >polyglot</a>
            was announced (LoL, if only it were sooner). I kept going anyway: I
            wanted full control over the implementation and a way to stay in
            sync with upstream.
          </p>
          <p class="mt-4 leading-loose">
            sqlingo.js is a close mirror of SQLGlot, file for file. That's the
            whole trick: catching up with upstream is a diff, not a rewrite.
          </p>
        </div>
      </div>

      <div class="h-8" />

      <component
        :is="scriptTag"
        type="application/ld+json"
      >
        {{ JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "sqlingo.js",
          "description": "sqlingo.js is a JavaScript/TypeScript port of SQLGlot, a SQL parser, transpiler, and optimizer supporting 32 dialects.",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All",
          "license": "https://opensource.org/licenses/MIT",
          "softwareVersion": SQLINGO_VERSION,
          "url": "https://huydo862003.github.io/sqlingo.js/",
          "author": {
            "@type": "Person",
            "name": "Huy Do",
          },
        }) }}
      </component>
    </main>
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
  GTab,
  GTabPanel,
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
  title: 'Home | sqlingo.js',
  ogTitle: 'Home | sqlingo.js',
  description:
    'sqlingo.js is the JavaScript/TypeScript port of SQLGlot. It is a SQL parser, transpiler, and optimizer supporting 32 dialects including BigQuery, Snowflake, and Postgres.',
  ogDescription:
    'sqlingo.js is the JavaScript/TypeScript port of SQLGlot. It is a SQL parser, transpiler, and optimizer supporting 32 dialects including BigQuery, Snowflake, and Postgres.',
});

const installCopied = ref(false);

function copyInstall () {
  navigator.clipboard?.writeText('npm install @hdnax/sqlingo.js');
  installCopied.value = true;
  setTimeout(() => {
    installCopied.value = false;
  }, 1400);
}

const demos: Record<
  string,
  {
    code: string;
    result: string;
    note: string;
  }
> = {
  parse: {
    code: `import { parse } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";

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
    code: `import { transpile } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

const [sql] = transpile(
  "SELECT DATE_SUB(d, INTERVAL 1 DAY) FROM t",
  { read: MySQL, write: Postgres },
);`,
    result: 'SELECT d - INTERVAL \'1 DAY\' FROM t',
    note: 'Dialect quirks (quoting, date math, casts) are rewritten for the target.',
  },
  optimize: {
    code: `import { optimize } from "@hdnax/sqlingo.js";

const sql = optimize(
  "SELECT * FROM t WHERE 1 = 1 AND x > 2",
  { schema: { t: { x: "INT" } } },
);`,
    result: 'SELECT t.x AS x FROM t AS t WHERE t.x > 2',
    note: 'Qualifies columns, expands stars, and folds constant predicates.',
  },
};

const ALL_DIALECTS = [
  'Athena',
  'BigQuery',
  'ClickHouse',
  'Databricks',
  'Doris',
  'Dremio',
  'Drill',
  'Druid',
  'DuckDB',
  'Dune',
  'Exasol',
  'Fabric',
  'Hive',
  'Materialize',
  'MySQL',
  'Oracle',
  'Postgres',
  'Presto',
  'PRQL',
  'Redshift',
  'RisingWave',
  'SingleStore',
  'Snowflake',
  'Solr',
  'Spark',
  'Spark2',
  'SQLite',
  'StarRocks',
  'Tableau',
  'Teradata',
  'Trino',
  'TSQL',
];

const dialectQuery = ref('');
const filteredDialects = computed(() => {
  const query = dialectQuery.value.trim().toLowerCase();

  if (!query) return ALL_DIALECTS;

  return ALL_DIALECTS.filter((dialect) =>
    dialect.toLowerCase().includes(query));
});
</script>

<style scoped>
@reference "tailwindcss";

/* Hero */
.td-hero-title {
  margin-top: 24px;
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: var(--leading-tight);
  letter-spacing: -0.028em;
  font-variation-settings: "opsz" 28;
  color: var(--gui-neutral-fg);
  text-wrap: balance;
}

.td-hero-accent {
  color: var(--gui-primary-solid);
}

.td-hero-desc {
  margin-top: 16px;
  max-width: 33em;
  font-size: var(--text-md);
  line-height: var(--leading-relaxed);
  color: var(--gui-neutral-solid);
  text-wrap: pretty;
}

/* Install box */
.td-install-box {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  border: 1px solid var(--gui-neutral-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--gui-neutral-bg);
}

.td-install-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--gui-neutral-fg);
}

.td-install-prompt {
  color: var(--gui-neutral-border-strong);
}

.td-install-copy {
  flex-shrink: 0;
  padding: 4px 12px;
  border: 1px solid var(--gui-neutral-border-subtle);
  border-radius: var(--radius-md);
  background: var(--gui-neutral-bg-subtle);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 500;
  color: var(--gui-primary-solid);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default);
}

.td-install-copy:hover {
  background: var(--gui-neutral-bg-hover);
  border-color: var(--gui-neutral-border-strong);
}

.td-install-copy:active {
  transform: scale(0.985);
}

/* CTA button */
.td-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 20px;
  border-radius: var(--radius-lg);
  background: var(--gui-primary-solid);
  color: white;
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-default);
}

.td-cta-btn:hover {
  background: var(--gui-primary-solid-hover);
}

.td-cta-btn:active {
  transform: scale(0.985);
}

/* Section title */
.td-section-title {
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: var(--leading-heading);
  letter-spacing: -0.024em;
  font-variation-settings: "opsz" 28;
  color: var(--gui-neutral-fg);
}

/* Dialect grid */
.td-dialect-count {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--gui-neutral-border-strong);
}

.td-filter-input {
  width: 224px;
  padding: 10px 14px;
  border: 1px solid var(--gui-neutral-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--gui-neutral-bg);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--gui-neutral-fg);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-default);
}

.td-filter-input:focus {
  border-color: var(--gui-primary-solid);
}

.td-dialect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  margin-top: 24px;
}

.td-dialect-chip {
  padding: 10px 12px;
  border: 1px solid var(--gui-neutral-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--gui-neutral-bg);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--gui-neutral-fg);
}

/* Cards */
.td-card {
  display: block;
  padding: 28px;
  border: 1px solid var(--gui-neutral-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--gui-neutral-bg);
  text-decoration: none;
  color: var(--gui-neutral-fg);
  transition:
    border-color var(--duration-normal) var(--ease-default),
    background var(--duration-normal) var(--ease-default),
    transform var(--duration-normal) var(--ease-default);
}

.td-card:hover {
  border-color: var(--gui-primary-solid);
  background: var(--gui-primary-bg-active);
  transform: translateY(-1px);
}

.td-card-eyebrow {
  font-size: var(--text-2xs);
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--gui-primary-solid);
}

.td-card-title {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.024em;
  color: var(--gui-neutral-fg);
}

.td-card-desc {
  margin-top: 8px;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--gui-neutral-solid);
}

.td-card-action {
  margin-top: 16px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--gui-primary-solid);
}

/* Prose */
.td-prose {
  margin-top: 24px;
  max-width: 34em;
  color: var(--gui-neutral-solid-hover);
  font-size: var(--text-md);
  line-height: var(--leading-relaxed);
}

.td-link {
  color: var(--gui-info-fg-muted);
  text-decoration: none;
}

.td-link:hover {
  color: var(--gui-info-fg);
  text-decoration: underline;
}
</style>
