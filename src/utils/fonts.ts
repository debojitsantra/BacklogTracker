/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FontType, CustomFont, FontSettings } from '../types';

// Available preset fonts
export const PRESET_FONTS: { value: FontType; label: string }[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'CormorantGaramond', label: 'Cormorant Garamond' },
  { value: 'InstrumentSerif', label: 'Instrument Serif' },
  { value: 'Quicksand', label: 'Quicksand' }
];

// Map font type to CSS font-family name
export const FONT_FAMILY_MAP: Record<FontType, string> = {
  'Inter': 'Inter',
  'Outfit': 'Outfit',
  'JetBrains Mono': 'JetBrains Mono',
  'CormorantGaramond': 'CormorantGaramond',
  'InstrumentSerif': 'InstrumentSerif',
  'Quicksand': 'Quicksand',
  'custom': 'CustomFont'
};

// Default font settings
export const DEFAULT_FONT_SETTINGS: FontSettings = {
  fontFamily: 'Inter',
  fontSize: 100,
  customFonts: [],
  selectedCustomFont: undefined
};


export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


export async function createCustomFont(file: File): Promise<CustomFont> {
  const base64Data = await readFileAsBase64(file);
  
  const fontName = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, '');
  
  const fontFamily = `CustomFont-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    name: fontName,
    data: base64Data,
    fontFamily
  };
}


export function generateCustomFontCSS(font: CustomFont): string {
  return `
@font-face {
  font-family: '${font.fontFamily}';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('data:font/truetype;base64,${font.data}') format('truetype');
}
`;
}

export function getCurrentFontFamily(settings: FontSettings): string {
  if (settings.fontFamily === 'custom' && settings.selectedCustomFont) {
    const customFont = settings.customFonts.find(f => f.name === settings.selectedCustomFont);
    if (customFont) {
      return customFont.fontFamily;
    }
  }
  return FONT_FAMILY_MAP[settings.fontFamily];
}

export function getFontSizeMultiplier(settings: FontSettings): number {
  return settings.fontSize / 100;
}

export function removeCustomFont(settings: FontSettings, fontName: string): FontSettings {
  const customFonts = settings.customFonts.filter(f => f.name !== fontName);
  let selectedCustomFont = settings.selectedCustomFont;
  
  if (selectedCustomFont === fontName) {
    selectedCustomFont = undefined;
  }
  
  return {
    ...settings,
    customFonts,
    selectedCustomFont
  };
}


export function selectFont(settings: FontSettings, font: FontType | string): FontSettings {

  if (PRESET_FONTS.some(f => f.value === font)) {
    return {
      ...settings,
      fontFamily: font as FontType,
      selectedCustomFont: undefined
    };
  }
  

  return {
    ...settings,
    fontFamily: 'custom',
    selectedCustomFont: font
  };
}

export function setFontSize(settings: FontSettings, size: number): FontSettings {

  const clampedSize = Math.max(80, Math.min(200, size));
  return {
    ...settings,
    fontSize: clampedSize
  };
}
