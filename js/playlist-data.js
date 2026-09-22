/**
 * GATE Aptitude Playlist Data & Structure
 * Playlist: Amit Khurana - Aptitude for GATE CS/IT
 * Playlist ID: PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS
 * Total Videos: 84 (sourced directly from YouTube, Sep 2026)
 */

const DEFAULT_PLAYLIST_ID = 'PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS';
const LECTURES_PER_DAY = 4;

// Comprehensive curriculum structure for the playlist
// All 84 real videos from: https://youtube.com/playlist?list=PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS
const PLAYLIST_DATA = [

  // ── Day 1: Syllabus, Number System Basics ──────────────────────────────────
  {
    id: 'vid_1', index: 1, day: 1,
    title: 'Syllabus of Aptitude for GATE',
    topic: 'Orientation & Syllabus',
    duration: 600,
    youtubeId: 'p1ux1j0bRWA', playlistIndex: 0
  },
  {
    id: 'vid_2', index: 2, day: 1,
    title: 'Aptitude | Number System | Number Of Factors | Concept/Tricks/Types | #1',
    topic: 'Number System',
    duration: 2700,
    youtubeId: '58_Sq6N65Jk', playlistIndex: 1
  },
  {
    id: 'vid_3', index: 3, day: 1,
    title: 'Number System - 2, Factorial | Lec 2 | General Aptitude | GATE/ESE 2023',
    topic: 'Number System',
    duration: 2700,
    youtubeId: 'OO3_KCw-Dis', playlistIndex: 2
  },
  {
    id: 'vid_4', index: 4, day: 1,
    title: 'Number System | Factors | LCM HCF | GATE Aptitude | Lec 3',
    topic: 'Number System',
    duration: 2700,
    youtubeId: '22bDENaB1Lc', playlistIndex: 3
  },

  // ── Day 2: Number System continued ────────────────────────────────────────
  {
    id: 'vid_5', index: 5, day: 2,
    title: 'Number System | Remainder | GATE Aptitude | Lec 4',
    topic: 'Number System',
    duration: 2700,
    youtubeId: 'D2eizMH6u0k', playlistIndex: 4
  },
  {
    id: 'vid_6', index: 6, day: 2,
    title: 'Number System | Cyclicity | GATE Aptitude | Lec 5',
    topic: 'Number System',
    duration: 2700,
    youtubeId: 'p3ymqQ0RtXI', playlistIndex: 5
  },
  {
    id: 'vid_7', index: 7, day: 2,
    title: 'Number System | Divisibility Rules | GATE Aptitude | Lec 6',
    topic: 'Number System',
    duration: 2700,
    youtubeId: 'hDJHQxYk_i0', playlistIndex: 6
  },
  {
    id: 'vid_8', index: 8, day: 2,
    title: 'Number System | Base Conversion | GATE Aptitude | Lec 7',
    topic: 'Number System',
    duration: 2700,
    youtubeId: 'E6KUW9E8YnY', playlistIndex: 7
  },

  // ── Day 3: Number System + Calendar ───────────────────────────────────────
  {
    id: 'vid_9', index: 9, day: 3,
    title: 'Number System Practice Questions | GATE Aptitude',
    topic: 'Number System',
    duration: 2700,
    youtubeId: 'UcBh_OfL0nE', playlistIndex: 8
  },
  {
    id: 'vid_10', index: 10, day: 3,
    title: 'Calendar | Calendar Problem Tricks | Aptitude for GATE | Part 1',
    topic: 'Calendar',
    duration: 2700,
    youtubeId: 'KS-8elEEcz4', playlistIndex: 9
  },
  {
    id: 'vid_11', index: 11, day: 3,
    title: 'Calendar | Calendar Problem Tricks | Reasoning/Concept/Problems | Part 2',
    topic: 'Calendar',
    duration: 2700,
    youtubeId: 'uVnd48hTx_I', playlistIndex: 10
  },
  {
    id: 'vid_12', index: 12, day: 3,
    title: 'Logarithms - Basics | What are Logs? | Logarithm in Aptitude | Part 1',
    topic: 'Logarithms',
    duration: 2700,
    youtubeId: 'HzksdNZLgi4', playlistIndex: 11
  },

  // ── Day 4: Logarithms + AP/GP ──────────────────────────────────────────────
  {
    id: 'vid_13', index: 13, day: 4,
    title: 'Logarithms - Basics | What are Logs? | Logarithm in Aptitude | Part 2',
    topic: 'Logarithms',
    duration: 2700,
    youtubeId: 'Vj5Mj5yZnbo', playlistIndex: 12
  },
  {
    id: 'vid_14', index: 14, day: 4,
    title: 'Arithmetic Progression & Geometric Progression | AP and GP | Part 1 | GATE 2023',
    topic: 'Sequences & Series',
    duration: 2700,
    youtubeId: 'hI3aWy42-Y8', playlistIndex: 13
  },
  {
    id: 'vid_15', index: 15, day: 4,
    title: 'Arithmetic Progression & Geometric Progression | AP and GP | Part 2 | GATE 2023',
    topic: 'Sequences & Series',
    duration: 2700,
    youtubeId: 'srKDOjV6yvA', playlistIndex: 14
  },
  {
    id: 'vid_16', index: 16, day: 4,
    title: 'Arithmetic Progression & Geometric Progression | AP and GP | Part 3 | GATE 2023',
    topic: 'Sequences & Series',
    duration: 2700,
    youtubeId: 'ttQ6taiAn0A', playlistIndex: 15
  },

  // ── Day 5: Quadratic Equations + Practice ──────────────────────────────────
  {
    id: 'vid_17', index: 17, day: 5,
    title: 'Quadratic Equation in Aptitude for GATE | GATE 2023',
    topic: 'Algebra',
    duration: 2700,
    youtubeId: 'sg-0o8M1i84', playlistIndex: 16
  },
  {
    id: 'vid_18', index: 18, day: 5,
    title: 'Quadratic Equation in Aptitude for GATE | Practice Questions | GATE 2023',
    topic: 'Algebra',
    duration: 2700,
    youtubeId: '4H4lRm4w-SA', playlistIndex: 17
  },
  {
    id: 'vid_19', index: 19, day: 5,
    title: 'Practice Questions in Aptitude for GATE | GATE 2023',
    topic: 'Mixed Practice',
    duration: 2700,
    youtubeId: 'aS6uj3AbUnQ', playlistIndex: 18
  },
  {
    id: 'vid_20', index: 20, day: 5,
    title: 'Introduction to Averages in Aptitude for GATE | GATE 2023 Part 1',
    topic: 'Averages',
    duration: 2700,
    youtubeId: 'PYpPVM3XKaA', playlistIndex: 19
  },

  // ── Day 6: Averages + Percentages ──────────────────────────────────────────
  {
    id: 'vid_21', index: 21, day: 6,
    title: 'Introduction to Averages in Aptitude for GATE | GATE 2023 | Part 2',
    topic: 'Averages',
    duration: 2700,
    youtubeId: 'NEH_dBaXh1Y', playlistIndex: 20
  },
  {
    id: 'vid_22', index: 22, day: 6,
    title: 'Averages | Standard Deviation | Mean | Median | Mode | GATE 2023 Part 3',
    topic: 'Averages & Statistics',
    duration: 2700,
    youtubeId: 'j5Nyzmpu_2Q', playlistIndex: 21
  },
  {
    id: 'vid_23', index: 23, day: 6,
    title: 'Percentages | General Aptitude | GATE 2023 | Part 1',
    topic: 'Percentages',
    duration: 2700,
    youtubeId: 'O39uUviWPrU', playlistIndex: 22
  },
  {
    id: 'vid_24', index: 24, day: 6,
    title: 'Percentages | General Aptitude | GATE 2023 | Part 2',
    topic: 'Percentages',
    duration: 2700,
    youtubeId: 'P4SkJ5U7NFc', playlistIndex: 23
  },

  // ── Day 7: Percentages + Ratio & Proportion ────────────────────────────────
  {
    id: 'vid_25', index: 25, day: 7,
    title: 'Percentages | General Aptitude | GATE 2023 | Part 3',
    topic: 'Percentages',
    duration: 2700,
    youtubeId: 'pMte5DBNApI', playlistIndex: 24
  },
  {
    id: 'vid_26', index: 26, day: 7,
    title: 'Ratio and Proportion | Part 1 | GATE 2023',
    topic: 'Ratio & Proportion',
    duration: 2700,
    youtubeId: '1mFrK_nb0u4', playlistIndex: 25
  },
  {
    id: 'vid_27', index: 27, day: 7,
    title: 'Ratio and Proportion | Practice Questions | Part 2 | GATE 2023',
    topic: 'Ratio & Proportion',
    duration: 2700,
    youtubeId: 'N-Y0QM8lf2w', playlistIndex: 26
  },
  {
    id: 'vid_28', index: 28, day: 7,
    title: 'Ratio and Proportion | Practice Questions | Part 3 | GATE 2023',
    topic: 'Ratio & Proportion',
    duration: 2700,
    youtubeId: 'RQ7SuM_9Wcc', playlistIndex: 27
  },

  // ── Day 8: Profit & Loss ───────────────────────────────────────────────────
  {
    id: 'vid_29', index: 29, day: 8,
    title: 'Profit and Loss Best Shortcut Tricks | GATE 2023',
    topic: 'Profit & Loss',
    duration: 2700,
    youtubeId: 'cP5rpxSeL3Q', playlistIndex: 28
  },
  {
    id: 'vid_30', index: 30, day: 8,
    title: 'Profit and Loss Best Shortcut Tricks | GATE 2023 | Part 2',
    topic: 'Profit & Loss',
    duration: 2700,
    youtubeId: 'XrxTfgDtK2c', playlistIndex: 29
  },
  {
    id: 'vid_31', index: 31, day: 8,
    title: 'Profit and Loss Best Shortcut Tricks | GATE 2023 | Part 3',
    topic: 'Profit & Loss',
    duration: 2700,
    youtubeId: '7EfjSVUCaa4', playlistIndex: 30
  },
  {
    id: 'vid_32', index: 32, day: 8,
    title: 'Profit and Loss Best Shortcut Tricks | GATE 2023 | Part 4',
    topic: 'Profit & Loss',
    duration: 2700,
    youtubeId: 'E-0tCz22C88', playlistIndex: 31
  },

  // ── Day 9: Mixtures & Alligation ──────────────────────────────────────────
  {
    id: 'vid_33', index: 33, day: 9,
    title: 'Alligations and Mixtures Tricks | Concept/Questions/Problems | #1',
    topic: 'Mixtures & Alligation',
    duration: 2700,
    youtubeId: 'fSZs8xXEINo', playlistIndex: 32
  },
  {
    id: 'vid_34', index: 34, day: 9,
    title: 'Alligations and Mixtures Tricks | Concept/Questions/Problems | #2',
    topic: 'Mixtures & Alligation',
    duration: 2700,
    youtubeId: 'ibH00R_X55w', playlistIndex: 33
  },
  {
    id: 'vid_35', index: 35, day: 9,
    title: 'Alligations and Mixtures Tricks | Concept/Questions/Problems | #3',
    topic: 'Mixtures & Alligation',
    duration: 2700,
    youtubeId: 'MkZaHnX3aUA', playlistIndex: 34
  },
  {
    id: 'vid_36', index: 36, day: 9,
    title: 'Alligations and Mixtures Tricks | Concept/Questions/Problems | #4',
    topic: 'Mixtures & Alligation',
    duration: 2700,
    youtubeId: 'OjvLitM6i0Q', playlistIndex: 35
  },

  // ── Day 10: Simple & Compound Interest ────────────────────────────────────
  {
    id: 'vid_37', index: 37, day: 10,
    title: 'Simple Interest and Compound Interest in Aptitude for GATE | GATE 2023',
    topic: 'Interest & Finance',
    duration: 2700,
    youtubeId: 'V9lQnSbDKeI', playlistIndex: 36
  },
  {
    id: 'vid_38', index: 38, day: 10,
    title: 'Simple Interest and Compound Interest | Part 2 | GATE 2023',
    topic: 'Interest & Finance',
    duration: 2700,
    youtubeId: 'W36Ux60Of-c', playlistIndex: 37
  },
  {
    id: 'vid_39', index: 39, day: 10,
    title: 'Simple Interest and Compound Interest | Part 3 | GATE 2023',
    topic: 'Interest & Finance',
    duration: 2700,
    youtubeId: 'NVkBHwp3X0U', playlistIndex: 38
  },
  {
    id: 'vid_40', index: 40, day: 10,
    title: 'Simple Interest and Compound Interest | Part 4 | GATE 2023',
    topic: 'Interest & Finance',
    duration: 2700,
    youtubeId: 'PCrmAvXd1no', playlistIndex: 39
  },

  // ── Day 11: Reasoning Syllabus + Blood Relations + Dice ───────────────────
  {
    id: 'vid_41', index: 41, day: 11,
    title: 'Syllabus of Reasoning for GATE | GATE 2023',
    topic: 'Logical Reasoning',
    duration: 600,
    youtubeId: 'Xry7nrwpIFE', playlistIndex: 40
  },
  {
    id: 'vid_42', index: 42, day: 11,
    title: 'Blood Relation Basic Concept & Reasoning Tricks | GATE 2023',
    topic: 'Logical Reasoning',
    duration: 2700,
    youtubeId: 'zYRDSvbUE_M', playlistIndex: 41
  },
  {
    id: 'vid_43', index: 43, day: 11,
    title: 'Dice Questions in Reasoning for GATE | GATE 2023',
    topic: 'Logical Reasoning',
    duration: 2700,
    youtubeId: 'e8wUzEsJd6w', playlistIndex: 42
  },
  {
    id: 'vid_44', index: 44, day: 11,
    title: 'Seating Arrangement Questions in Reasoning for GATE | GATE 2023',
    topic: 'Logical Reasoning',
    duration: 2700,
    youtubeId: 'fTnSeByvyIo', playlistIndex: 43
  },

  // ── Day 12: Seating Arrangement + Directions ──────────────────────────────
  {
    id: 'vid_45', index: 45, day: 12,
    title: 'Seating Arrangement Questions in Reasoning for GATE (Part 2) | GATE 2023',
    topic: 'Logical Reasoning',
    duration: 2700,
    youtubeId: 'Vaq1NPoW7ic', playlistIndex: 44
  },
  {
    id: 'vid_46', index: 46, day: 12,
    title: 'Seating Arrangement Questions in Reasoning for GATE (Part 3) | GATE 2023',
    topic: 'Logical Reasoning',
    duration: 2700,
    youtubeId: '2stQzKmspTY', playlistIndex: 45
  },
  {
    id: 'vid_47', index: 47, day: 12,
    title: 'Direction and Distance Questions in Reasoning for GATE (Part 1) | GATE 2023',
    topic: 'Logical Reasoning',
    duration: 2700,
    youtubeId: 'VPrM11zbLmM', playlistIndex: 46
  },
  {
    id: 'vid_48', index: 48, day: 12,
    title: 'Direction and Distance Questions in Reasoning for GATE (Part 2) | GATE 2023',
    topic: 'Logical Reasoning',
    duration: 2700,
    youtubeId: 'ir2gwuKh5b4', playlistIndex: 47
  },

  // ── Day 13: Analytical Reasoning + Data Interpretation ────────────────────
  {
    id: 'vid_49', index: 49, day: 13,
    title: 'Analytical Reasoning GATE Questions | GATE 2023',
    topic: 'Analytical Reasoning',
    duration: 2700,
    youtubeId: 'GOXA9xcdRec', playlistIndex: 48
  },
  {
    id: 'vid_50', index: 50, day: 13,
    title: 'Analytical Reasoning GATE Practice Questions Part 2 | GATE 2024',
    topic: 'Analytical Reasoning',
    duration: 2700,
    youtubeId: '5lfjN5NTRck', playlistIndex: 49
  },
  {
    id: 'vid_51', index: 51, day: 13,
    title: 'Data Interpretation for GATE | Part 1',
    topic: 'Data Interpretation',
    duration: 2700,
    youtubeId: 'mnim1l9ljFw', playlistIndex: 50
  },
  {
    id: 'vid_52', index: 52, day: 13,
    title: 'Data Interpretation for GATE | Part 2',
    topic: 'Data Interpretation',
    duration: 2700,
    youtubeId: 'c7vd8nCOupE', playlistIndex: 51
  },

  // ── Day 14: Data Interpretation + Geometry ────────────────────────────────
  {
    id: 'vid_53', index: 53, day: 14,
    title: 'Data Interpretation for GATE | Part 3',
    topic: 'Data Interpretation',
    duration: 2700,
    youtubeId: 'kHUHIRkVK8A', playlistIndex: 52
  },
  {
    id: 'vid_54', index: 54, day: 14,
    title: 'Geometry Part 1 (Triangles) | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: 'gOLz0g7Xe1Q', playlistIndex: 53
  },
  {
    id: 'vid_55', index: 55, day: 14,
    title: 'Geometry Part 2 (Triangles) | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: 'QnLIBLzzVEI', playlistIndex: 54
  },
  {
    id: 'vid_56', index: 56, day: 14,
    title: 'Geometry Part 3 (Triangles) | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: 'VRuviXu6lSo', playlistIndex: 55
  },

  // ── Day 15: Geometry continued ────────────────────────────────────────────
  {
    id: 'vid_57', index: 57, day: 15,
    title: 'Geometry Part 4 (Triangles) | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: 'u0Lq_j7J-sM', playlistIndex: 56
  },
  {
    id: 'vid_58', index: 58, day: 15,
    title: 'Geometry Part 5 | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: 'JzAjma3iL_o', playlistIndex: 57
  },
  {
    id: 'vid_59', index: 59, day: 15,
    title: 'Geometry Part 6 | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: '3zF3w1sV-fo', playlistIndex: 58
  },
  {
    id: 'vid_60', index: 60, day: 15,
    title: 'Geometry Part 7 | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: 'Vh4nvevc70g', playlistIndex: 59
  },

  // ── Day 16: Geometry + Mean/Median/Mode ───────────────────────────────────
  {
    id: 'vid_61', index: 61, day: 16,
    title: 'Geometry Part 8 | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: 'hreY5zFApGM', playlistIndex: 60
  },
  {
    id: 'vid_62', index: 62, day: 16,
    title: 'Geometry Part 9 | Aptitude for GATE',
    topic: 'Geometry',
    duration: 2700,
    youtubeId: 'vFvYvD2Ozfs', playlistIndex: 61
  },
  {
    id: 'vid_63', index: 63, day: 16,
    title: 'Mean, Median, Mode | Aptitude for GATE | Part 1',
    topic: 'Statistics',
    duration: 2700,
    youtubeId: '0L2x4l781ls', playlistIndex: 62
  },
  {
    id: 'vid_64', index: 64, day: 16,
    title: 'Mean, Median, Mode | Aptitude for GATE | Part 2',
    topic: 'Statistics',
    duration: 2700,
    youtubeId: 'kaDXLdiQlww', playlistIndex: 63
  },

  // ── Day 17: Statistics + Set Theory ──────────────────────────────────────
  {
    id: 'vid_65', index: 65, day: 17,
    title: 'Mean, Median, Mode | Aptitude for GATE | Part 3',
    topic: 'Statistics',
    duration: 2700,
    youtubeId: 'g5OQ1JW6Urs', playlistIndex: 64
  },
  {
    id: 'vid_66', index: 66, day: 17,
    title: 'Set Theory | Aptitude for GATE | Part 1',
    topic: 'Set Theory',
    duration: 2700,
    youtubeId: '_BegBAKoBoc', playlistIndex: 65
  },
  {
    id: 'vid_67', index: 67, day: 17,
    title: 'Set Theory | Aptitude for GATE | Part 2 GATE PYQs',
    topic: 'Set Theory',
    duration: 2700,
    youtubeId: 'sOnSO567hTQ', playlistIndex: 66
  },
  {
    id: 'vid_68', index: 68, day: 17,
    title: 'Time and Work | Aptitude for GATE | Part 1',
    topic: 'Time & Work',
    duration: 2700,
    youtubeId: 'Wq05oUk9DoQ', playlistIndex: 67
  },

  // ── Day 18: Time & Work + Pipes ───────────────────────────────────────────
  {
    id: 'vid_69', index: 69, day: 18,
    title: 'Time and Work | Aptitude for GATE | Part 2',
    topic: 'Time & Work',
    duration: 2700,
    youtubeId: 'sLlDlFpvLMA', playlistIndex: 68
  },
  {
    id: 'vid_70', index: 70, day: 18,
    title: 'Time and Work | Aptitude for GATE | Part 3',
    topic: 'Time & Work',
    duration: 2700,
    youtubeId: '44-OSceEL8A', playlistIndex: 69
  },
  {
    id: 'vid_71', index: 71, day: 18,
    title: 'Pipe and Cistern | Aptitude for GATE',
    topic: 'Pipes & Cisterns',
    duration: 2700,
    youtubeId: 'mrxgtof5740', playlistIndex: 70
  },
  {
    id: 'vid_72', index: 72, day: 18,
    title: 'Average Speed | Aptitude for GATE | Part 1',
    topic: 'Speed, Distance & Time',
    duration: 2700,
    youtubeId: 'oxHvF-gjjH0', playlistIndex: 71
  },

  // ── Day 19: Speed, Distance & Time ────────────────────────────────────────
  {
    id: 'vid_73', index: 73, day: 19,
    title: 'Average Speed | Aptitude for GATE | Part 2',
    topic: 'Speed, Distance & Time',
    duration: 2700,
    youtubeId: 'YedxnoFhz8A', playlistIndex: 72
  },
  {
    id: 'vid_74', index: 74, day: 19,
    title: 'Average Speed | Part 3 | Boat and Stream | Aptitude for GATE',
    topic: 'Speed, Distance & Time',
    duration: 2700,
    youtubeId: 'dAl-e4RenEQ', playlistIndex: 73
  },
  {
    id: 'vid_75', index: 75, day: 19,
    title: 'Average Speed | Part 4 | Trains | Aptitude for GATE',
    topic: 'Speed, Distance & Time',
    duration: 2700,
    youtubeId: 'HllhVlwKdKA', playlistIndex: 74
  },
  {
    id: 'vid_76', index: 76, day: 19,
    title: 'Linear Race | Aptitude for GATE | Complete Concept and Tricks',
    topic: 'Speed, Distance & Time',
    duration: 2700,
    youtubeId: 'tMKfEFSzDEg', playlistIndex: 75
  },

  // ── Day 20: Races + Clocks ─────────────────────────────────────────────────
  {
    id: 'vid_77', index: 77, day: 20,
    title: 'Circular Race | Aptitude for GATE | Complete Concept and Tricks',
    topic: 'Speed, Distance & Time',
    duration: 2700,
    youtubeId: '2_at3OstQN4', playlistIndex: 76
  },
  {
    id: 'vid_78', index: 78, day: 20,
    title: 'Clock | Clocks Reasoning Tricks | Aptitude for GATE | Part 1',
    topic: 'Clocks',
    duration: 2700,
    youtubeId: '0G68-UFn8xk', playlistIndex: 77
  },
  {
    id: 'vid_79', index: 79, day: 20,
    title: 'Clock | Clocks Reasoning Tricks | Aptitude for GATE | Part 2',
    topic: 'Clocks',
    duration: 2700,
    youtubeId: 'eig_ob43Hqk', playlistIndex: 78
  },
  {
    id: 'vid_80', index: 80, day: 20,
    title: 'Clock | Clocks Reasoning Tricks | Aptitude for GATE | Part 3',
    topic: 'Clocks',
    duration: 2700,
    youtubeId: 'BAbIuykkIWI', playlistIndex: 79
  },

  // ── Day 21: Clocks + Cubes + Syllogism + Number Series ────────────────────
  {
    id: 'vid_81', index: 81, day: 21,
    title: 'Clock | Clocks Reasoning Tricks | Aptitude for GATE | Part 4',
    topic: 'Clocks',
    duration: 2700,
    youtubeId: 'ckDce87i0c4', playlistIndex: 80
  },
  {
    id: 'vid_82', index: 82, day: 21,
    title: 'Cubes and Dices | Aptitude for GATE',
    topic: 'Spatial Aptitude',
    duration: 2700,
    youtubeId: 'HXpgzGHVO_E', playlistIndex: 81
  },
  {
    id: 'vid_83', index: 83, day: 21,
    title: 'Syllogism Reasoning Tricks in One Shot | Syllogism Reasoning Questions | Aptitude for GATE',
    topic: 'Syllogism',
    duration: 2700,
    youtubeId: 'y4S9Oi8Ow5M', playlistIndex: 82
  },
  {
    id: 'vid_84', index: 84, day: 21,
    title: 'Number Series | Reasoning | Number Series Trick',
    topic: 'Number Series',
    duration: 2700,
    youtubeId: 'DDFBYKy_VzE', playlistIndex: 83
  }
];

// Helper to calculate total days
const TOTAL_DAYS = Math.ceil(PLAYLIST_DATA.length / LECTURES_PER_DAY);

// Get lectures for a specific day batch
function getLecturesForDay(dayNumber) {
  return PLAYLIST_DATA.filter(l => l.day === dayNumber);
}

// Get day info summary
function getDayInfo(dayNumber) {
  const lectures = getLecturesForDay(dayNumber);
  const totalDuration = lectures.reduce((acc, curr) => acc + curr.duration, 0);
  const topicNames = [...new Set(lectures.map(l => l.topic))].join(', ');
  return {
    day: dayNumber,
    lectureCount: lectures.length,
    totalDurationSeconds: totalDuration,
    totalDurationFormatted: formatDuration(totalDuration),
    topics: topicNames,
    lectures: lectures
  };
}

// Format seconds into "1h 25m" or "45m"
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0m';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}

// Format seconds into "MM:SS" or "HH:MM:SS"
function formatTimestamp(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
