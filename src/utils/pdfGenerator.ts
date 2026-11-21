import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WeeklyDispatch, Game, Player, PlayerPickData } from '../types';
import { DISPATCH_EDITION_BADGES, getCanonicalDispatchTitle, resolveDispatchSlotType } from './dispatchTitles';

/**
 * Utility to generate a publication-grade 2-page PDF for Branham Hills Legacy Football Pool
 */
export async function generateDispatchPDF(
  dispatch: WeeklyDispatch,
  games: Game[] = [],
  players: Player[] = [],
  picks: Record<string, PlayerPickData> = {}
): Promise<void> {
  const weekNum = dispatch.weekNumber || 2;
  const dispatchDate = new Date(dispatch.publishedAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Create temporary container for Page 1
  const page1 = document.createElement('div');
  page1.style.width = '800px';
  page1.style.minHeight = '1130px'; // A4 proportional height at 800px width
  page1.style.padding = '32px 36px';
  page1.style.backgroundColor = '#ffffff';
  page1.style.fontFamily = 'Helvetica, Arial, sans-serif';
  page1.style.color = '#0f172a';
  page1.style.position = 'absolute';
  page1.style.left = '-9999px';
  page1.style.top = '0';
  page1.style.boxSizing = 'border-box';

  page1.innerHTML = `
    <div style="display: flex; flex-direction: column; justify-content: space-between; height: 1060px;">
      <div>
        <!-- Top Header with Upper-Left Gold Star Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1b3a2b; padding-bottom: 14px; margin-bottom: 18px;">
          <!-- Left Side: Gold Star Badge & Main Title -->
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="background: linear-gradient(135deg, #fef08a 0%, #eab308 100%); color: #713f12; border: 2px solid #ca8a04; width: 52px; height: 52px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.12); flex-shrink: 0;">
              <span style="font-size: 16px; line-height: 1;">⭐</span>
              <span style="font-size: 7px; font-weight: 900; text-transform: uppercase; margin-top: 1px; letter-spacing: -0.2px;">40th</span>
            </div>
            <div>
              <h1 style="margin: 0; font-size: 21px; font-weight: 900; color: #1b3a2b; letter-spacing: -0.3px; text-transform: uppercase;">
                BRANHAM HILLS LEGACY FOOTBALL POOL
              </h1>
              <h2 style="margin: 2px 0 0 0; font-size: 13px; font-weight: 800; color: #ca8a04; text-transform: uppercase; letter-spacing: 0.5px;">
                ${getCanonicalDispatchTitle(resolveDispatchSlotType(dispatch.type, dispatch.id) || 'tuesday', weekNum).toUpperCase()}
              </h2>
            </div>
          </div>

          <!-- Right Side: Dispatch Meta -->
          <div style="text-align: right; font-size: 10px; color: #475569; font-weight: 600;">
            <div style="background-color: #1b3a2b; color: #fde047; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-bottom: 4px;">
              ${DISPATCH_EDITION_BADGES[resolveDispatchSlotType(dispatch.type, dispatch.id) || 'tuesday']}
            </div>
            <div>Commish: Don "The Commish" Threet</div>
            <div>Admin: Joel Threet</div>
          </div>
        </div>

        <!-- Crew Chief Recap -->
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 900; color: #1b3a2b; text-transform: uppercase; letter-spacing: 0.3px; display: flex; align-items: center; gap: 6px;">
            <span style="color: #059669;">■</span> CREW CHIEF RECAP: THE SHAKEUP & THE CROWN
          </h3>
          <div style="font-size: 11px; line-height: 1.55; color: #1e293b; background-color: #f8fafc; border-left: 4px solid #1b3a2b; padding: 12px 14px; border-radius: 0 6px 6px 0;">
            <p style="margin: 0 0 8px 0;">
              If Week 1 was a warm-up, Week 2 was a full-blown reality check. The coffee is hot at the Crew Chief's desk this Tuesday morning, and the final tally reveals a brutal week for overconfident prognosticators. When the Rams finished off the Giants on Monday Night, the leaderboard underwent a seismic shift that left a trail of broken tiebreaker sheets in its wake.
            </p>
            <p style="margin: 0 0 8px 0;">
              Leading the charge into victory lane is pool newcomer <strong>Marcio</strong>, who put on a clinic with a slate-leading 12 wins (12-4). To storm into a 40-year-old pool as a rookie and immediately snatch the weekly crown from a room full of seasoned pool sharks is the ultimate flex.
            </p>
            <p style="margin: 0;">
              Meanwhile, keeping the pressure on near the top are two of our most distinguished pool alumni, <strong>Rudy</strong> and <strong>Richard</strong>. These gentlemen have been picking gridiron winners since leather helmets were standard issue, and their veteran instincts prove once again why experience never goes out of style.
            </p>
          </div>
        </div>

        <!-- Squeezed Table of Champions (All 16 Contenders Fit Squeezed on Page 1) -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 6px;">
            <h3 style="margin: 0; font-size: 13px; font-weight: 900; color: #1b3a2b; text-transform: uppercase; letter-spacing: 0.3px;">
              FINAL WEEK ${weekNum} STANDINGS & SCORES
            </h3>
            <span style="font-size: 10px; font-weight: 700; color: #059669;">100% Complete Roster</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
            <thead>
              <tr style="background-color: #1b3a2b; color: #ffffff; text-align: left;">
                <th style="padding: 5px 8px; font-weight: 800; width: 60px;">Rank</th>
                <th style="padding: 5px 8px; font-weight: 800; width: 140px;">Contender</th>
                <th style="padding: 5px 8px; font-weight: 800; text-align: center; width: 60px;">Wins</th>
                <th style="padding: 5px 8px; font-weight: 800; text-align: center; width: 60px;">Losses</th>
                <th style="padding: 5px 8px; font-weight: 800; text-align: right;">MNF Pick (Tiebreaker Total)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #fef9c3; font-weight: 800; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 4px 8px; color: #854d0e;">#1 👑</td>
                <td style="padding: 4px 8px; color: #713f12; font-weight: 900;">Marcio (Rookie)</td>
                <td style="padding: 4px 8px; text-align: center; color: #15803d; font-weight: 900;">12</td>
                <td style="padding: 4px 8px; text-align: center; color: #b91c1c;">4</td>
                <td style="padding: 4px 8px; text-align: right; color: #854d0e;">Los Angeles (Rams) (45)</td>
              </tr>
              <tr style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#2</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Don (Commish)</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">11</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">5</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (55)</td>
              </tr>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#2</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Elvis</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">11</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">5</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (48)</td>
              </tr>
              <tr style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#2</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Jennifer</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">11</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">5</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (48)</td>
              </tr>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#2</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Jessica</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">11</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">5</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">New York (Giants) (27)</td>
              </tr>
              <tr style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#2</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Lanny</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">11</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">5</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (56)</td>
              </tr>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#2</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Richard (Alumnus)</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">11</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">5</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (48)</td>
              </tr>
              <tr style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#8</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Rudy (Alumnus)</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">10</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">6</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (48)</td>
              </tr>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#8</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Trevor (3rd Gen)</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">10</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">6</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (48)</td>
              </tr>
              <tr style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#10</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Brian</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">9</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">7</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (52)</td>
              </tr>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#10</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Joel (Admin)</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">9</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">7</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (49)</td>
              </tr>
              <tr style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#10</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Jordan (3rd Gen)</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">9</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">7</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">Los Angeles (Rams) (48)</td>
              </tr>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #334155;">#10</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Tyler</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700;">9</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #64748b;">7</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">New York (Giants) (58)</td>
              </tr>
              <tr style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 700; color: #991b1b;">#14</td>
                <td style="padding: 3.5px 8px; font-weight: 700; color: #0f172a;">Jeff</td>
                <td style="padding: 3.5px 8px; text-align: center; font-weight: 700; color: #991b1b;">6</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #991b1b; font-weight: 800;">10</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #475569;">New York (Giants) (35)</td>
              </tr>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 3.5px 8px; font-weight: 600; color: #94a3b8;">#15</td>
                <td style="padding: 3.5px 8px; font-weight: 600; color: #64748b;">Christine</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #94a3b8;">-</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #94a3b8;">-</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #94a3b8; font-style: italic;">Inactive</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="padding: 3.5px 8px; font-weight: 600; color: #94a3b8;">#16</td>
                <td style="padding: 3.5px 8px; font-weight: 600; color: #64748b;">Kristine</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #94a3b8;">-</td>
                <td style="padding: 3.5px 8px; text-align: center; color: #94a3b8;">-</td>
                <td style="padding: 3.5px 8px; text-align: right; color: #94a3b8; font-style: italic;">Inactive</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Page 1 Footer -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; font-size: 9.5px; color: #64748b;">
        <div>Branham Hills Legacy Football Pool • 40 Years of Straight-Up Glory (1986–2026)</div>
        <div style="font-weight: 700;">Page 1</div>
      </div>
    </div>
  `;

  // Create temporary container for Page 2
  const page2 = document.createElement('div');
  page2.style.width = '800px';
  page2.style.minHeight = '1130px';
  page2.style.padding = '32px 36px';
  page2.style.backgroundColor = '#ffffff';
  page2.style.fontFamily = 'Helvetica, Arial, sans-serif';
  page2.style.color = '#0f172a';
  page2.style.position = 'absolute';
  page2.style.left = '-9999px';
  page2.style.top = '0';
  page2.style.boxSizing = 'border-box';

  page2.innerHTML = `
    <div style="display: flex; flex-direction: column; justify-content: space-between; height: 1060px;">
      <div>
        <!-- Page 2 Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1b3a2b; padding-bottom: 12px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background-color: #1b3a2b; color: #fde047; font-size: 11px; font-weight: 900; padding: 4px 8px; border-radius: 4px;">
              DISPATCH PAGE 2
            </div>
            <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #1b3a2b; text-transform: uppercase;">
              BRANHAM HILLS LEGACY DISPATCH & INSIGHTS
            </h2>
          </div>
          <div style="font-size: 10px; color: #64748b; font-weight: 700;">
            WEEK ${weekNum} OFFICIAL RECORD
          </div>
        </div>

        <!-- 3rd Generation Legacy Section -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 900; color: #1b3a2b; text-transform: uppercase; letter-spacing: 0.3px;">
            👑 3rd Generation Royalty: Trevor & Jordan
          </h3>
          <div style="font-size: 11.5px; line-height: 1.6; color: #1e293b; background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 16px; border-radius: 0 6px 6px 0;">
            A special tip of the hat from Commissioner Emeritus Don to his grandsons, <strong>Trevor</strong> and <strong>Jordan</strong>. Carrying the Threet family football tradition into its third generation, both young gentlemen put together strong, respectable performances this week. Trevor posted an impressive 10-6 record while Jordan turned in a solid 9-7 effort. The Commish couldn't be prouder to see the legacy in such capable hands!
          </div>
        </div>

        <!-- Cellar Dwellers & Admin Self-Roast -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 900; color: #1b3a2b; text-transform: uppercase; letter-spacing: 0.3px;">
            🏚️ Cellar Inspection & Admin Confessions
          </h3>
          <div style="font-size: 11.5px; line-height: 1.6; color: #1e293b; background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 16px; border-radius: 0 6px 6px 0;">
            Down in the lower quarters, <strong>Jeff</strong> (6-10) and <strong>Tyler</strong> (9-7) found out the hard way that picking with your heart instead of your head leads straight to cold soup. And let's not overlook your humble Admin, <strong>Joel</strong>, who stumbled into a mediocre 9-7 tie. It turns out running the pool software is much easier than picking actual football games!
          </div>
        </div>

        <!-- Monday Night Recap & Week 3 Teaser -->
        <div style="margin-bottom: 22px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 900; color: #1b3a2b; text-transform: uppercase; letter-spacing: 0.3px;">
            🏈 Monday Night Collision & Week 3 Outlook
          </h3>
          <div style="font-size: 11.5px; line-height: 1.6; color: #1e293b; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px;">
            Monday Night saw the Los Angeles Rams control the trenches in a 31-13 victory over New York, sealing the deal for Marcio's weekly crown. Take heart, contenders: Week 3 sheets hit the wire on Wednesday—16 new matchups, a completely fresh slate, and 16 points up for grabs.
          </div>
        </div>

        <!-- Don's Classic Quote Box -->
        <div style="margin-bottom: 22px; background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border: 2px solid #ca8a04; border-radius: 8px; padding: 16px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #713f12; font-style: italic; line-height: 1.5; text-align: center;">
            "Winners Walk, Losers Stalk! Clarification: Any OBJECTION costs a dollar! I have spoken!"
          </p>
          <p style="margin: 0; font-size: 11px; font-weight: 900; color: #854d0e; text-align: right; text-transform: uppercase;">
            — Don "The Consultant" Threet
          </p>
        </div>

        <!-- Pool Rule Reminders -->
        <div style="background-color: #fafafa; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px;">
          <h4 style="margin: 0 0 6px 0; font-size: 11px; font-weight: 900; color: #1b3a2b; text-transform: uppercase;">
            📋 Official Pool Rule Reminders
          </h4>
          <ul style="margin: 0; padding-left: 18px; font-size: 10.5px; color: #475569; line-height: 1.5;">
            <li><strong>Straight-up picks only:</strong> 1 point per win, 0 points per loss. No point spreads used for scoring.</li>
            <li><strong>Monday Night tiebreaker:</strong> Applies solely to resolve a tie for 1st place rank.</li>
            <li><strong>Scoring Integrity:</strong> All scores strictly reflect actual wins and losses; tiebreaker numbers do not add or subtract points from cumulative totals.</li>
          </ul>
        </div>
      </div>

      <!-- Page 2 Footer -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; font-size: 9.5px; color: #64748b;">
        <div>Branham Hills Legacy Football Pool • 40 Years of Straight-Up Glory (1986–2026)</div>
        <div style="font-weight: 700;">Page 2</div>
      </div>
    </div>
  `;

  document.body.appendChild(page1);
  document.body.appendChild(page2);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Render Page 1
    const canvas1 = await html2canvas(page1, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    const imgData1 = canvas1.toDataURL('image/png');
    pdf.addImage(imgData1, 'PNG', 0, 0, 210, 297);

    // Render Page 2
    const canvas2 = await html2canvas(page2, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    const imgData2 = canvas2.toDataURL('image/png');
    pdf.addPage();
    pdf.addImage(imgData2, 'PNG', 0, 0, 210, 297);

    pdf.save(`Branham_Hills_Legacy_Pool_Week_${weekNum}_Dispatch.pdf`);
  } catch (err) {
    console.error('Error generating PDF:', err);
    window.print();
  } finally {
    if (document.body.contains(page1)) document.body.removeChild(page1);
    if (document.body.contains(page2)) document.body.removeChild(page2);
  }
}
