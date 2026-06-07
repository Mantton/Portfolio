import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { RegionLanguage } from '../data/site';

type Props = {
  languages: RegionLanguage[];
};

type SlotMeasure = {
  heights: number[];
  offsets: number[];
  maxHeight: number;
};

const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const PIXEL_SCALE = 3;
const PIXEL_SCALE_MOBILE = 2;
const MOBILE_BREAKPOINT = 640;
const TORONTO_TIME_ZONE = 'America/Toronto';
const TORONTO_OFFSET = -5;
const OFFSET_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function isMobileViewport() {
  return typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;
}

// Narrow viewports render far fewer dither cells, so the landmark turns blocky.
// Use a smaller scale on mobile to keep a comparable cell density.
function getPixelScale() {
  return isMobileViewport() ? PIXEL_SCALE_MOBILE : PIXEL_SCALE;
}

// Two-phase text swap (intro + name lines): animate the old text out, swap, then
// animate the new text in — mirrors the prototype's slideLeft/fadeSwap so the
// three hero lines feel coherent with the "Hello" slot's 0.55s slide.
const TEXT_OUT_MS = 290;
const TEXT_IN_MS = 340;

// How long each region stays before advancing. Latin lingers a little longer.
const STEP_MS = 4250;
const LATIN_STEP_MS = 6250;

type TextPhase = 'idle' | 'out' | 'in';
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function stepDurationFor(language: RegionLanguage) {
  return language.key === 'la' ? LATIN_STEP_MS : STEP_MS;
}

function getOffsetFormatter(timeZone: string) {
  let formatter = OFFSET_FORMATTERS.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      timeZone,
      timeZoneName: 'shortOffset',
    });
    OFFSET_FORMATTERS.set(timeZone, formatter);
  }

  return formatter;
}

export function getTimeZoneOffsetMinutes(timeZone: string, date = new Date()) {
  try {
    const offsetName = getOffsetFormatter(timeZone)
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value;
    const match = /^(?:GMT|UTC)(?:(?<sign>[+-])(?<hours>\d{1,2})(?::(?<minutes>\d{2}))?)?$/.exec(offsetName ?? '');
    if (!match) return null;

    const sign = match.groups?.sign === '-' ? -1 : 1;
    const hours = Number(match.groups?.hours ?? 0);
    const minutes = Number(match.groups?.minutes ?? 0);
    return sign * (hours * 60 + minutes);
  } catch {
    return null;
  }
}

export function formatDelta(language: Pick<RegionLanguage, 'offset' | 'timeZone'>, date = new Date()) {
  const localOffset = getTimeZoneOffsetMinutes(language.timeZone, date) ?? language.offset * 60;
  const torontoOffset = getTimeZoneOffsetMinutes(TORONTO_TIME_ZONE, date) ?? TORONTO_OFFSET * 60;
  const deltaMinutes = localOffset - torontoOffset;
  if (deltaMinutes === 0) return 'Toronto time';

  const sign = deltaMinutes > 0 ? '+' : '−';
  const absoluteMinutes = Math.abs(deltaMinutes);
  const hours = Math.trunc(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  const label = minutes === 0 ? String(hours) : `${hours}:${String(minutes).padStart(2, '0')}`;
  return `${sign}${label}h vs Toronto`;
}

export function loadRegionImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

export function drawDitheredImage(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const width = canvas.width;
  const height = canvas.height;
  const context = canvas.getContext('2d');
  if (!context || width < 2 || height < 2) return false;

  context.imageSmoothingEnabled = false;

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;

  if (imageRatio > canvasRatio) {
    sw = image.naturalHeight * canvasRatio;
    sx = (image.naturalWidth - sw) / 2;
  } else {
    sh = image.naturalWidth / canvasRatio;
    sy = (image.naturalHeight - sh) / 2;
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      let lum = (0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2]) / 255;
      lum = Math.max(0, Math.min(1, (lum - 0.08) / 0.84));
      lum = Math.pow(lum, 1.7) * 0.78;

      const threshold = (BAYER[y & 7][x & 7] + 0.5) / 64;
      if (lum > threshold) {
        pixels[index] = 212;
        pixels[index + 1] = 175;
        pixels[index + 2] = 55;
        pixels[index + 3] = 255;
      } else {
        pixels[index] = 0;
        pixels[index + 1] = 0;
        pixels[index + 2] = 0;
        pixels[index + 3] = 0;
      }
    }
  }

  context.putImageData(imageData, 0, 0);
  return true;
}

