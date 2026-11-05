import {useEffect, useRef, useState} from 'react';

export const useElementSize = <T extends HTMLElement>() => {
	const ref = useRef<T>(null);
	const [size, setSize] = useState({w: 0, h: 0});
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => {
			const {width, height} = entry.contentRect;
			setSize({w: Math.round(width), h: Math.round(height)});
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	return [ref, size] as const;
};

export const useMedia = (query: string) => {
	const [match, setMatch] = useState(() => window.matchMedia(query).matches);
	useEffect(() => {
		const mq = window.matchMedia(query);
		const on = () => setMatch(mq.matches);
		mq.addEventListener('change', on);
		return () => mq.removeEventListener('change', on);
	}, [query]);
	return match;
};

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');

/** true, пока элемент виден на экране */
export const useInView = <T extends HTMLElement>(threshold = 0.35) => {
	const ref = useRef<T>(null);
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {threshold});
		io.observe(el);
		return () => io.disconnect();
	}, [threshold]);
	return [ref, inView] as const;
};

export const useWindowSize = () => {
	const [size, setSize] = useState({w: window.innerWidth, h: window.innerHeight});
	useEffect(() => {
		const on = () => setSize({w: window.innerWidth, h: window.innerHeight});
		window.addEventListener('resize', on);
		return () => window.removeEventListener('resize', on);
	}, []);
	return size;
};
