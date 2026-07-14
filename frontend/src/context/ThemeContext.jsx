import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // defaults to light, remembers choice in localStorage
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark' ? true : false
  );
// when press toggle change it to dark or light etc
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // all colors defined in one place
  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      background: '#1a1a2e',
      card: '#2d2d44',
      navbar: '#16213e',
      text: '#f0e6d3',
      subtext: '#b89a8a',
      border: '#3d3d5c',
      input: '#3d3d5c',
      inputBg: '#252540',
      accent: '#c17c5a',
      totalCard: '#c17c5a',
      filterActive: '#c17c5a',
      filterInactive: '#3d3d5c',
      filterInactiveText: '#f0e6d3',
      shadow: 'rgba(0,0,0,0.3)'
    } : {
      background: '#fdf6f0',
      card: 'white',
      navbar: 'white',
      text: '#3d2c2c',
      subtext: '#9e7b6b',
      border: '#e8d5c4',
      input: '#e8d5c4',
      inputBg: '#fffaf7',
      accent: '#c17c5a',
      totalCard: '#c17c5a',
      filterActive: '#c17c5a',
      filterInactive: 'white',
      filterInactiveText: '#7a5c52',
      shadow: 'rgba(193,124,90,0.08)'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);