"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
	theme: Theme;
	setTheme: (t: Theme) => void;
}>({ theme: "dark", setTheme: () => {} });

export function useTheme() {
	return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("dark");

	useEffect(() => {
		const stored = localStorage.getItem("inflio-theme") as Theme | null;
		if (stored) setTheme(stored);
	}, []);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem("inflio-theme", theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
