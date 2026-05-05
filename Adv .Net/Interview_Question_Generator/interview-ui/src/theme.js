import { createTheme } from "@mui/material/styles";

// ══════════════════════════════════════════════════════════════
// NEURAL CIRCUIT — AI Theme  (Readability Update v2)
// ──────────────────────────────────────────────────────────────
// Base:      Deep cosmic navy  #030712 → #060d1f
// Primary:   Electric cyan-blue #22d3ee / #06b6d4
// Secondary: Vivid magenta     #e879f9 / #d946ef
// Accent:    Neon violet       #818cf8 / #6366f1
// ──────────────────────────────────────────────────────────────
// Add to index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
// ══════════════════════════════════════════════════════════════

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main:  "#22d3ee",
      light: "#67e8f9",
      dark:  "#0891b2",
    },
    secondary: {
      main:  "#d946ef",
      light: "#e879f9",
      dark:  "#a21caf",
    },
    background: {
      default: "#030712",
      paper:   "#0a1628",
    },
    text: {
      primary:   "#e0f2fe",
      secondary: "#7dd3fc",
    },
    info:    { main: "#818cf8" },
    success: { main: "#34d399" },
    warning: { main: "#fb923c" },
    error:   { main: "#f87171" },
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: "'Exo 2', sans-serif",

    // ── Headings ───────────────────────────────────────────────
    h1: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 900,
      fontSize: "3.2rem",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 900,
      fontSize: "2.6rem",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 900,
      fontSize: "2.2rem",
      letterSpacing: "-0.018em",
      lineHeight: 1.15,
    },
    h4: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 800,
      fontSize: "1.75rem",
      letterSpacing: "-0.015em",
    },
    h5: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 700,
      fontSize: "1.35rem",
      letterSpacing: "-0.01em",
    },
    h6: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 700,
      fontSize: "1.1rem",
    },

    // ── Body — bumped up for eye comfort ───────────────────────
    body1: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 400,
      fontSize: "1rem",            // ↑ was 0.95rem
      lineHeight: 1.75,
      color: "#7dd3fc",
    },
    body2: {
      fontFamily: "'Exo 2', sans-serif",
      fontSize: "0.925rem",        // ↑ was 0.85rem
      lineHeight: 1.65,
      color: "#7dd3fc",
    },

    // ── Subtitles ──────────────────────────────────────────────
    subtitle1: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 600,
      fontSize: "1.05rem",         // ↑ was 1rem
      color: "#e0f2fe",
    },
    subtitle2: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 600,
      fontSize: "0.95rem",
      color: "#e0f2fe",
    },

    // ── Mono labels — Share Tech Mono ──────────────────────────
    caption: {
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.8rem",          // ↑ was 0.7rem  (+14%)
      letterSpacing: "0.1em",
      color: "#22d3ee",
    },
    overline: {
      fontFamily: "'Share Tech Mono', monospace",
      letterSpacing: "0.2em",
      fontSize: "0.75rem",         // ↑ was 0.65rem  (+15%)
      color: "#22d3ee",
      textTransform: "uppercase",
    },

    // ── Buttons ────────────────────────────────────────────────
    button: {
      fontFamily: "'Exo 2', sans-serif",
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontSize: "0.9rem",          // ↑ was 0.82rem  (+10%)
    },
  },

  components: {
    // ── Cards ──────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, #0d1f3c 0%, #0a1628 60%, #070f1e 100%)",
          border: "1px solid rgba(34,211,238,0.15)",
          boxShadow: `
            0 4px 24px rgba(0,0,0,0.7),
            0 0 0 1px rgba(34,211,238,0.05),
            inset 0 1px 0 rgba(34,211,238,0.08)
          `,
          backdropFilter: "blur(14px)",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0,
            width: 28, height: 28,
            borderTop: "1.5px solid rgba(34,211,238,0.5)",
            borderLeft: "1.5px solid rgba(34,211,238,0.5)",
            borderRadius: "2px 0 0 0",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0, right: 0,
            width: 28, height: 28,
            borderBottom: "1.5px solid rgba(217,70,239,0.4)",
            borderRight: "1.5px solid rgba(217,70,239,0.4)",
            borderRadius: "0 0 2px 0",
          },
          "&:hover": {
            borderColor: "rgba(34,211,238,0.45)",
            boxShadow: `
              0 16px 48px rgba(34,211,238,0.12),
              0 0 60px rgba(217,70,239,0.08),
              0 0 0 1px rgba(34,211,238,0.2),
              inset 0 1px 0 rgba(34,211,238,0.12)
            `,
            transform: "translateY(-4px)",
          },
        },
      },
    },

    // ── Buttons ────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontFamily: "'Exo 2', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.08em",
          padding: "11px 28px",    // ↑ was 10px 26px — taller tap target
          fontSize: "0.9rem",      // ↑ was 0.82rem
          position: "relative",
          overflow: "hidden",
          transition: "all 0.28s",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
            opacity: 0,
            transition: "opacity 0.25s",
          },
          "&:hover::before": { opacity: 1 },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #0891b2 0%, #22d3ee 50%, #06b6d4 100%)",
          color: "#030712",
          fontWeight: 800,
          boxShadow: "0 4px 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.2)",
          "&:hover": {
            background: "linear-gradient(135deg, #22d3ee 0%, #67e8f9 100%)",
            boxShadow: "0 8px 32px rgba(34,211,238,0.7), 0 0 60px rgba(34,211,238,0.3)",
            transform: "translateY(-2px)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #a21caf 0%, #d946ef 50%, #e879f9 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(217,70,239,0.5), 0 0 40px rgba(217,70,239,0.2)",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(217,70,239,0.7), 0 0 60px rgba(217,70,239,0.3)",
            transform: "translateY(-2px)",
          },
        },
        outlinedPrimary: {
          border: "1px solid rgba(34,211,238,0.45)",
          color: "#22d3ee",
          background: "rgba(34,211,238,0.05)",
          "&:hover": {
            border: "1px solid rgba(34,211,238,0.8)",
            background: "rgba(34,211,238,0.12)",
            boxShadow: "0 0 20px rgba(34,211,238,0.25)",
          },
        },
      },
    },

    // ── Icon Buttons ───────────────────────────────────────────
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#22d3ee",
          transition: "all 0.22s",
          "&:hover": {
            background: "rgba(34,211,238,0.12)",
            color: "#67e8f9",
            transform: "scale(1.12)",
            boxShadow: "0 0 16px rgba(34,211,238,0.4)",
          },
        },
      },
    },

    // ── Input / TextField ──────────────────────────────────────
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "0.975rem",    // ↑ was 0.9rem
          background: "rgba(34,211,238,0.04)",
          border: "1px solid rgba(34,211,238,0.2)",
          borderRadius: "8px",
          color: "#e0f2fe",
          transition: "all 0.25s",
          "&:hover": {
            borderColor: "rgba(34,211,238,0.45)",
            background: "rgba(34,211,238,0.07)",
          },
          "&.Mui-focused": {
            borderColor: "#22d3ee",
            background: "rgba(34,211,238,0.08)",
            boxShadow: "0 0 0 3px rgba(34,211,238,0.15), 0 0 20px rgba(34,211,238,0.1)",
          },
        },
      },
    },

    // ── Input Label ────────────────────────────────────────────
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "0.95rem",     // ↑ was implicit ~0.875rem
          color: "#7dd3fc",
          "&.Mui-focused": { color: "#22d3ee" },
        },
      },
    },

    // ── Select Menu Items ──────────────────────────────────────
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "0.95rem",     // ↑ was implicit ~0.875rem
          lineHeight: 1.6,
          paddingTop: "10px",
          paddingBottom: "10px",
        },
      },
    },

    // ── Chip ───────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.08em",
          fontSize: "0.75rem",     // ↑ was 0.68rem  (+10%)
          height: 28,              // ↑ was 26
          background: "rgba(34,211,238,0.1)",
          border: "1px solid rgba(34,211,238,0.3)",
          color: "#22d3ee",
          "&:hover": { background: "rgba(34,211,238,0.2)" },
        },
        colorSecondary: {
          background: "rgba(217,70,239,0.1)",
          border: "1px solid rgba(217,70,239,0.3)",
          color: "#e879f9",
        },
      },
    },

    // ── Table cells ────────────────────────────────────────────
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "0.95rem",     // ↑ was ~0.875rem
        },
        head: {
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.78rem",     // ↑ was ~0.7rem
          letterSpacing: "0.1em",
          color: "#22d3ee",
          fontWeight: 700,
        },
      },
    },

    // ── Divider ────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(34,211,238,0.12)",
          "&::before, &::after": { borderColor: "rgba(34,211,238,0.12)" },
        },
      },
    },

    // ── Tooltip ────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#0d1f3c",
          border: "1px solid rgba(34,211,238,0.25)",
          color: "#e0f2fe",
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "0.875rem",    // ↑ was 0.78rem
          lineHeight: 1.5,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          padding: "8px 12px",
        },
      },
    },

    // ── Dialog ─────────────────────────────────────────────────
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "1.15rem",     // ↑ was ~1rem
          fontWeight: 700,
          color: "#e0f2fe",
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "0.975rem",    // ↑ was ~0.875rem
          color: "#7dd3fc",
          lineHeight: 1.7,
        },
      },
    },

    // ── List items ─────────────────────────────────────────────
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "0.975rem",    // ↑ was ~0.875rem
        },
        secondary: {
          fontFamily: "'Exo 2', sans-serif",
          fontSize: "0.875rem",
          color: "#7dd3fc",
        },
      },
    },

    // ── Global CSS ─────────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html {
          font-size: 18px;
        }

        body {
          background: #030712;
          font-size: 1rem;
          background-image:
            radial-gradient(ellipse 70% 55% at 50% 0%,   rgba(34,211,238,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 55% 45% at 85% 55%,  rgba(217,70,239,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 10% 75%,  rgba(99,102,241,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 100% 80% at 50% 100%, rgba(34,211,238,0.06) 0%, transparent 60%);
          background-attachment: fixed;
        }

        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(34,211,238,0.12) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }

        body::after {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
          z-index: 0;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #22d3ee, #d946ef);
          border-radius: 99px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #67e8f9, #e879f9);
        }

        ::selection {
          background: rgba(34,211,238,0.3);
          color: #ffffff;
        }

        .neon-cyan  { color: #22d3ee; text-shadow: 0 0 10px #22d3ee, 0 0 30px #22d3ee80; }
        .neon-pink  { color: #e879f9; text-shadow: 0 0 10px #e879f9, 0 0 30px #e879f980; }
        .neon-violet{ color: #818cf8; text-shadow: 0 0 10px #818cf8, 0 0 30px #818cf880; }
      `,
    },
  },
});

export default theme;
// import { createTheme } from "@mui/material/styles";

// // ── Cosmic Dusk — balanced mid-dark, big readable type, warm violet + teal ──
// // Base: #111827 (warm dark navy, not pitch black)
// // Primary: #818cf8 (soft indigo — easy on eyes)
// // Accent: #34d399 (emerald), #f472b6 (rose), #fb923c (orange)
// // Fonts: Lexend (display, very readable) + Inter Tight (body)
// // Add to index.html <head>:
// // <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@600;700;800;900&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet"/>

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary:    { main: "#818cf8" },       // soft indigo
//     secondary:  { main: "#34d399" },       // emerald
//     background: {
//       default: "#062c7e",                  // warm dark navy — comfortable mid-dark
//       paper:   "#1f2937",                  // elevated card
//     },
//     text: {
//       primary:   "#f9fafb",                // near-white — very readable
//       secondary: "#9ca3af",                // medium grey — visible secondary
//     },
//     info:    { main: "#38bdf8" },
//     success: { main: "#34d399" },
//     warning: { main: "#fb923c" },
//     error:   { main: "#f87171" },
//   },
//   shape: { borderRadius: 14 },
//   typography: {
//     fontFamily: "'Inter Tight', sans-serif",
//     h3: { fontWeight: 900, fontFamily: "'Lexend', sans-serif", letterSpacing: "-0.03em", fontSize: "2.4rem" },
//     h4: { fontWeight: 800, fontFamily: "'Lexend', sans-serif", letterSpacing: "-0.025em", fontSize: "2rem" },
//     h5: { fontWeight: 700, fontFamily: "'Lexend', sans-serif", letterSpacing: "-0.02em", fontSize: "1.4rem" },
//     h6: { fontWeight: 700, fontFamily: "'Lexend', sans-serif", fontSize: "1.1rem" },
//     body1: { fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: "0.95rem", lineHeight: 1.6 },
//     body2: { fontFamily: "'Inter Tight', sans-serif", fontSize: "0.85rem", lineHeight: 1.5 },
//     subtitle1: { fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: "1rem" },
//     caption: { fontFamily: "'Inter Tight', sans-serif", letterSpacing: "0.06em", fontSize: "0.72rem" },
//     button: { fontFamily: "'Lexend', sans-serif", fontWeight: 700, letterSpacing: "0.04em" },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           background: "linear-gradient(145deg, #1f2937 0%, #1a2030 100%)",
//           border: "1px solid rgba(129,140,248,0.15)",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
//           backdropFilter: "blur(10px)",
//           transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
//           "&:hover": {
//             borderColor: "rgba(129,140,248,0.4)",
//             boxShadow: "0 12px 40px rgba(129,140,248,0.18)",
//             transform: "translateY(-3px)",
//           },
//         },
//       },
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           color: "#818cf8",
//           transition: "all 0.22s",
//           "&:hover": {
//             background: "rgba(129,140,248,0.14)",
//             transform: "scale(1.1)",
//           },
//         },
//       },
//     },
//     MuiCssBaseline: {
//       styleOverrides: `
//         @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@600;700;800;900&family=Inter+Tight:wght@400;500;600;700&display=swap');
//         * { box-sizing: border-box; }
//         body { background: #111827; }
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-track { background: #111827; }
//         ::-webkit-scrollbar-thumb { background: rgba(129,140,248,0.35); border-radius: 99px; }
//         ::-webkit-scrollbar-thumb:hover { background: rgba(129,140,248,0.6); }
//         ::selection { background: rgba(129,140,248,0.35); color: #f9fafb; }
//       `,
//     },
//   },
// });

// export default theme;
// import { createTheme } from "@mui/material/styles";

// // ── Proxima Dark — inspired by the reference image ──
// // Base: near-black deep purple #0d0b14
// // Primary: electric violet #8b5cf6
// // Accent: bright purple #a855f7, magenta glow #c026d3
// // Cards: dark grape #13101f / #1a1528
// // Add to index.html <head>:
// // <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet"/>

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary:    { main: "#8b5cf6" },        // electric violet
//     secondary:  { main: "#a855f7" },        // bright purple
//     background: {
//       default: "#0d0b14",                   // near-black deep purple
//       paper:   "#13101f",                   // dark grape card
//     },
//     text: {
//       primary:   "#f1f0f9",                 // near-white lavender
//       secondary: "#6b7280",                 // muted cool grey
//     },
//     info:    { main: "#06b6d4" },           // cyan
//     success: { main: "#10b981" },           // emerald
//     warning: { main: "#f59e0b" },
//     error:   { main: "#ef4444" },
//     // Custom design tokens accessible via theme
//     violet: { light: "#c4b5fd", main: "#8b5cf6", dark: "#6d28d9" },
//   },
//   shape: { borderRadius: 12 },
//   typography: {
//     fontFamily: "'Manrope', sans-serif",
//     h4: { fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" },
//     h5: { fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.015em" },
//     h6: { fontWeight: 700, fontFamily: "'Manrope', sans-serif" },
//     body1: { fontFamily: "'Manrope', sans-serif", fontWeight: 500 },
//     body2: { fontFamily: "'Manrope', sans-serif", fontSize: "0.82rem" },
//     caption: { fontFamily: "'Manrope', sans-serif", letterSpacing: "0.04em" },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           background: "linear-gradient(145deg, #1a1528 0%, #13101f 100%)",
//           border: "1px solid rgba(139,92,246,0.12)",
//           boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
//           backdropFilter: "blur(12px)",
//           transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
//           "&:hover": {
//             borderColor: "rgba(139,92,246,0.35)",
//             boxShadow: "0 8px 40px rgba(139,92,246,0.15)",
//             transform: "translateY(-2px)",
//           },
//         },
//       },
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           color: "#8b5cf6",
//           transition: "all 0.2s",
//           "&:hover": { background: "rgba(139,92,246,0.12)", transform: "scale(1.1)" },
//         },
//       },
//     },
//     MuiCssBaseline: {
//       styleOverrides: `
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
//         * { box-sizing: border-box; }
//         body { background: #0d0b14; }
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-track { background: #0d0b14; }
//         ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 99px; }
//         ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.55); }
//       `,
//     },
//   },
// });

// export default theme;
// import { createTheme } from "@mui/material/styles";

// // ── Deep Space Twilight ──
// // Base: rich slate-indigo (#141428) — eye-comfortable mid-dark
// // Primary: warm violet #a78bfa
// // Accent: soft teal #2dd4bf, amber #fbbf24
// // Fonts: Syne (display) + Nunito (body)
// // Add to index.html:
// // <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet"/>

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary:    { main: "#a78bfa" },   // warm violet — soft, not harsh
//     secondary:  { main: "#2dd4bf" },   // teal
//     background: {
//       default: "#141428",              // deep slate-indigo (not black)
//       paper:   "#1e1e38",              // elevated panels
//     },
//     text: {
//       primary:   "#ede9fe",            // lavender-white — very readable
//       secondary: "#94a3b8",            // cool slate
//     },
//     info:    { main: "#38bdf8" },      // sky blue
//     success: { main: "#34d399" },      // emerald
//     warning: { main: "#fbbf24" },      // amber
//     error:   { main: "#f87171" },
//   },
//   shape: { borderRadius: 14 },
//   typography: {
//     fontFamily: "'Nunito', sans-serif",
//     h4: { fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em" },
//     h5: { fontWeight: 700, fontFamily: "'Syne', sans-serif" },
//     h6: { fontWeight: 700, fontFamily: "'Syne', sans-serif" },
//     body1: { fontFamily: "'Nunito', sans-serif", fontWeight: 500 },
//     body2: { fontFamily: "'Nunito', sans-serif" },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           background: "linear-gradient(145deg, #1e1e3f 0%, #181830 100%)",
//           border: "1px solid rgba(167,139,250,0.12)",
//           boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
//           backdropFilter: "blur(12px)",
//         },
//       },
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           color: "#a78bfa",
//           transition: "all 0.2s ease",
//           "&:hover": {
//             background: "rgba(167,139,250,0.12)",
//             transform: "scale(1.08)",
//           },
//         },
//       },
//     },
//     MuiCssBaseline: {
//       styleOverrides: `
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-track { background: #141428; }
//         ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.3); border-radius: 3px; }
//         ::-webkit-scrollbar-thumb:hover { background: rgba(167,139,250,0.55); }
//       `,
//     },
//   },
// });

// export default theme;

// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary:    { main: "#e040fb" },        // vivid magenta
//     secondary:  { main: "#7c4dff" },        // electric violet
//     background: { default: "#08081a", paper: "#13132b" },
//     text:       { primary: "#03031a", secondary: "#9999cc" },
//     info:       { main: "#00e5ff" },        // cyan accent
//     success:    { main: "#69ffda" },
//   },
//   shape: { borderRadius: 16 },
//   typography: {
//     // Add to index.html <head>:
//     // <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet"/>
//     fontFamily: "'Rajdhani', sans-serif",
//     h4: { fontWeight: 800, letterSpacing: "0.04em", fontFamily: "'Orbitron', sans-serif" },
//     h5: { fontWeight: 700, letterSpacing: "0.03em", fontFamily: "'Orbitron', sans-serif" },
//     h6: { fontWeight: 600, fontFamily: "'Orbitron', sans-serif" },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           background: "linear-gradient(135deg, #48489a 0%, #4343b4 100%)",
//           border: "1px solid rgba(224,64,251,0.15)",
//           boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
//           backdropFilter: "blur(10px)",
//         },
//       },
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           color: "#e040fb",
//           "&:hover": { background: "rgba(224,64,251,0.12)" },
//         },
//       },
//     },
//     MuiCssBaseline: {
//       styleOverrides: `
//         ::-webkit-scrollbar { width: 6px; }
//         ::-webkit-scrollbar-track { background: #424297; }
//         ::-webkit-scrollbar-thumb { background: #e040fb55; border-radius: 3px; }
//       `,
//     },
//   },
// });

// export default theme;