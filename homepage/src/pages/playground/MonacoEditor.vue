<template>
  <div class="td-editor-container">
    <div
      ref="editorElement"
      class="td-editor"
    />
  </div>
</template>

<script setup lang="ts">
import {
  onMounted, onBeforeUnmount, watch, useTemplateRef, shallowRef,
} from 'vue';
import {
  useTheme, GTheme,
} from '@hdnax/genuix';

const content = defineModel<string | undefined>({
  default: undefined,
});

const {
  language = 'sql', readOnly = false,
} = defineProps<{
  /** Language mode for syntax highlighting */
  language?: string;
  /** Whether the editor is read-only */
  readOnly?: boolean;
}>();

const themeStore = useTheme();
const editorElement = useTemplateRef('editorElement');

// Lazy-loaded Monaco reference — avoids importing .css at SSR time
const monacoRef = shallowRef<typeof import('monaco-editor') | null>(null);
let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = null;

function getMonacoTheme (): string {
  return themeStore.effectiveTheme === GTheme.Dark ? 'sqlingo-dark' : 'sqlingo-light';
}

function defineThemes (monaco: typeof import('monaco-editor')): void {
  const style = getComputedStyle(document.documentElement);
  const resolve = (token: string): string => style.getPropertyValue(token).trim();

  monaco.editor.defineTheme('sqlingo-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': resolve('--color-neutral-1'),
      'editor.lineHighlightBackground': resolve('--color-primary-2'),
      'editorLineNumber.foreground': resolve('--color-primary-7'),
      'editorLineNumber.activeForeground': resolve('--color-primary-9'),
      'editorGutter.background': resolve('--color-neutral-1'),
      'editor.lineHighlightBorder': '#00000000',
    },
  });

  monaco.editor.defineTheme('sqlingo-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': resolve('--color-neutral-1'),
      'editor.lineHighlightBackground': resolve('--color-primary-2'),
      'editorLineNumber.foreground': resolve('--color-primary-7'),
      'editorLineNumber.activeForeground': resolve('--color-primary-9'),
      'editorGutter.background': resolve('--color-neutral-1'),
      'editor.lineHighlightBorder': '#00000000',
    },
  });
}

onMounted(async () => {
  if (!editorElement.value) return;

  const [monaco, { dbmlMonarchTokensProvider }] = await Promise.all([
    import('monaco-editor'),
    import('@dbml/parse'),
  ]);

  const { default: EditorWorker } = await import('monaco-editor/editor/editor.worker?worker');

  self.MonacoEnvironment = {
    getWorker: () => new EditorWorker(),
  };

  monaco.languages.register({ id: 'dbml' });
  monaco.languages.setMonarchTokensProvider(
    'dbml',
    dbmlMonarchTokensProvider as import('monaco-editor').languages.IMonarchLanguage,
  );

  monacoRef.value = monaco;
  defineThemes(monaco);

  editor = monaco.editor.create(editorElement.value, {
    value: content.value,
    language,
    theme: getMonacoTheme(),
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    readOnly,
    fontSize: 14,
    fontFamily: 'var(--font-mono)',
    lineNumbers: 'on',
    folding: false,
    guides: { indentation: false },
    overviewRulerLanes: 0,
    lineDecorationsWidth: 8,
    lineNumbersMinChars: 3,
    padding: { top: 12, bottom: 12 },
    automaticLayout: true,
    fixedOverflowWidgets: true,
    scrollbar: {
      verticalScrollbarSize: 4,
      horizontalScrollbarSize: 4,
      alwaysConsumeMouseWheel: false,
    },
    renderLineHighlight: 'none',
  });

  editor.onDidChangeModelContent(() => {
    content.value = editor?.getValue();
  });
});

watch(content, (newValue) => {
  if (editor && editor.getValue() !== newValue) editor.setValue(newValue ?? '');
});

watch(
  () => language,
  (newLanguage) => {
    const model = editor?.getModel();
    const monaco = monacoRef.value;

    if (model && monaco) monaco.editor.setModelLanguage(model, newLanguage);
  },
);

watch(
  () => themeStore.effectiveTheme,
  () => {
    const monaco = monacoRef.value;

    if (!editor || !monaco) return;
    defineThemes(monaco);
    monaco.editor.setTheme(getMonacoTheme());
  },
);

onBeforeUnmount(() => {
  editor?.dispose();
});
</script>

<style scoped>
.td-editor-container {
  width: 100%;
  height: 448px;
  background: var(--color-neutral-1);
  contain: strict;
}

.td-editor {
  width: 100%;
  height: 100%;
}
</style>
