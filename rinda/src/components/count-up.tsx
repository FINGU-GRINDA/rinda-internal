"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
	end: number;
	duration?: number;
	suffix?: string;
	prefix?: string;
	decimals?: number;
	className?: string;
}

export function CountUp({
	end,
	duration = 2000,
	suffix = "",
	prefix = "",
	decimals = 0,
	className = "",
}: CountUpProps) {
	const [count, setCount] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const elementRef = useRef<HTMLSpanElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting && !hasAnimated.current) {
					setIsVisible(true);
					hasAnimated.current = true;
				}
			},
			{ threshold: 0.1 },
		);

		if (elementRef.current) {
			observer.observe(elementRef.current);
		}

		return () => {
			if (elementRef.current) {
				observer.unobserve(elementRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (!isVisible) return;

		const startTime = Date.now();
		const endValue = end;

		const timer = setInterval(() => {
			const now = Date.now();
			const progress = Math.min((now - startTime) / duration, 1);

			// Easing function for smooth animation
			const easeOutQuart = 1 - (1 - progress) ** 4;
			const currentValue = easeOutQuart * endValue;

			setCount(currentValue);

			if (progress === 1) {
				clearInterval(timer);
			}
		}, 16); // ~60fps

		return () => clearInterval(timer);
	}, [isVisible, end, duration]);

	const displayValue = count.toFixed(decimals);

	return (
		<span ref={elementRef} className={className}>
			{prefix}
			{displayValue}
			{suffix}
		</span>
	);
}