export function measureSlot(slot: HTMLSpanElement, track: HTMLSpanElement, index: number): SlotMeasure {
  const items = Array.from(track.children) as HTMLElement[];
  const heights = items.map((item) => item.getBoundingClientRect().height);
  const offsets = [0];

  for (let i = 0; i < heights.length - 1; i += 1) {
    offsets.push(offsets[i] + heights[i]);
  }

  const maxHeight = Math.max(...heights, 0);
  slot.style.height = `${maxHeight}px`;

  const currentOffset = offsets[index] ?? 0;
  const currentHeight = heights[index] ?? maxHeight;
  const y = -(currentOffset + currentHeight / 2) + maxHeight / 2;
  track.style.transform = `translateY(${y}px)`;

  return { heights, offsets, maxHeight };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function sizeCanvas(canvas: HTMLCanvasElement, host: HTMLElement) {
  const rect = host.getBoundingClientRect();
  const scale = getPixelScale();
  const width = Math.max(2, Math.round(rect.width / scale));
  const height = Math.max(2, Math.round(rect.height / scale));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

export function advanceLanguage(index: number, total: number) {
  if (total <= 1) return 0;
  return (index + 1) % total;
}

export default function HeroRegion({ languages }: Props) {
  const sequence = useMemo(() => [languages[languages.length - 1], ...languages, languages[0]], [languages]);
  const [languageIndex, setLanguageIndex] = useState(0);
  const [shownIndex, setShownIndex] = useState(0);
  const [textPhase, setTextPhase] = useState<TextPhase>('idle');
  const [slotIndex, setSlotIndex] = useState(1);
  const [animateSlot, setAnimateSlot] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [slotReady, setSlotReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const mountedRef = useRef(false);

  const slotRef = useRef<HTMLSpanElement | null>(null);
  const trackRef = useRef<HTMLSpanElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const canvasARef = useRef<HTMLCanvasElement | null>(null);
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);
  const activeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cacheRef = useRef(new Map<string, HTMLImageElement | null>());
  const language = languages[languageIndex] ?? languages[0];
  const shown = languages[shownIndex] ?? languages[0];
  const activeImageSrc = isMobile ? language.imageSrcMobile : language.imageSrc;
  const activeCredit = isMobile ? language.creditMobile : language.credit;

  useBrowserLayoutEffect(() => {
    setSlotReady(true);
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(isMobileViewport());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const applySlotMeasurement = useCallback(() => {
    if (!slotRef.current || !trackRef.current) return;
    measureSlot(slotRef.current, trackRef.current, slotIndex);
  }, [slotIndex]);

  useBrowserLayoutEffect(() => {
    if (!slotReady) return undefined;

    applySlotMeasurement();

    if (document.fonts?.ready) {
      document.fonts.ready.then(applySlotMeasurement);
    }

    let resizeTimer = window.setTimeout(() => undefined, 0);
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applySlotMeasurement, 150);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [applySlotMeasurement, slotReady]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const current = languages[languageIndex] ?? languages[0];
    const timer = window.setTimeout(() => {
      const next = advanceLanguage(languageIndex, languages.length);
      setAnimateSlot(true);

      if (next === 0) {
        setSlotIndex(languages.length + 1);
        window.setTimeout(() => {
          setAnimateSlot(false);
          setSlotIndex(1);
        }, 620);
      } else {
        setSlotIndex(next + 1);
      }

      setLanguageIndex(next);
    }, stepDurationFor(current));

    return () => window.clearTimeout(timer);
  }, [languageIndex, languages, reducedMotion]);

  // Drive the intro/name lines: out → swap text → in, on each language change.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return undefined;
    }

    if (reducedMotion) {
      setShownIndex(languageIndex);
      setTextPhase('idle');
      return undefined;
    }

    setTextPhase('out');
    const swap = window.setTimeout(() => {
      setShownIndex(languageIndex);
      setTextPhase('in');
    }, TEXT_OUT_MS);
    const settle = window.setTimeout(() => setTextPhase('idle'), TEXT_OUT_MS + TEXT_IN_MS);

    return () => {
      window.clearTimeout(swap);
      window.clearTimeout(settle);
    };
  }, [languageIndex, reducedMotion]);

  useEffect(() => {
    const hero = heroRef.current;
    const canvasA = canvasARef.current;
    const canvasB = canvasBRef.current;
    if (!hero || !canvasA || !canvasB || !language) return undefined;

    let cancelled = false;
    const heroElement = hero;
    const canvasAElement = canvasA;
    const canvasBElement = canvasB;
    const canvases = [canvasAElement, canvasBElement];
    canvases.forEach((canvas) => sizeCanvas(canvas, heroElement));

    async function renderRegion() {
      let image = cacheRef.current.get(activeImageSrc);
      if (!cacheRef.current.has(activeImageSrc)) {
        image = await loadRegionImage(activeImageSrc);
        cacheRef.current.set(activeImageSrc, image);
      }

      if (cancelled || !image) return;

      const target: HTMLCanvasElement = activeCanvasRef.current === canvasAElement ? canvasBElement : canvasAElement;
      sizeCanvas(target, heroElement);

      if (!drawDitheredImage(target, image)) return;

      target.classList.add('active');
      activeCanvasRef.current?.classList.remove('active');
      activeCanvasRef.current = target;
    }

    renderRegion();

    return () => {
      cancelled = true;
    };
  }, [activeImageSrc]);

  useEffect(() => {
    const hero = heroRef.current;
    const canvasA = canvasARef.current;
    const canvasB = canvasBRef.current;
    if (!hero || !canvasA || !canvasB) return undefined;

    let resizeTimer = window.setTimeout(() => undefined, 0);
    const redraw = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        [canvasA, canvasB].forEach((canvas) => sizeCanvas(canvas, hero));

        if (activeCanvasRef.current) {
          const image = cacheRef.current.get(activeImageSrc);
          if (image) drawDitheredImage(activeCanvasRef.current, image);
        }
      }, 120);
    };

    window.addEventListener('resize', redraw);
    const observer = new ResizeObserver(redraw);
    observer.observe(hero);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', redraw);
      observer.disconnect();
    };
  }, [activeImageSrc]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="region-card" ref={heroRef}>
        <canvas className="region-canvas" ref={canvasARef}></canvas>
        <canvas className="region-canvas" ref={canvasBRef}></canvas>
      </div>
      <div className="hero-overlay" aria-hidden="true"></div>
      <div className="region-stamp">
        <div className="rs-row">
          <span className="rs-city">{language.city}</span>
          <span className="rs-sep">/</span>
          <span className="rs-delta">{formatDelta(language)}</span>
        </div>
        <a className="rs-credit" href={activeCredit.href} target="_blank" rel="noopener">
          Photo · {activeCredit.author} · {activeCredit.license}
        </a>
      </div>

      <div className="slot-col">
        <div className="hero-meta">
          <div className="row">
            <span>◇ 001</span>
            <span>Toronto, Canada</span>
          </div>
        </div>

        <h1 id="hero-title">
          <span className="h-row">
            <span className="slot" ref={slotRef} aria-label={language.greeting}>
              {slotReady ? (
                <span
                  className="slot-track"
                  ref={trackRef}
                  style={{
                    transition: animateSlot && !reducedMotion ? undefined : 'transform 0s',
                  }}
                >
                  {sequence.map((item, index) => (
                    <span lang={item.key} key={`${item.key}-${index}`}>
                      {item.greeting}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="slot-static" lang={language.key}>
                  {language.greeting}
                </span>
              )}
            </span>
          </span>
          <span className="h-row">
            <span className={`slot-text stroke intro-line phase-${textPhase}`} lang={shown.key}>
              {shown.intro}
            </span>
          </span>
          <span className="h-row">
            <span className={`slot-text gold name-line phase-${textPhase}`} lang={shown.key}>
              {shown.name}
            </span>
          </span>
        </h1>
      </div>

      <aside className="hero-side">
        <div className="hero-cta">
          <a className="btn solid" href="#projects">
            Browse Projects <span className="arrow">↗</span>
          </a>
        </div>
      </aside>
    </section>
  );
}
