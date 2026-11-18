import React, { memo } from 'react';
import { ThemeAndPrintDeck } from './ThemeAndPrintDeck';
import { getStoredMatrixTheme, setStoredMatrixTheme, NflTheme } from '../utils/nflTeamThemes';
import { Game, Player, PlayerPickData, SeasonHistory } from '../types';

export type SheetTheme = 
  | 'forest' 
  | 'niners' 
  | 'chiefs' 
  | 'cowboys';

export type SheetLayout = 'vertical_matrix' | 'horizontal_ledger' | 'blank_takehome';

interface LegacyPickSheetViewerProps {
  games: Game[];
  players: Player[];
  picks: Record<string, PlayerPickData>;
  activePlayer?: Player | null;
  seasonHistory?: SeasonHistory;
}

/**
 * Consolidated LegacyPickSheetViewer:
 * Replaces legacy vintage parchment, coffee stains, and handwritten pens
 * with the official NFL Team Themes & Consolidated Print/Download Deck.
 */
export const LegacyPickSheetViewer: React.FC<LegacyPickSheetViewerProps> = memo(({
  games,
  players,
  picks,
  seasonHistory
}) => {
  const [activeTheme, setActiveTheme] = React.useState<NflTheme>(() => getStoredMatrixTheme());

  const handleSelectTheme = (theme: NflTheme) => {
    const saved = setStoredMatrixTheme(theme.id);
    setActiveTheme(saved);
  };

  return (
    <ThemeAndPrintDeck
      games={games}
      players={players}
      picks={picks}
      seasonHistory={seasonHistory}
      activeTheme={activeTheme}
      onSelectTheme={handleSelectTheme}
      onViewMatrix={() => {}}
    />
  );
});

export default LegacyPickSheetViewer;
