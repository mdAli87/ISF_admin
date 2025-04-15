
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: '#000000' // Changed to black
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: '#000000' // Changed to black
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: '#000000' // Changed to black
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: '#000000' // Changed to black
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: '#000000' // Changed to black
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: '#000000' // Changed to black
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: '#000000' // Changed to black
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// New color palette from image
				"oxford-blue": "#011936", 
				"charcoal": "#465362",
				"cambridge-blue": "#82A3A1",
				"olivine": "#9FC490",
				"tea-green": "#C0DFA1",
				// Enhanced green color palette
				"success-green": "#2EBD6B", // Main green
				"light-green": "#4FCB87", // Lighter shade
				"vibrant-green": "#1ED760", // Spotify-like green
				"forest-green": "#228B22", // Deeper green
				"emerald-green": "#50C878", // Bright emerald
				"mint-green": "#98FB98", // Very light mint
				"sage-green": "#BCB88A", // Muted sage
				"dark-green": "#1A9953", // Darker shade
				"pale-green": "#F2FCE2", // Very light green for subtle backgrounds
				"lime-green": "#32CD32", // Bright lime
				"olive-green": "#808000", // Muted olive
				// Enhanced general colors
				"white": "#FFFFFF",
				"off-white": "#F8F8F8",
				"black": "#000000",
				"text-black": "#000000",
				"chart-blue": "#3B82F6",
				"chart-orange": "#F59E0B",
				"chart-purple": "#8B5CF6",
				"chart-pink": "#EC4899",
			},
			fontFamily: {
				montserrat: ["Montserrat", "sans-serif"],
				"open-sans": ["Open Sans", "sans-serif"],
				poppins: ["Poppins", "sans-serif"],
				raleway: ["Raleway", "sans-serif"],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-20px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(46, 189, 107, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(46, 189, 107, 0.8)' 
					}
				},
				'pulse-green': {
					'0%, 100%': { 
						backgroundColor: 'rgba(46, 189, 107, 0.6)'
					},
					'50%': { 
						backgroundColor: 'rgba(46, 189, 107, 0.8)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'glow': 'glow 3s ease-in-out infinite',
				'pulse-green': 'pulse-green 2s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
