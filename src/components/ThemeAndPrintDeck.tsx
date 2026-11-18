import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  Printer, 
  Download, 
  Palette, 
  Check, 
  RotateCcw, 
  FileSpreadsheet, 
  FileText, 
  Trophy, 
  Loader2,
  Calendar,
  Eye
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Game, Player, PlayerPickData, SeasonHistory } from '../types';
import { 
  NflTheme, 
  NFL_THEMES, 
  ALL_NFL_TEAMS_ORDERED, 
  DEFAULT_THEME_ID,
  formatTeamCityOrRegion
} from '../utils/nflTeamThemes';

interface ThemeAndPrintDeckProps {
  games: Game[];
  players: Player[];
  picks: Record<string, PlayerPickData>;
  seasonHistory?: SeasonHistory;
  activeTheme: NflTheme;
  onSelectTheme: (theme: NflTheme) => void;
  onViewMatrix: () => void;
}

export const ThemeAndPrintDeck: React.FC<ThemeAndPrintDeckProps> = memo(({
  games,
  players,
  picks,
  seasonHistory,
  activeTheme,
  onSelectTheme,
  onViewMatrix
}) => {
  // Navigation between Blank Pick Sheet and Scoring Spreadsheet inside print panel
  const [activePrintTab, setActivePrintTab] = useState<'blank' | 'scoresheet'>('blank');

  // Blank Pick Sheet configuration
  const currentActiveWeek = games[0]?.week || 8;
  const [selectedWeek, setSelectedWeek] = useState<number>(currentActiveWeek);
  const [blankWeekGames, setBlankWeekGames] = useState<Game[]>(games);
  const [isLoadingWeek, setIsLoadingWeek] = useState<boolean>(false);
  const [blankColorMode, setBlankColorMode] = useState<'bw' | 'color'>('bw'); // Default auto-set to black and white

  // Scoresheet configuration
  const [scoresheetColorMode, setScoresheetColorMode] = useState<'color' | 'bw'>('color'); // Default team themed color

  // PDF generation state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // References for printable containers
  const blankSheetRef = useRef<HTMLDivElement>(null);
  const scoresheetRef = useRef<HTMLDivElement>(null);

  // Fetch games when selectedWeek changes for the blank pick sheet
  useEffect(() => {
    if (selectedWeek === currentActiveWeek && games && games.length > 0) {
      setBlankWeekGames(games);
      return;
    }

    let isMounted = true;
    setIsLoadingWeek(true);

    fetch(`/api/schedule/week/${selectedWeek}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.games) && data.games.length > 0) {
          setBlankWeekGames(data.games);
        } else {
          // Fallback to current games or blank structure
          setBlankWeekGames(games);
        }
      })
      .catch(() => {
        if (isMounted) setBlankWeekGames(games);
      })
      .finally(() => {
        if (isMounted) setIsLoadingWeek(false);
      });

    return () => { isMounted = false; };
  }, [selectedWeek, currentActiveWeek, games]);

  // Sorted active players for scoresheet: strictly ordered by season total wins (descending)
  const activePlayers = React.useMemo(() => {
    const list = players.filter(p => p.isActive !== false);
    return [...list].sort((a, b) => {
      const aWins = seasonHistory?.records?.[a.name]?.totalWins ?? 0;
      const bWins = seasonHistory?.records?.[b.name]?.totalWins ?? 0;
      if (bWins !== aWins) return bWins - aWins;
      return a.name.localeCompare(b.name);
    });
  }, [players, seasonHistory]);

  // -------------------------------------------------------------
  // PRINT HANDLERS
  // -------------------------------------------------------------
  const handlePrintBlankSheet = () => {
    const printArea = blankSheetRef.current;
    if (!printArea) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Branham Hills Pool - Week ${selectedWeek} Blank Pick Sheet</title>
          <style>
            @page { size: portrait; margin: 8mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; color: #000; background: #fff; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #475569; padding: 6px 8px; font-size: 11px; }
            th { background-color: #f1f5f9; text-transform: uppercase; font-weight: 800; font-size: 10px; }
            .header-banner { border: 2px solid #000; padding: 12px; text-align: center; margin-bottom: 12px; }
            .tiebreaker-box { border: 2px solid #000; padding: 10px; margin-top: 14px; page-break-inside: avoid; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 350);
  };

  const handlePrintScoresheet = () => {
    const printArea = scoresheetRef.current;
    if (!printArea) return;

    const printWindow = window.open('', '_blank', 'width=1300,height=850');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Branham Hills Pool - Week ${currentActiveWeek} Scoring Spreadsheet</title>
          <style>
            @page { size: landscape; margin: 5mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; color: #000; background: #fff; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 8pt; }
            th, td { border: 1px solid #64748b; padding: 3px 2px; text-align: center; overflow: hidden; white-space: nowrap; }
            th { font-weight: 800; font-size: 7.5pt; }
            .header-info { margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 4px; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  // -------------------------------------------------------------
  // PDF DOWNLOAD HANDLERS (html2canvas + jsPDF)
  // -------------------------------------------------------------
  const handleDownloadBlankPdf = async () => {
    const element = blankSheetRef.current;
    if (!element) return;

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));
      pdf.save(`Branham_Hills_Pool_Week_${selectedWeek}_Blank_Pick_Sheet.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      handlePrintBlankSheet();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadScoresheetPdf = async () => {
    const element = scoresheetRef.current;
    if (!element) return;

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));
      pdf.save(`Branham_Hills_Pool_Week_${currentActiveWeek}_Scoring_Spreadsheet.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      handlePrintScoresheet();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* ======================================================== */}
      {/* CONSOLIDATED SECTION 1: NFL TEAM COLOR THEMES            */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl text-white shadow-xs"
              style={{ backgroundColor: activeTheme.primary }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Spreadsheet Team Color Themes</span>
                <span 
                  className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: activeTheme.primary }}
                >
                  Active: {activeTheme.teamName}
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Customize the main leaderboard matrix to your favorite NFL team. Persists across all sessions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onSelectTheme(NFL_THEMES[DEFAULT_THEME_ID])}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Reset spreadsheet to classic Forest Green"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
            <button
              type="button"
              onClick={onViewMatrix}
              className="px-3 py-1.5 rounded-lg text-xs font-black bg-[#1b3a2b] hover:bg-[#142d21] text-amber-300 border border-emerald-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Open Spreadsheet</span>
            </button>
          </div>
        </div>

        {/* 33 NFL TEAM THEME BUTTONS (All 32 NFL Teams + Forest Green Default) */}
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
            Select Your Team (32 NFL Franchises + System Default):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {ALL_NFL_TEAMS_ORDERED.map(teamKey => {
              const theme = NFL_THEMES[teamKey];
              if (!theme) return null;
              const isSelected = activeTheme.id === theme.id;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onSelectTheme(theme)}
                  style={{
                    backgroundColor: isSelected ? theme.primary : '#ffffff',
                    color: isSelected ? theme.textColor : '#0f172a',
                    borderColor: isSelected ? (theme.borderAccent || theme.secondary) : '#cbd5e1',
                    boxShadow: isSelected ? `0 0 0 2px ${theme.borderAccent || theme.secondary}` : undefined
                  }}
                  className={`px-2.5 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer flex items-center justify-between gap-1 shadow-2xs hover:scale-[1.02] active:scale-95 ${
                    isSelected ? 'shadow-md' : 'hover:border-slate-400 bg-white'
                  }`}
                >
                  <span className="truncate">{theme.teamName}</span>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentColor || theme.secondary || '#ffffff' }} />
                  ) : (
                    <span className="flex items-center gap-0.5 shrink-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs" 
                        style={{ backgroundColor: theme.primary }} 
                        title={`Primary: ${theme.primary}`}
                      />
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs" 
                        style={{ backgroundColor: theme.secondary }} 
                        title={`Accent: ${theme.secondary}`}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CONSOLIDATED SECTION 2: PRINT & DOWNLOAD CENTER          */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 sm:p-5 space-y-5">
        {/* Navigation Bar between Blank Pick Sheet and Scoresheet */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <Printer className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Print & Download Operations
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Download or print clean official pick sheets and isolated scoring spreadsheets.
              </p>
            </div>
          </div>

          {/* Sub-Tabs: Blank Pick Sheet vs Isolated Scoring Matrix */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-300 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActivePrintTab('blank')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activePrintTab === 'blank'
                  ? 'bg-white text-slate-950 font-black shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>Blank Pick Sheet (Any Week)</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePrintTab('scoresheet')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activePrintTab === 'scoresheet'
                  ? 'bg-white text-slate-950 font-black shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-700" />
              <span>Scoring Spreadsheet (Landscape)</span>
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* TAB 1: BLANK PICK SHEET (UPCOMING OR ANY WEEK 1-18)      */}
        {/* -------------------------------------------------------- */}
        {activePrintTab === 'blank' && (
          <div className="space-y-4">
            {/* Control Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                {/* Week Selector */}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span className="font-bold text-slate-700">Select Week:</span>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                    className="bg-white border-2 border-slate-300 rounded-lg px-2.5 py-1 text-xs font-black text-slate-900 cursor-pointer focus:border-emerald-700"
                  >
                    {Array.from({ length: 18 }, (_, i) => i + 1).map(wk => (
                      <option key={wk} value={wk}>
                        Week {wk} {wk === currentActiveWeek ? '(Current Week)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Format Toggle */}
                <div className="flex items-center gap-1.5 border-l border-slate-300 pl-4">
                  <span className="font-bold text-slate-700">Style:</span>
                  <button
                    type="button"
                    onClick={() => setBlankColorMode('bw')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all border cursor-pointer ${
                      blankColorMode === 'bw'
                        ? 'bg-slate-900 text-white border-slate-950 font-black shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Black & White (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlankColorMode('color')}
                    style={blankColorMode === 'color' ? { backgroundColor: activeTheme.primary, borderColor: activeTheme.secondary, color: activeTheme.textColor } : {}}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all border cursor-pointer ${
                      blankColorMode === 'color'
                        ? 'font-black shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {activeTheme.teamName} Color
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintBlankSheet}
                  disabled={isLoadingWeek}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Print Blank Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBlankPdf}
                  disabled={isGeneratingPdf || isLoadingWeek}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{isGeneratingPdf ? 'Rendering PDF...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>

            {/* Live Preview Container (Formatted for Clean 8.5x11 Portrait) */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-100 p-2 sm:p-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Printable Sheet Preview ({blankColorMode === 'bw' ? 'Black & White' : `${activeTheme.teamName} Themed`}):</span>
              </div>

              <div 
                ref={blankSheetRef}
                className="bg-white p-6 sm:p-8 rounded-lg shadow-sm max-w-2xl mx-auto border border-slate-300 font-sans"
                style={blankColorMode === 'color' ? { borderColor: activeTheme.borderColor } : {}}
              >
                {/* Official League Header */}
                <div 
                  className="border-2 p-4 text-center rounded-lg mb-4"
                  style={blankColorMode === 'color' ? {
                    backgroundColor: activeTheme.headerBg,
                    borderColor: activeTheme.secondary,
                    color: activeTheme.textColor
                  } : {
                    backgroundColor: '#f8fafc',
                    borderColor: '#0f172a',
                    color: '#0f172a'
                  }}
                >
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-90">
                    Branham Hills Football Pool • Est. 1986
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight my-1">
                    Week {selectedWeek} Official Straight-Up Pick Sheet
                  </h1>
                  <div className="text-[11px] font-semibold opacity-90">
                    40th Anniversary Season • Founder: Don &quot;The Commish&quot; Threet • Admin: Joel Threet
                  </div>
                </div>

                {/* Contender Identification Bar */}
                <div className="flex justify-between items-center text-xs font-bold border-b-2 border-slate-800 pb-2 mb-3">
                  <div>Contender Name: __________________________________</div>
                  <div>Date: __________________</div>
                </div>

                {/* Matchup Pick Rows */}
                {isLoadingWeek ? (
                  <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
                    <span className="text-xs font-bold">Loading Week {selectedWeek} slate from ESPN...</span>
                  </div>
                ) : (
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr 
                        style={blankColorMode === 'color' ? {
                          backgroundColor: activeTheme.primary,
                          color: activeTheme.textColor
                        } : {
                          backgroundColor: '#f1f5f9',
                          color: '#0f172a'
                        }}
                      >
                        <th className="border border-slate-400 py-1.5 px-2 text-center w-8">#</th>
                        <th className="border border-slate-400 py-1.5 px-2 text-left">Matchup (Away @ Home)</th>
                        <th className="border border-slate-400 py-1.5 px-2 text-center w-16">Day/Time</th>
                        <th className="border border-slate-400 py-1.5 px-2 text-center w-20">Line</th>
                        <th className="border border-slate-400 py-1.5 px-2 text-center font-black w-36">
                          Your Pick (Winner)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {blankWeekGames.map((g, idx) => (
                        <tr key={g.gameNumber || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-700">
                            {g.gameNumber || idx + 1}
                          </td>
                          <td className="border border-slate-300 py-1.5 px-2 font-bold text-slate-900">
                            <span>{formatTeamCityOrRegion(g.awayTeam)}</span>
                            <span className="text-slate-400 font-normal mx-1.5">@</span>
                            <span>{formatTeamCityOrRegion(g.homeTeam)}</span>
                            {g.isMNF && (
                              <span className="ml-2 text-[9px] font-black uppercase px-1 rounded bg-purple-100 text-purple-900 border border-purple-300">
                                MNF
                              </span>
                            )}
                          </td>
                          <td className="border border-slate-300 py-1.5 px-2 text-center text-slate-600 text-[11px]">
                            {g.day || 'Sun'} {g.kickoffTime || '10:00 AM'}
                          </td>
                          <td className="border border-slate-300 py-1.5 px-2 text-center text-slate-700 font-semibold text-[11px]">
                            {g.spread || 'PK'}
                          </td>
                          <td className="border border-slate-400 py-1.5 px-2 text-center bg-white">
                            <span className="text-slate-400 text-[10px]">____________________</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Monday Night Tiebreaker Box */}
                <div 
                  className="mt-4 p-3 border-2 rounded-lg text-xs"
                  style={blankColorMode === 'color' ? {
                    borderColor: activeTheme.borderColor,
                    backgroundColor: '#fafafa'
                  } : {
                    borderColor: '#0f172a',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  <div className="font-black text-slate-900 uppercase tracking-wide mb-1">
                    🏈 Monday Night Combined Total Points Tiebreaker:
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Closest guess to actual final total points decides 1st place weekly rank ties:</span>
                    <span className="font-black text-sm border-2 border-slate-800 px-4 py-1 rounded bg-white">
                      [ ________ ] pts
                    </span>
                  </div>
                </div>

                {/* Pool Rules Footnote */}
                <div className="mt-3 text-[10px] text-slate-500 text-center border-t border-slate-200 pt-2 leading-relaxed">
                  Straight-up pool rules • 1 point awarded per outright winner • 0 bonus points for tiebreaker • Official lockout enforced at kickoff
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 2: CURRENT SCORING SPREADSHEET (LANDSCAPE SHRINK-FIT)*/}
        {/* -------------------------------------------------------- */}
        {activePrintTab === 'scoresheet' && (
          <div className="space-y-4">
            {/* Control Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-purple-700" />
                  <span className="font-bold text-slate-900">Isolated Scoresheet:</span>
                  <span className="text-slate-600">Week {currentActiveWeek} Master Matrix</span>
                </div>

                {/* Color Format Toggle */}
                <div className="flex items-center gap-1.5 border-l border-slate-300 pl-4">
                  <span className="font-bold text-slate-700">Color Mode:</span>
                  <button
                    type="button"
                    onClick={() => setScoresheetColorMode('color')}
                    style={scoresheetColorMode === 'color' ? { backgroundColor: activeTheme.primary, borderColor: activeTheme.secondary, color: activeTheme.textColor } : {}}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all border cursor-pointer ${
                      scoresheetColorMode === 'color'
                        ? 'font-black shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {activeTheme.teamName} Theme
                  </button>
                  <button
                    type="button"
                    onClick={() => setScoresheetColorMode('bw')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all border cursor-pointer ${
                      scoresheetColorMode === 'bw'
                        ? 'bg-slate-900 text-white border-slate-950 font-black shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Black & White
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintScoresheet}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  title="Print isolated spreadsheet fitted to landscape paper"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Print Scoresheet (Landscape)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadScoresheetPdf}
                  disabled={isGeneratingPdf}
                  className="bg-purple-800 hover:bg-purple-900 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  title="Download isolated landscape PDF"
                >
                  {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{isGeneratingPdf ? 'Rendering PDF...' : 'Download PDF (Landscape)'}</span>
                </button>
              </div>
            </div>

            {/* Live Preview Container (Formatted for Landscape Shrink-to-Fit) */}
            <div className="border border-slate-300 rounded-xl overflow-x-auto bg-slate-100 p-2 sm:p-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Isolated Scoresheet Preview (Landscape Fitted):</span>
              </div>

              <div 
                ref={scoresheetRef}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-300 font-sans min-w-[1000px] max-w-[1200px] mx-auto"
                style={scoresheetColorMode === 'color' ? { borderColor: activeTheme.borderColor } : {}}
              >
                {/* Isolated Header */}
                <div 
                  className="p-3 border-b-2 mb-3 flex items-center justify-between"
                  style={scoresheetColorMode === 'color' ? {
                    backgroundColor: activeTheme.headerBg,
                    borderColor: activeTheme.secondary,
                    color: activeTheme.textColor
                  } : {
                    backgroundColor: '#0f172a',
                    borderColor: '#000000',
                    color: '#ffffff'
                  }}
                >
                  <div>
                    <h2 className="text-sm sm:text-base font-black uppercase tracking-wider">
                      Branham Hills Football Pool: Legacy Edition • Week {currentActiveWeek} Scoresheet
                    </h2>
                    <div className="text-[10px] opacity-80 font-medium">
                      Est. 1986 • 40th Anniversary Season • Official Scoring Ledger
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-mono opacity-80">
                    <div>Format: 1 Pt / Outright Win</div>
                    <div>Active Contenders: {activePlayers.length}</div>
                  </div>
                </div>

                {/* Isolated Compact Table */}
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr 
                      style={scoresheetColorMode === 'color' ? {
                        backgroundColor: activeTheme.primary,
                        color: activeTheme.textColor
                      } : {
                        backgroundColor: '#f1f5f9',
                        color: '#0f172a'
                      }}
                    >
                      <th className="border border-slate-400 py-1 px-1.5 text-left font-black w-24">Contender</th>
                      <th className="border border-slate-400 py-1 px-1 text-center font-black w-11" title="Season Total Wins">Season</th>
                      <th className="border border-slate-400 py-1 px-1 text-center font-black w-10">Wk Pts</th>
                      <th className="border border-slate-400 py-1 px-1 text-center font-black w-10">MNF TB</th>
                      {games.map(g => (
                        <th key={g.gameNumber} className="border border-slate-400 py-1 px-0.5 text-center">
                          <div className="font-black">G{g.gameNumber}</div>
                          <div className="text-[8px] font-normal truncate opacity-80 max-w-[50px] mx-auto">
                            {formatTeamCityOrRegion(g.awayTeam)} @ {formatTeamCityOrRegion(g.homeTeam)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activePlayers.map((player, pIdx) => {
                      const playerPickData = picks[player.name];
                      const contenderPicks = playerPickData?.picks || {};
                      const tb = playerPickData?.tiebreaker ?? '';

                      let weekWins = 0;
                      games.forEach(g => {
                        const pick = contenderPicks[g.gameNumber];
                        if (g.status === 'final' && g.officialWinner && pick) {
                          if (pick.toLowerCase() === g.officialWinner.toLowerCase()) weekWins++;
                        }
                      });

                      const seasonWins = seasonHistory?.records?.[player.name]?.totalWins ?? 0;

                      return (
                        <tr 
                          key={player.id} 
                          className={pIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                        >
                          <td className="border border-slate-300 py-1 px-1.5 font-black text-slate-900 truncate">
                            {player.name} {player.isDefendingChamp ? '🏆' : ''}
                          </td>
                          <td className="border border-slate-300 py-1 px-1 text-center font-black text-amber-950 bg-amber-50/70">
                            {seasonWins}
                          </td>
                          <td className="border border-slate-300 py-1 px-1 text-center font-black text-emerald-800 bg-emerald-50/50">
                            {weekWins}
                          </td>
                          <td className="border border-slate-300 py-1 px-1 text-center font-mono font-bold text-purple-900">
                            {tb !== '' ? tb : '—'}
                          </td>
                          {games.map(g => {
                            const pick = contenderPicks[g.gameNumber];
                            const isFinal = g.status === 'final';
                            const isWin = isFinal && g.officialWinner && pick && pick.toLowerCase() === g.officialWinner.toLowerCase();
                            const isLoss = isFinal && g.officialWinner && pick && pick.toLowerCase() !== g.officialWinner.toLowerCase() && g.officialWinner !== 'TIE';

                            return (
                              <td 
                                key={g.gameNumber}
                                className={`border border-slate-300 py-1 px-0.5 text-center truncate ${
                                  scoresheetColorMode === 'color' && isWin
                                    ? 'bg-emerald-100 font-black text-emerald-950'
                                    : scoresheetColorMode === 'color' && isLoss
                                      ? 'bg-rose-50/60 text-slate-400 opacity-60 font-medium'
                                      : isWin
                                        ? 'bg-slate-200 font-black text-black'
                                        : isLoss
                                          ? 'text-slate-400 opacity-60 font-medium'
                                          : 'text-slate-800'
                                }`}
                              >
                                {pick ? formatTeamCityOrRegion(pick) : '—'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Footnote */}
                <div className="mt-3 text-[9px] text-slate-500 flex justify-between items-center border-t border-slate-200 pt-2">
                  <span>* Isolated Print Format: Shrink-to-fit Letter Landscape (11 x 8.5 in)</span>
                  <span>Generated by Branham Hills Legacy System</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
