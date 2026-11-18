import { WeeklyDispatch, Game, Player, PlayerPickData } from '../types';

/**
 * Utility to export a fully editable Word Document (.docx / .doc)
 * for the Branham Hills Legacy Football Pool dispatches.
 */
export async function generateDispatchDocx(
  dispatch: WeeklyDispatch,
  games: Game[] = [],
  players: Player[] = [],
  picks: Record<string, PlayerPickData> = {}
): Promise<void> {
  const weekNum = dispatch.weekNumber || 2;
  const dispatchTitle = dispatch.title || `Branham Hills Legacy Football Pool - Week ${weekNum} Dispatch`;

  // Build Word HTML string formatted specifically for Microsoft Word / Google Docs
  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${dispatchTitle}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body {
          font-family: 'Calibri', 'Helvetica Arial', sans-serif;
          font-size: 11pt;
          color: #0f172a;
          line-height: 1.5;
          margin: 0.5in;
        }
        h1 {
          font-size: 18pt;
          color: #1b3a2b;
          text-transform: uppercase;
          margin-bottom: 2pt;
          font-weight: bold;
        }
        h2 {
          font-size: 13pt;
          color: #ca8a04;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 12pt;
          font-weight: bold;
        }
        h3 {
          font-size: 12pt;
          color: #1b3a2b;
          text-transform: uppercase;
          border-bottom: 2pt solid #1b3a2b;
          padding-bottom: 3pt;
          margin-top: 14pt;
          margin-bottom: 8pt;
          font-weight: bold;
        }
        p {
          margin-top: 0;
          margin-bottom: 8pt;
        }
        .header-box {
          border-bottom: 2pt solid #1b3a2b;
          padding-bottom: 10pt;
          margin-bottom: 14pt;
        }
        .gold-badge {
          background-color: #fef08a;
          color: #713f12;
          border: 1pt solid #ca8a04;
          padding: 3pt 8pt;
          font-weight: bold;
          font-size: 9pt;
          border-radius: 4pt;
          display: inline-block;
          margin-bottom: 6pt;
        }
        .recap-box {
          background-color: #f8fafc;
          border-left: 4pt solid #1b3a2b;
          padding: 8pt 12pt;
          margin-bottom: 12pt;
        }
        .highlight-box {
          background-color: #f0fdf4;
          border-left: 4pt solid #16a34a;
          padding: 8pt 12pt;
          margin-bottom: 12pt;
        }
        .roast-box {
          background-color: #fef2f2;
          border-left: 4pt solid #dc2626;
          padding: 8pt 12pt;
          margin-bottom: 12pt;
        }
        .quote-box {
          background-color: #fef9c3;
          border: 1.5pt solid #ca8a04;
          padding: 10pt 14pt;
          margin-top: 14pt;
          margin-bottom: 14pt;
          font-style: italic;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8pt;
          margin-bottom: 14pt;
          font-size: 10pt;
        }
        th {
          background-color: #1b3a2b;
          color: #ffffff;
          font-weight: bold;
          padding: 6pt 8pt;
          text-align: left;
        }
        td {
          padding: 5pt 8pt;
          border-bottom: 1pt solid #e2e8f0;
        }
        .winner-row {
          background-color: #fef9c3;
          font-weight: bold;
        }
        .footer-note {
          font-size: 8.5pt;
          color: #64748b;
          border-top: 1pt solid #cbd5e1;
          padding-top: 6pt;
          margin-top: 20pt;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <!-- Header Banner -->
      <div class="header-box">
        <div class="gold-badge">⭐ 40th Anniversary Season • EST. 1986</div>
        <h1>BRANHAM HILLS LEGACY FOOTBALL POOL</h1>
        <h2>${dispatch.type === 'friday' ? `WEEK ${weekNum} FRIDAY NIGHT WIRE & INJURY INTEL` : dispatch.type === 'sunday' ? `WEEK ${weekNum} SUNDAY NIGHT RECAP & PODIUM SHUFFLE` : `WEEK ${weekNum} CROWN & OFFICIAL DISPATCH`}</h2>
        <p style="font-size: 9.5pt; color: #475569; margin: 0;">
          <strong>Edition:</strong> ${dispatch.type === 'friday' ? 'Dispatch 1 of 3 (Friday Wire)' : dispatch.type === 'sunday' ? 'Dispatch 2 of 3 (Sunday Recap)' : 'Dispatch 3 of 3 (Tuesday Final)'} &bull; 
          <strong>Commissioner:</strong> Don "The Commish" Threet &bull; 
          <strong>Admin:</strong> Joel Threet
        </p>
      </div>

      <!-- Crew Chief Recap -->
      <h3>■ CREW CHIEF RECAP: THE SHAKEUP & THE CROWN</h3>
      <div class="recap-box">
        <p>If Week 1 was a warm-up, Week 2 was a full-blown reality check. The coffee is hot at the Crew Chief's desk this Tuesday morning, and the final tally reveals a brutal week for overconfident prognosticators. When the Rams finished off the Giants on Monday Night, the leaderboard underwent a seismic shift that left a trail of broken tiebreaker sheets in its wake.</p>
        <p>Leading the charge into victory lane is pool newcomer <strong>Marcio</strong>, who put on a clinic with a slate-leading 12 wins (12-4). To storm into a 40-year-old pool as a rookie and immediately snatch the weekly crown from a room full of seasoned pool sharks is the ultimate flex.</p>
        <p>Meanwhile, keeping the pressure on near the top are two of our most distinguished pool alumni, <strong>Rudy</strong> and <strong>Richard</strong>. These gentlemen have been picking gridiron winners since leather helmets were standard issue, and their veteran instincts prove once again why experience never goes out of style.</p>
      </div>

      <!-- Final Standings Table -->
      <h3>📋 FINAL WEEK ${weekNum} OFFICIAL STANDINGS & SCORES</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 50pt;">Rank</th>
            <th style="width: 140pt;">Contender</th>
            <th style="text-align: center; width: 50pt;">Wins</th>
            <th style="text-align: center; width: 50pt;">Losses</th>
            <th style="text-align: right;">MNF Pick (Tiebreaker Total)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="winner-row">
            <td style="color: #854d0e;">#1 👑</td>
            <td style="color: #713f12;">Marcio (Rookie)</td>
            <td style="text-align: center; color: #15803d;">12</td>
            <td style="text-align: center; color: #b91c1c;">4</td>
            <td style="text-align: right; color: #854d0e;">Los Angeles (Rams) (45)</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>Don (Commish)</td>
            <td style="text-align: center;">11</td>
            <td style="text-align: center;">5</td>
            <td style="text-align: right;">Los Angeles (Rams) (55)</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>Elvis</td>
            <td style="text-align: center;">11</td>
            <td style="text-align: center;">5</td>
            <td style="text-align: right;">Los Angeles (Rams) (48)</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>Jennifer</td>
            <td style="text-align: center;">11</td>
            <td style="text-align: center;">5</td>
            <td style="text-align: right;">Los Angeles (Rams) (48)</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>Jessica</td>
            <td style="text-align: center;">11</td>
            <td style="text-align: center;">5</td>
            <td style="text-align: right;">New York (Giants) (27)</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>Lanny</td>
            <td style="text-align: center;">11</td>
            <td style="text-align: center;">5</td>
            <td style="text-align: right;">Los Angeles (Rams) (56)</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>Richard (Alumnus)</td>
            <td style="text-align: center;">11</td>
            <td style="text-align: center;">5</td>
            <td style="text-align: right;">Los Angeles (Rams) (48)</td>
          </tr>
          <tr>
            <td>#8</td>
            <td>Rudy (Alumnus)</td>
            <td style="text-align: center;">10</td>
            <td style="text-align: center;">6</td>
            <td style="text-align: right;">Los Angeles (Rams) (48)</td>
          </tr>
          <tr>
            <td>#8</td>
            <td>Trevor (3rd Gen)</td>
            <td style="text-align: center;">10</td>
            <td style="text-align: center;">6</td>
            <td style="text-align: right;">Los Angeles (Rams) (48)</td>
          </tr>
          <tr>
            <td>#10</td>
            <td>Brian</td>
            <td style="text-align: center;">9</td>
            <td style="text-align: center;">7</td>
            <td style="text-align: right;">Los Angeles (Rams) (52)</td>
          </tr>
          <tr>
            <td>#10</td>
            <td>Joel (Admin)</td>
            <td style="text-align: center;">9</td>
            <td style="text-align: center;">7</td>
            <td style="text-align: right;">Los Angeles (Rams) (49)</td>
          </tr>
          <tr>
            <td>#10</td>
            <td>Jordan (3rd Gen)</td>
            <td style="text-align: center;">9</td>
            <td style="text-align: center;">7</td>
            <td style="text-align: right;">Los Angeles (Rams) (48)</td>
          </tr>
          <tr>
            <td>#10</td>
            <td>Tyler</td>
            <td style="text-align: center;">9</td>
            <td style="text-align: center;">7</td>
            <td style="text-align: right;">New York (Giants) (58)</td>
          </tr>
          <tr>
            <td>#14</td>
            <td>Jeff</td>
            <td style="text-align: center; color: #991b1b;">6</td>
            <td style="text-align: center; color: #991b1b;">10</td>
            <td style="text-align: right;">New York (Giants) (35)</td>
          </tr>
          <tr>
            <td style="color: #94a3b8;">#15</td>
            <td style="color: #64748b;">Christine</td>
            <td style="text-align: center; color: #94a3b8;">-</td>
            <td style="text-align: center; color: #94a3b8;">-</td>
            <td style="text-align: right; color: #94a3b8; font-style: italic;">Inactive</td>
          </tr>
          <tr>
            <td style="color: #94a3b8;">#16</td>
            <td style="color: #64748b;">Kristine</td>
            <td style="text-align: center; color: #94a3b8;">-</td>
            <td style="text-align: center; color: #94a3b8;">-</td>
            <td style="text-align: right; color: #94a3b8; font-style: italic;">Inactive</td>
          </tr>
        </tbody>
      </table>

      <!-- 3rd Generation Legacy -->
      <h3>👑 3RD GENERATION ROYALTY: TREVOR & JORDAN</h3>
      <div class="highlight-box">
        <p>A special tip of the hat from Commissioner Emeritus Don to his grandsons, <strong>Trevor</strong> and <strong>Jordan</strong>. Carrying the Threet family football tradition into its third generation, both young gentlemen put together strong, respectable performances this week. Trevor posted an impressive 10-6 record while Jordan turned in a solid 9-7 effort. The Commish couldn't be prouder to see the legacy in such capable hands!</p>
      </div>

      <!-- Cellar Inspection & Admin Confessions -->
      <h3>🏚️ CELLAR INSPECTION & ADMIN CONFESSIONS</h3>
      <div class="roast-box">
        <p>Down in the lower quarters, <strong>Jeff</strong> (6-10) and <strong>Tyler</strong> (9-7) found out the hard way that picking with your heart instead of your head leads straight to cold soup. And let's not overlook your humble Admin, <strong>Joel</strong>, who stumbled into a mediocre 9-7 tie. It turns out running the pool software is much easier than picking actual football games!</p>
      </div>

      <!-- Don's Classic Quote Box -->
      <div class="quote-box">
        <p style="font-size: 11pt; color: #713f12; margin-bottom: 4pt;">
          "Winners Walk, Losers Stalk! Clarification: Any OBJECTION costs a dollar! I have spoken!"
        </p>
        <p style="font-size: 9.5pt; color: #854d0e; font-weight: bold; margin: 0; text-align: right;">
          — Don "The Consultant" Threet
        </p>
      </div>

      <!-- Rules Reminders -->
      <div style="background-color: #fafafa; border: 1pt solid #e2e8f0; padding: 10pt; margin-top: 14pt;">
        <h4 style="font-size: 10pt; color: #1b3a2b; margin-top: 0; margin-bottom: 4pt; font-weight: bold;">📋 Official Pool Rules</h4>
        <ul style="margin: 0; padding-left: 16pt; font-size: 9.5pt; color: #475569;">
          <li>Straight-up picks only: 1 point per win, 0 points per loss. No point spreads used for scoring.</li>
          <li>Monday Night tiebreaker: Applies solely to resolve a tie for 1st place rank.</li>
          <li>Scoring Integrity: All scores strictly reflect actual wins and losses; tiebreaker numbers do not add or subtract points from cumulative totals.</li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="footer-note">
        Branham Hills Legacy Football Pool &bull; 40 Years of Straight-Up Glory (1986–2026) &bull; Official Dispatch Record
      </div>
    </body>
    </html>
  `;

  // Create a Blob with Word MIME type application/msword
  const blob = new Blob(['\ufeff' + wordContent], {
    type: 'application/msword'
  });

  // Create download link and trigger browser download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Branham_Hills_Legacy_Pool_Week_${weekNum}_Dispatch.doc`;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 200);
}
