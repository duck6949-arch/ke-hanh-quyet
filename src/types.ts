/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Evidence {
  id: string;
  name: string;
  description: string;
  image: string;
}

export type Emotion = 'normal' | 'happy' | 'angry' | 'surprised' | 'thinking' | 'sweating';

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  emotion?: Emotion;
  background?: string;
  characterImage?: string;
  nextId?: string;
  choices?: {
    text: string;
    nextId: string;
    requiredEvidence?: string;
  }[];
  isStatement?: boolean; // For cross-examination
  correctEvidence?: string; // Evidence to present here to advance
  onCorrectionId?: string; // What happens if correct evidence presented
  onWrongId?: string; // What happens if wrong evidence presented
}

export interface GameState {
  currentDialogueId: string;
  inventory: string[]; // Array of evidence IDs
  isExamining: boolean;
  isCourtroom: boolean;
  penalties: number;
}
