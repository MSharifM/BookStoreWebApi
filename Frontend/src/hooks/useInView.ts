import { useEffect, useRef, useState } from 'react';

interface Options {
  rootMargin?: string;
  once?: boolean;
}

export function useInView<T extends HTMLElement>(options: Options = {}) {
  const { rootMargin = '300px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, once, rootMargin]);

  return { ref, inView };
}