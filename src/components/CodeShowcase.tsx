import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CodeSample } from '../data/projects';

type Props = {
  samples: CodeSample[];
};

const KEYWORDS = new Set([
  'any',
  'case',
  'const',
  'enum',
  'for',
  'func',
  'get',
  'if',
  'impl',
  'import',
  'interface',
  'let',
  'match',
  'readonly',
  'struct',
  'var',
]);

const BUILTIN_TYPES = new Set(['int32', 'string', 'usize', 'Self']);

export async function copyCodeSample(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const execCommand = (document as unknown as { execCommand?: (commandId: string) => boolean })['execCommand'];
  const copied = execCommand?.call(document, 'copy') ?? false;
  textarea.remove();

  if (!copied && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function highlightCodeSegment(segment: string) {
  const escaped = escapeHtml(segment);

  return escaped.replace(
    /\b([A-Za-z_][A-Za-z0-9_]*)\b(?=\()|\b([A-Z][A-Za-z0-9_]*)\b|\b(int32|string|usize|Self)\b|\b([0-9]+)\b|\b([A-Za-z_][A-Za-z0-9_]*)\b/g,
    (token, fnName: string, upperType: string, builtinType: string, number: string, word: string) => {
      if (fnName) return `<span class="fn">${token}</span>`;
      if (upperType || builtinType || BUILTIN_TYPES.has(token)) return `<span class="type">${token}</span>`;
      if (number) return `<span class="num">${token}</span>`;
      if (word && KEYWORDS.has(word)) return `<span class="kw">${token}</span>`;
      return token;
    },
  );
}

function highlightInline(line: string) {
  const parts = line.split(/("(?:\\.|[^"\\])*")/g);

  return parts
    .map((part, index) => {
      if (index % 2 === 1) return `<span class="str">${escapeHtml(part)}</span>`;
      return highlightCodeSegment(part);
    })
    .join('');
}

function highlightTaro(code: string) {
  return code
    .split('\n')
    .map((line) => {
      const commentIndex = line.indexOf('//');
      if (commentIndex === -1) return highlightInline(line);

      const codePart = line.slice(0, commentIndex);
      const commentPart = line.slice(commentIndex);
      return `${highlightInline(codePart)}<span class="com">${escapeHtml(commentPart)}</span>`;
    })
    .join('\n');
}

export default function CodeShowcase({ samples }: Props) {
  const highlightedSamples = useMemo(
    () =>
      samples.map((sample) => ({
        ...sample,
        highlighted: highlightTaro(sample.code),
      })),
    [samples],
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <div className="code-stage">
      <div className="cs-head">
        <div className="cs-label">◇ Language Tour</div>
      </div>

      <div className="cs-quad">
        {highlightedSamples.map((sample) => {
          const copied = copiedId === sample.id;

          return (
            <div className="codeblock cs-card" data-file={sample.filename} key={sample.id}>
              <div className="cs-cap">
                <span>{sample.label}</span>
                <button
                  className={copied ? 'cs-copy copied' : 'cs-copy'}
                  type="button"
                  aria-label={`Copy ${sample.filename}`}
                  onClick={async () => {
                    await copyCodeSample(sample.code);
                    setCopiedId(sample.id);
                    window.setTimeout(() => setCopiedId(null), 1200);
                  }}
                >
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  <span className="copied-label">{copied ? '✓' : ''}</span>
                </button>
              </div>
              <pre className="code-lines" dangerouslySetInnerHTML={{ __html: sample.highlighted }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
