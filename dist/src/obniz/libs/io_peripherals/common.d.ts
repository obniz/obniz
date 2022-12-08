/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
/**
 *
 * - "5v"
 * Push-pull 5v mode.
 * - "3v"
 * Push-pull 3v mode.
 * - "Open-drain"
 * Open-drain mode.
 */
export declare type DriveType = '5v' | '3v' | 'open-drain';
/**
 * IO pull type
 * - null (default)
 * - "5v" pull up to 5v
 * - "3v" pull up to 3v
 * - "0v" pull down to gnd
 */
export declare type PullType = '5v' | '3v' | '0v' | null;
/**
 * Animation Status
 *
 * - loop : loop animation. It start immediately.
 * - registrate : Loop animation. Just registration
 * - pause : Pause current running animation.
 * - resume : Resume paused or just registered animation.
 */
export declare type AnimationStatus = 'loop' | 'registrate' | 'pause' | 'resume';
export declare type StopBitType = 1 | 1.5 | 2;
export declare type BitType = 5 | 6 | 7 | 8;
export declare type ParityType = 'off' | 'odd' | 'even';
export declare type FlowControlType = 'off' | 'rts' | 'cts' | 'rts-cts';
