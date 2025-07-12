"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { Sidebar } from "@/components/sidebar";
import styles from "./page.module.css";

export default function Page() {
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	const handleFocusChange = (focused: boolean) => {
		setIsSearchFocused(focused);
	};

	return (
		<>
			<Sidebar />
			<Navbar />
			<main className="ml-64 mt-16 min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center relative">
				<div className={styles.bloomContainer}>
					<div
						className={`${styles.bloomEffect} ${
							isSearchFocused ? styles.focused : styles.unfocused
						}`}
					/>
				</div>
				<div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-full relative z-10">
					<div className="w-full">
						<SearchBar onFocusChange={handleFocusChange} />
					</div>
				</div>
			</main>
		</>
	);
}
