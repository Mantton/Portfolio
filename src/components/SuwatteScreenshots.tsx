import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { suwatteScreenshots } from '../data/projects';
import type { ScreenshotSource } from '../data/projects';

const SCREENSHOT_SIZES = '(max-width: 559px) 56vw, (max-width: 899px) 38vw, 25vw';

function getPerView(width: number) {
  if (width >= 900) return 3;
  if (width >= 560) return 2;
  return 1;
}

function getSourceSet(sources: ScreenshotSource[]) {
  return sources.map((source) => `${source.src} ${source.width}w`).join(', ');
}

export default function SuwatteScreenshots() {
  const shots = suwatteScreenshots;
  const [perView, setPerView] = useState(3);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const update = () => setPerView(getPerView(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const pageCount = Math.max(1, Math.ceil(shots.length / perView));

  // Keep the active page valid when the layout (and therefore page count) changes.
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const goTo = (target: number) => setPage(Math.max(0, Math.min(target, pageCount - 1)));

  return (
    <div className="screenshot-reserve">
      <div className="ss-head">
        <div className="ss-label">◇ Screenshots</div>
      </div>

      <div className="ss-carousel">
        <div className="ss-stage">
          <button
            type="button"
            className="ss-arrow"
            aria-label="Previous screenshots"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <div className="ss-viewport">
            <div className="ss-track" style={{ transform: `translateX(-${page * 100}%)` }}>
              {shots.map((shot) => (
                <div className="ss-slide" key={shot.src} style={{ flexBasis: `${100 / perView}%` }}>
                  <figure className="ss-slot">
                    <picture>
                      <source type="image/jpeg" srcSet={getSourceSet(shot.sources)} sizes={SCREENSHOT_SIZES} />
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <figcaption>{shot.caption}</figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="ss-arrow"
            aria-label="Next screenshots"
            onClick={() => goTo(page + 1)}
            disabled={page >= pageCount - 1}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="ss-dots">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`ss-dot${index === page ? ' active' : ''}`}
              aria-label={`Go to screenshot page ${index + 1}`}
              aria-current={index === page}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
