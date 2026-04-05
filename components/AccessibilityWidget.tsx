'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { FaUniversalAccess, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

interface AccessibilitySettings {
  fontLevel: number;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  stopAnimations: boolean;
  readableFont: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontLevel: 0,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  stopAnimations: false,
  readableFont: false,
};

const STORAGE_KEY = 'accessibility-settings';

const FONT_CLASSES: Record<number, string> = {
  1: 'a11y-font-large',
  2: 'a11y-font-large',
  3: 'a11y-font-large',
  [-1]: 'a11y-font-small',
  [-2]: 'a11y-font-small',
};

function applySettings(settings: AccessibilitySettings) {
  const html = document.documentElement;

  // Font size classes
  html.classList.remove('a11y-font-large', 'a11y-font-small');
  if (settings.fontLevel > 0) {
    html.classList.add('a11y-font-large');
    html.style.setProperty('--a11y-font-scale', `${1 + settings.fontLevel * 0.2}`);
  } else if (settings.fontLevel < 0) {
    html.classList.add('a11y-font-small');
    html.style.setProperty('--a11y-font-scale', `${1 + settings.fontLevel * 0.15}`);
  } else {
    html.style.removeProperty('--a11y-font-scale');
  }

  // Toggle classes
  const toggles: [boolean, string][] = [
    [settings.highContrast, 'a11y-high-contrast'],
    [settings.grayscale, 'a11y-grayscale'],
    [settings.highlightLinks, 'a11y-highlight-links'],
    [settings.stopAnimations, 'a11y-stop-animations'],
    [settings.readableFont, 'a11y-readable-font'],
  ];

  for (const [active, className] of toggles) {
    if (active) {
      html.classList.add(className);
    } else {
      html.classList.remove(className);
    }
  }
}

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AccessibilitySettings;
        setSettings(parsed);
        applySettings(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Apply and persist whenever settings change
  useEffect(() => {
    applySettings(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  // Close panel on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const updateSettings = useCallback((patch: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetAll = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
    const html = document.documentElement;
    html.classList.remove(
      'a11y-font-large',
      'a11y-font-small',
      'a11y-high-contrast',
      'a11y-grayscale',
      'a11y-highlight-links',
      'a11y-stop-animations',
      'a11y-readable-font'
    );
    html.style.removeProperty('--a11y-font-scale');
  }, []);

  const adjustFont = useCallback((delta: number) => {
    setSettings((prev) => {
      const next = prev.fontLevel + delta;
      if (next > 3 || next < -2) return prev;
      return { ...prev, fontLevel: next };
    });
  }, []);

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" dir="rtl">
      {/* Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-2"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">
            <h2 className="text-base font-bold">הנגשת אתר</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 rounded-full p-1 transition-colors"
              aria-label="סגירה"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Controls */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
            {/* Font size */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
              <span className="text-sm font-medium text-gray-700">גודל גופן</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustFont(-1)}
                  disabled={settings.fontLevel <= -2}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="הקטנת גופן"
                >
                  <FaMinus className="text-xs" />
                </button>
                <span className="text-sm font-bold w-6 text-center text-gray-800">
                  {settings.fontLevel}
                </span>
                <button
                  onClick={() => adjustFont(1)}
                  disabled={settings.fontLevel >= 3}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="הגדלת גופן"
                >
                  <FaPlus className="text-xs" />
                </button>
              </div>
            </div>

            {/* Toggle controls */}
            <ToggleRow
              label="ניגודיות גבוהה"
              active={settings.highContrast}
              onToggle={() => updateSettings({ highContrast: !settings.highContrast })}
            />
            <ToggleRow
              label="גווני אפור"
              active={settings.grayscale}
              onToggle={() => updateSettings({ grayscale: !settings.grayscale })}
            />
            <ToggleRow
              label="הדגשת קישורים"
              active={settings.highlightLinks}
              onToggle={() => updateSettings({ highlightLinks: !settings.highlightLinks })}
            />
            <ToggleRow
              label="עצירת אנימציות"
              active={settings.stopAnimations}
              onToggle={() => updateSettings({ stopAnimations: !settings.stopAnimations })}
            />
            <ToggleRow
              label="גופן קריא"
              active={settings.readableFont}
              onToggle={() => updateSettings({ readableFont: !settings.readableFont })}
            />

            {/* Reset */}
            <button
              onClick={resetAll}
              className="w-full mt-2 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              איפוס הגדרות
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="תפריט נגישות"
      >
        <FaUniversalAccess className="text-2xl" />
      </button>
    </div>
  );
}

function ToggleRow({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          active ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        role="switch"
        aria-checked={active}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            active ? 'right-0.5' : 'right-[22px]'
          }`}
        />
      </button>
    </div>
  );
}
