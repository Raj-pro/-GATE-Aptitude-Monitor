/**
 * GATE Aptitude Playlist Data & Structure
 * Playlist: Amit Khurana - Aptitude for GATE CS/IT
 * Playlist ID: PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS
 */

const DEFAULT_PLAYLIST_ID = 'PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS';
const LECTURES_PER_DAY = 4;

// Comprehensive curriculum structure for the playlist
const PLAYLIST_DATA = [
  // Day 1: Number System Fundamentals
  {
    id: 'vid_1',
    index: 1,
    day: 1,
    title: 'Lecture 1: Introduction to Aptitude for GATE & Strategy',
    topic: 'Orientation & Strategy',
    duration: 2100, // seconds (~35 min)
    youtubeId: 'qj8BqA_v0v8',
    playlistIndex: 0
  },
  {
    id: 'vid_2',
    index: 2,
    day: 1,
    title: 'Lecture 2: Number System - Basics & Classification of Numbers',
    topic: 'Number System',
    duration: 2700, // ~45 min
    youtubeId: 'W6NZfCO5SIk',
    playlistIndex: 1
  },
  {
    id: 'vid_3',
    index: 3,
    day: 1,
    title: 'Lecture 3: Number System - Divisibility Rules & Shortcuts',
    topic: 'Number System',
    duration: 3100, // ~51 min
    youtubeId: '5qap5aO4i9A',
    playlistIndex: 2
  },
  {
    id: 'vid_4',
    index: 4,
    day: 1,
    title: 'Lecture 4: Number System - Unit Digit & Tens Digit Calculations',
    topic: 'Number System',
    duration: 2850, // ~47 min
    youtubeId: 'YQHsXMglC9A',
    playlistIndex: 3
  },

  // Day 2: Remainder Theorems & Factors
  {
    id: 'vid_5',
    index: 5,
    day: 2,
    title: 'Lecture 5: Number System - Remainder Theorem Part 1',
    topic: 'Number System',
    duration: 3300,
    youtubeId: 'kJQP7kiw5Fk',
    playlistIndex: 4
  },
  {
    id: 'vid_6',
    index: 6,
    day: 2,
    title: 'Lecture 6: Number System - Remainder Theorem Part 2 (Euler & Fermat)',
    topic: 'Number System',
    duration: 3000,
    youtubeId: 'L_LUpnjgPso',
    playlistIndex: 5
  },
  {
    id: 'vid_7',
    index: 7,
    day: 2,
    title: 'Lecture 7: Number System - Number of Factors & Sum of Factors',
    topic: 'Number System',
    duration: 2900,
    youtubeId: 'fJ9rUzIMcZQ',
    playlistIndex: 6
  },
  {
    id: 'vid_8',
    index: 8,
    day: 2,
    title: 'Lecture 8: Number System - Highest Power of Prime in n! & Trailing Zeros',
    topic: 'Number System',
    duration: 3150,
    youtubeId: '3JZ_D3ELwOQ',
    playlistIndex: 7
  },

  // Day 3: LCM, HCF & Base Systems
  {
    id: 'vid_9',
    index: 9,
    day: 3,
    title: 'Lecture 9: Number System - LCM & HCF Concepts and Tricks',
    topic: 'Number System',
    duration: 2750,
    youtubeId: '2Vv-BfVoq4g',
    playlistIndex: 8
  },
  {
    id: 'vid_10',
    index: 10,
    day: 3,
    title: 'Lecture 10: Number System - Advanced GATE Questions on LCM & HCF',
    topic: 'Number System',
    duration: 2600,
    youtubeId: 'OPf0YbXqDm0',
    playlistIndex: 9
  },
  {
    id: 'vid_11',
    index: 11,
    day: 3,
    title: 'Lecture 11: Number System - Base Conversion & Base Operations',
    topic: 'Base Systems',
    duration: 2800,
    youtubeId: 'CevxZvSJLk8',
    playlistIndex: 10
  },
  {
    id: 'vid_12',
    index: 12,
    day: 3,
    title: 'Lecture 12: Number System - GATE Previous Years Practice (PYQs)',
    topic: 'Number System PYQs',
    duration: 3400,
    youtubeId: 'kxpcVDA7k9U',
    playlistIndex: 11
  },

  // Day 4: Percentages & Profit/Loss
  {
    id: 'vid_13',
    index: 13,
    day: 4,
    title: 'Lecture 13: Percentages - Fundamentals, Fractions & Multipliers',
    topic: 'Percentages',
    duration: 2950,
    youtubeId: 'RgKAFK5djSk',
    playlistIndex: 12
  },
  {
    id: 'vid_14',
    index: 14,
    day: 4,
    title: 'Lecture 14: Percentages - Successive Percentage Changes & AB Rule',
    topic: 'Percentages',
    duration: 3100,
    youtubeId: 'UprcpdwuwGQ',
    playlistIndex: 13
  },
  {
    id: 'vid_15',
    index: 15,
    day: 4,
    title: 'Lecture 15: Profit, Loss & Discount - Core Formulae and Concepts',
    topic: 'Profit & Loss',
    duration: 3200,
    youtubeId: 'JGwWNGJdvx8',
    playlistIndex: 14
  },
  {
    id: 'vid_16',
    index: 16,
    day: 4,
    title: 'Lecture 16: Profit, Loss & Discount - Dishonest Shopkeeper & PYQs',
    topic: 'Profit & Loss',
    duration: 3350,
    youtubeId: 'fWNaR-rxAic',
    playlistIndex: 15
  },

  // Day 5: Simple Interest, Compound Interest, Ratio & Proportion
  {
    id: 'vid_17',
    index: 17,
    day: 5,
    title: 'Lecture 17: Simple & Compound Interest - Concepts and Effective Rates',
    topic: 'Interest & Finance',
    duration: 2800,
    youtubeId: 'kJQP7kiw5Fk',
    playlistIndex: 16
  },
  {
    id: 'vid_18',
    index: 18,
    day: 5,
    title: 'Lecture 18: Simple & Compound Interest - Installments & GATE PYQs',
    topic: 'Interest & Finance',
    duration: 2900,
    youtubeId: 'L_LUpnjgPso',
    playlistIndex: 17
  },
  {
    id: 'vid_19',
    index: 19,
    day: 5,
    title: 'Lecture 19: Ratio, Proportion & Variations - Core Techniques',
    topic: 'Ratio & Proportion',
    duration: 2750,
    youtubeId: 'W6NZfCO5SIk',
    playlistIndex: 18
  },
  {
    id: 'vid_20',
    index: 20,
    day: 5,
    title: 'Lecture 20: Mixtures & Alligation - Rule of Alligation Masterclass',
    topic: 'Mixtures & Alligation',
    duration: 3400,
    youtubeId: '5qap5aO4i9A',
    playlistIndex: 19
  },

  // Day 6: Time and Work & Pipes
  {
    id: 'vid_21',
    index: 21,
    day: 6,
    title: 'Lecture 21: Time & Work - Efficiency and Total Work Concept',
    topic: 'Time & Work',
    duration: 3100,
    youtubeId: 'YQHsXMglC9A',
    playlistIndex: 20
  },
  {
    id: 'vid_22',
    index: 22,
    day: 6,
    title: 'Lecture 22: Time & Work - Alternate Days, Leaving & Joining Problems',
    topic: 'Time & Work',
    duration: 3300,
    youtubeId: 'OPf0YbXqDm0',
    playlistIndex: 21
  },
  {
    id: 'vid_23',
    index: 23,
    day: 6,
    title: 'Lecture 23: Time & Work - Wages, Men-Women-Children Equivalence',
    topic: 'Time & Work',
    duration: 2850,
    youtubeId: 'CevxZvSJLk8',
    playlistIndex: 22
  },
  {
    id: 'vid_24',
    index: 24,
    day: 6,
    title: 'Lecture 24: Pipes & Cisterns - Inlets, Outlets & Leakage Problems',
    topic: 'Pipes & Cisterns',
    duration: 3000,
    youtubeId: 'kxpcVDA7k9U',
    playlistIndex: 23
  },

  // Day 7: Speed, Distance and Time
  {
    id: 'vid_25',
    index: 25,
    day: 7,
    title: 'Lecture 25: Speed, Distance & Time - Average Speed & Proportionality',
    topic: 'Speed, Distance & Time',
    duration: 3200,
    youtubeId: 'RgKAFK5djSk',
    playlistIndex: 24
  },
  {
    id: 'vid_26',
    index: 26,
    day: 7,
    title: 'Lecture 26: Trains - Relative Speed & Crossing Points/Objects',
    topic: 'Speed, Distance & Time',
    duration: 2950,
    youtubeId: 'UprcpdwuwGQ',
    playlistIndex: 25
  },
  {
    id: 'vid_27',
    index: 27,
    day: 7,
    title: 'Lecture 27: Boats & Streams - Upstream, Downstream & Escalators',
    topic: 'Speed, Distance & Time',
    duration: 2800,
    youtubeId: 'JGwWNGJdvx8',
    playlistIndex: 26
  },
  {
    id: 'vid_28',
    index: 28,
    day: 7,
    title: 'Lecture 28: Circular Motion & Races - Linear & Circular Tracks',
    topic: 'Speed, Distance & Time',
    duration: 3100,
    youtubeId: 'fWNaR-rxAic',
    playlistIndex: 27
  },

  // Day 8: Permutations and Combinations (P&C)
  {
    id: 'vid_29',
    index: 29,
    day: 8,
    title: 'Lecture 29: Permutations & Combinations - Fundamental Counting Principle',
    topic: 'P&C',
    duration: 3400,
    youtubeId: 'kJQP7kiw5Fk',
    playlistIndex: 28
  },
  {
    id: 'vid_30',
    index: 30,
    day: 8,
    title: 'Lecture 30: Permutations & Combinations - Linear & Circular Arrangements',
    topic: 'P&C',
    duration: 3250,
    youtubeId: 'L_LUpnjgPso',
    playlistIndex: 29
  },
  {
    id: 'vid_31',
    index: 31,
    day: 8,
    title: 'Lecture 31: Permutations & Combinations - Selection & Group Formation',
    topic: 'P&C',
    duration: 3100,
    youtubeId: 'W6NZfCO5SIk',
    playlistIndex: 30
  },
  {
    id: 'vid_32',
    index: 32,
    day: 8,
    title: 'Lecture 32: Permutations & Combinations - Distribution, Partition & PYQs',
    topic: 'P&C',
    duration: 3500,
    youtubeId: '5qap5aO4i9A',
    playlistIndex: 31
  },

  // Day 9: Probability Masterclass
  {
    id: 'vid_33',
    index: 33,
    day: 9,
    title: 'Lecture 33: Probability - Classical Probability, Coins & Dice Problems',
    topic: 'Probability',
    duration: 2900,
    youtubeId: 'YQHsXMglC9A',
    playlistIndex: 32
  },
  {
    id: 'vid_34',
    index: 34,
    day: 9,
    title: 'Lecture 34: Probability - Cards, Balls & Bag Problems with Selection',
    topic: 'Probability',
    duration: 3050,
    youtubeId: 'OPf0YbXqDm0',
    playlistIndex: 33
  },
  {
    id: 'vid_35',
    index: 35,
    day: 9,
    title: 'Lecture 35: Probability - Conditional Probability & Independent Events',
    topic: 'Probability',
    duration: 3300,
    youtubeId: 'CevxZvSJLk8',
    playlistIndex: 34
  },
  {
    id: 'vid_36',
    index: 36,
    day: 9,
    title: 'Lecture 36: Probability - Total Probability Theorem & Bayes Theorem',
    topic: 'Probability',
    duration: 3450,
    youtubeId: 'kxpcVDA7k9U',
    playlistIndex: 35
  },

  // Day 10: Progressions, Logarithms & Algebra
  {
    id: 'vid_37',
    index: 37,
    day: 10,
    title: 'Lecture 37: Sequences & Series - AP, GP, HP & AM-GM Inequality',
    topic: 'Sequences & Series',
    duration: 2850,
    youtubeId: 'RgKAFK5djSk',
    playlistIndex: 36
  },
  {
    id: 'vid_38',
    index: 38,
    day: 10,
    title: 'Lecture 38: Logarithms & Surds/Indices - Rules and Properties',
    topic: 'Logarithms',
    duration: 2700,
    youtubeId: 'UprcpdwuwGQ',
    playlistIndex: 37
  },
  {
    id: 'vid_39',
    index: 39,
    day: 10,
    title: 'Lecture 39: Algebra - Linear & Quadratic Equations, Roots & Maxima/Minima',
    topic: 'Algebra',
    duration: 3100,
    youtubeId: 'JGwWNGJdvx8',
    playlistIndex: 38
  },
  {
    id: 'vid_40',
    index: 40,
    day: 10,
    title: 'Lecture 40: Set Theory & Venn Diagrams - 2-Set & 3-Set Problem Solving',
    topic: 'Set Theory',
    duration: 3200,
    youtubeId: 'fWNaR-rxAic',
    playlistIndex: 39
  },

  // Day 11: Geometry & Mensuration
  {
    id: 'vid_41',
    index: 41,
    day: 11,
    title: 'Lecture 41: Geometry - Lines, Angles, Triangles & Similarity Theorems',
    topic: 'Geometry',
    duration: 3300,
    youtubeId: 'kJQP7kiw5Fk',
    playlistIndex: 40
  },
  {
    id: 'vid_42',
    index: 42,
    day: 11,
    title: 'Lecture 42: Geometry - Circles, Tangents, Chords & Polygons',
    topic: 'Geometry',
    duration: 3200,
    youtubeId: 'L_LUpnjgPso',
    playlistIndex: 41
  },
  {
    id: 'vid_43',
    index: 43,
    day: 11,
    title: 'Lecture 43: Mensuration 2D & 3D - Area, Perimeter, Volume & Surface Area',
    topic: 'Mensuration',
    duration: 3150,
    youtubeId: 'W6NZfCO5SIk',
    playlistIndex: 42
  },
  {
    id: 'vid_44',
    index: 44,
    day: 11,
    title: 'Lecture 44: Coordinate Geometry - Distance, Slope, Lines & Circles',
    topic: 'Coordinate Geometry',
    duration: 2900,
    youtubeId: '5qap5aO4i9A',
    playlistIndex: 43
  },

  // Day 12: Logical Reasoning & Analytical Aptitude
  {
    id: 'vid_45',
    index: 45,
    day: 12,
    title: 'Lecture 45: Logical Reasoning - Syllogisms & Deductive Logic',
    topic: 'Logical Reasoning',
    duration: 3000,
    youtubeId: 'YQHsXMglC9A',
    playlistIndex: 44
  },
  {
    id: 'vid_46',
    index: 46,
    day: 12,
    title: 'Lecture 46: Logical Reasoning - Blood Relations & Direction Sense',
    topic: 'Logical Reasoning',
    duration: 2750,
    youtubeId: 'OPf0YbXqDm0',
    playlistIndex: 45
  },
  {
    id: 'vid_47',
    index: 47,
    day: 12,
    title: 'Lecture 47: Logical Reasoning - Seating Arrangements & Puzzles',
    topic: 'Logical Reasoning',
    duration: 3400,
    youtubeId: 'CevxZvSJLk8',
    playlistIndex: 46
  },
  {
    id: 'vid_48',
    index: 48,
    day: 12,
    title: 'Lecture 48: Clocks & Calendars - Odd Days, Angle & Overlap Calculations',
    topic: 'Clocks & Calendars',
    duration: 2950,
    youtubeId: 'kxpcVDA7k9U',
    playlistIndex: 47
  },

  // Day 13: Data Interpretation
  {
    id: 'vid_49',
    index: 49,
    day: 13,
    title: 'Lecture 49: Data Interpretation - Tables & Bar Charts',
    topic: 'Data Interpretation',
    duration: 2850,
    youtubeId: 'RgKAFK5djSk',
    playlistIndex: 48
  },
  {
    id: 'vid_50',
    index: 50,
    day: 13,
    title: 'Lecture 50: Data Interpretation - Pie Charts & Line Graphs',
    topic: 'Data Interpretation',
    duration: 3100,
    youtubeId: 'UprcpdwuwGQ',
    playlistIndex: 49
  },
  {
    id: 'vid_51',
    index: 51,
    day: 13,
    title: 'Lecture 51: Spatial Aptitude - Mirror Images, Paper Folding & Rotations',
    topic: 'Spatial Aptitude',
    duration: 2700,
    youtubeId: 'JGwWNGJdvx8',
    playlistIndex: 50
  },
  {
    id: 'vid_52',
    index: 52,
    day: 13,
    title: 'Lecture 52: Spatial Aptitude - Cube Folding, Block Views & Patterns',
    topic: 'Spatial Aptitude',
    duration: 2900,
    youtubeId: 'fWNaR-rxAic',
    playlistIndex: 51
  },

  // Day 14: Comprehensive GATE PYQs & Revision
  {
    id: 'vid_53',
    index: 53,
    day: 14,
    title: 'Lecture 53: Comprehensive GATE Aptitude PYQs Marathon - Part 1',
    topic: 'GATE PYQs & Revision',
    duration: 3600,
    youtubeId: 'kJQP7kiw5Fk',
    playlistIndex: 52
  },
  {
    id: 'vid_54',
    index: 54,
    day: 14,
    title: 'Lecture 54: Comprehensive GATE Aptitude PYQs Marathon - Part 2',
    topic: 'GATE PYQs & Revision',
    duration: 3600,
    youtubeId: 'L_LUpnjgPso',
    playlistIndex: 53
  },
  {
    id: 'vid_55',
    index: 55,
    day: 14,
    title: 'Lecture 55: Comprehensive GATE Aptitude PYQs Marathon - Part 3',
    topic: 'GATE PYQs & Revision',
    duration: 3700,
    youtubeId: 'W6NZfCO5SIk',
    playlistIndex: 54
  },
  {
    id: 'vid_56',
    index: 56,
    day: 14,
    title: 'Lecture 56: Final Tips, Speed Tricks & Exam Day Strategy',
    topic: 'GATE Exam Strategy',
    duration: 2400,
    youtubeId: '5qap5aO4i9A',
    playlistIndex: 55
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
