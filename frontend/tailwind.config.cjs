/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
  theme: {
    extend: {
		fontSize: {
			8: '0.5rem',
			9: '0.5625rem',
			10: '0.625rem',
			11: '0.6875rem',
			12: '0.75rem',
			14: '0.875rem',
			16: '1rem',
			18: '1.125rem',
			20: '1.25rem',
			22: '1.375rem',
			24: '1.5rem',
			30: '1.875rem',
			32: '2rem',
			40: '2.5rem',
			48: '3rem',
			64: '4rem',
			80: '5rem',
			180: '11.25rem'
		},
		borderRadius: {
			none: '0px',
			1: '0.0625rem',
			2: '0.125rem',
			3: '0.1875rem',
			4: '0.25rem',
			6: '0.375rem',
			8: '0.5rem',
			12: '0.75rem',
			20: '1.25rem',
			30: '1.875rem',
			full: '9999rem'
		},
		translate: {
			cardHover: '-8%'
		},
		colors: {
			primary: '#1475E1',
			green: '#00e701',
			blurple: '#3f50b5',
			offWhite: '#f7f7f7',
			mainBg: '#0f212e',
			secondaryBg: '#213743',
			navBg: '#1a2c38',
			footerBg: '#071d2a',

			icon: '#557086'
		},
		transitionProperty: {
			'spacing': 'margin, padding, bottom',
		},
		spacing: {
			answerCardHeight: '180px',
			answerCardHeightXL: '200px',
			questionCardHeight: '240px',
			questionCardHeightXL: '275px',

			answerCardWidth: '165px',
			answerCardWidthXL: '155px',
			questionCardWidth: '200px',
			questionCardWidthXL: '215px',
		}
	},
  },
  plugins: [],
}
