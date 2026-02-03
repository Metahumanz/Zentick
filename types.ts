
export enum AppMode {
  CLOCK = 'CLOCK',
  COUNTDOWN = 'COUNTDOWN',
}

export enum ClockStyle {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOG',
  NIXIE = 'NIXIE',
}

export enum Language {
  EN = 'en',
  ZH = 'zh',
  DE = 'de',
}

export interface TimezoneOption {
  value: string;
  label: string;
}

export enum SoundType {
  BEEP = 'BEEP',
  CHIME = 'CHIME',
  ALARM = 'ALARM',
}

export interface ParticleConfig {
  density: number;
  speed: number;
  size: number;
  connections: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number; // Added: Original X velocity for recovery
  baseVy: number; // Added: Original Y velocity for recovery
  size: number;
  color: string;
  baseX: number; // For organic movement
  baseY: number;
  density: number;
}
