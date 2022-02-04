export const getLabels = (data) => data.map((item) => item.key);
export const getData = (data) => data.map((item) => item.value);

export const gameData = [
  {
    key: "Microsoft",
    value: 2221,
    children: [
      {
        key: "Xbox Game Studios",
        value: 191,
        children: [
          { key: "343 Industries", value: 192.5, children: [] },
          { key: "Mojang", value: 160.7, children: [] },
          { key: "Obsidian Entertainment", value: 82.6, children: [] },
          { key: "Playground Games", value: 58.6, children: [] },
          { key: "Rare", value: 54, children: [] },
          { key: "Ninja Theory", value: 44, children: [] },
          { key: "The Coalition", value: 42.8, children: [] },
          { key: "Undead labs", value: 30, children: [] },
          { key: "Double Fine", value: 16.8, children: [] },
        ],
      },
      {
        key: "Activision Blizzard",
        value: 61.49,
        children: [
          { key: "Treyarch", value: 118.6, children: [] },
          { key: "Sledgehammer Games", value: 93.3, children: [] },
          { key: "Infinity Ward", value: 57.4, children: [] },
          { key: "Toys for Bob", value: 24.3, children: [] },
          { key: "Activision/Blizzard", value: 8.09, children: [] },
        ],
      },
      {
        key: "Zenimax Media",
        value: 61.49,
        children: [
          { key: "Bethesda", value: 219.2, children: [] },
          { key: "ZeniMax Online", value: 112.8, children: [] },
          { key: "id Software", value: 66.1, children: [] },
          { key: "Arkane Studios", value: 23, children: [] },
          { key: "Tango Gameworks", value: 5, children: [] },
          { key: "Machine Games", value: 1, children: [] },
        ],
      },
    ],
  },
  {
    key: "Other",
    value: 963.8,
    children: [
      {
        key: "Tencent Games",
        value: 593.66,
        children: [
          { key: "Riot Games", value: 1750, children: [] },
          { key: "*Epic Games", value: 840, children: [] },
          { key: "Grinding Gear Games", value: 323.9, children: [] },
          { key: "Turtle Rock Studios", value: 26.9, children: [] },
        ],
      },
      {
        key: "No Parent",
        value: 280.52,
        children: [
          { key: "Bandai Namco", value: 6800, children: [] },
          { key: "Valve Software", value: 3400, children: [] },
          { key: "Square Enix", value: 3000, children: [] },
          { key: "Ubisoft", value: 2238, children: [] },
          { key: "Konami", value: 1800, children: [] },
          { key: "Capcom", value: 774, children: [] },
          { key: "Sega", value: 277, children: [] },
          { key: "CD Projekt Red", value: 123.7, children: [] },
        ],
      },
      {
        key: "EA",
        value: 38.8,
        children: [
          { key: "EA Sports", value: 1600, children: [] },
          { key: "Respawn", value: 172.3, children: [] },
          { key: "DICE", value: 136.9, children: [] },
          { key: "Bioware", value: 126, children: [] },
          { key: "Codemasters", value: 71.2, children: [] },
          { key: "*Hazelight Studios", value: 13.1, children: [] },
          { key: "Criterion Software", value: 2.83, children: [] },
          { key: "Maxis", value: 2.2, children: [] },
        ],
      },
      {
        key: "Take-Two Interactive",
        value: 18.8,
        children: [
          { key: "Rockstar Games", value: 813.3, children: [] },
          { key: "2K Games", value: 650, children: [] },
        ],
      },
      {
        key: "Warner Bros. Interactive Entertainment",
        value: 22.18,
        children: [
          { key: "Avalanche Software", value: 150.3, children: [] },
          { key: "Rocksteady Studios", value: 114.9, children: [] },
          { key: "TT Games", value: 67.4, children: [] },
          { key: "Monolith Productions", value: 47.9, children: [] },
          { key: "NetherRealm Studios", value: 46.3, children: [] },
        ],
      },
      {
        key: "Embracer Group",
        value: 9.84,
        children: [
          { key: "Koch Media", value: 266.14, children: [] },
          { key: "Gearbox Games", value: 84.2, children: [] },
          { key: "Flying Wild Hog", value: 49.9, children: [] },
          { key: "Warhorse Studios", value: 42, children: [] },
          { key: "Deep Silver", value: 30, children: [] },
          { key: "Saber Interactive", value: 26.2, children: [] },
          { key: "THQ Nordic", value: 15.8, children: [] },
          { key: "Milestone", value: 3, children: [] },
        ],
      },
    ],
  },
  {
    key: "Sony",
    value: 135.36,
    children: [
      { key: "Bungie", value: 230, children: [] },
      { key: "Naughty Dog", value: 114.9, children: [] },
      { key: "Santa Monica Studio", value: 95.3, children: [] },
      { key: "*Supermassive Games", value: 91.7, children: [] },
      { key: "Insomniac Games", value: 80, children: [] },
      { key: "Guerilla Games", value: 51, children: [] },
      { key: "*FromSoftware", value: 50, children: [] },
      { key: "Sucker Punch Productions", value: 36, children: [] },
      { key: "*Kojima Productions", value: 27, children: [] },
      { key: "*Quantic Dream", value: 16.1, children: [] },
      { key: "Housemarque", value: 14.7, children: [] },
      { key: "Media Molecule", value: 10.5, children: [] },
      { key: "Valkyrie Entertainment", value: 8.7, children: [] },
      { key: "Polyphony Digital", value: 8, children: [] },
    ],
  },
  {
    key: "Nintendo",
    value: 55,
    children: [
      { key: "Game Freak", value: 1100, children: [] },
      { key: "Nintendo EPD", value: 350, children: [] },
      { key: "ND Cube", value: 50, children: [] },
      { key: "Intelligent Systems", value: 35.8, children: [] },
      { key: "HAL Labortories", value: 6.5, children: [] },
      { key: "Camelot Software Planning", value: 6.1, children: [] },
      { key: "Monolith Soft", value: 4.57, children: [] },
      { key: "Retro Studios", value: 8, children: [] },
      { key: "Alphadream", value: 2, children: [] },
    ],
  },
];

export const chartData = {
  labels: getLabels(gameData),
  datasets: [
    {
      label: "My First Dataset",
      data: getData(gameData),
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "#4FB477",
        "#3891A6",
        "#414073",
        "#F5CB5C",
        "#F5853F",
        "#e05050",
        "#F564A9",
        "#5CC8FF",
        "#009DDC",
        "#EAB464",
        "#a398e1",
      ],
      hoverOffset: 4,
    },
  ],
};
