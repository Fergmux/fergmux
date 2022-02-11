export const getLabels = (data) => data.map((item) => item.key)
export const getData = (data) => data.map((item) => item.value)

export const levelMap = [
  'Parent Company',
  'Group',
  'Studio/Publisher',
  'Game/Franchise',
]
export const tooltipMap = [
  'B Market Cap',
  'B Market Cap',
  'M Revenue',
  'M Sales',
]

const organiseData = (gameArray) => {
  gameArray.sort((a, b) => b.value - a.value)
  return gameArray.map((game) => ({
    ...game,
    children: organiseData(game.children),
  }))
}

export const rawGameData = [
  {
    key: 'Microsoft',
    value: 2221,
    children: [
      {
        key: 'Xbox Game Studios',
        value: 191,
        children: [
          {
            key: '343 Industries',
            value: 192.5,
            children: [
              { key: 'Halo: Combat Evolved', value: 5.5, children: [] },
              { key: 'Halo 2', value: 8.46, children: [] },
              { key: 'Halo 3', value: 14.5, children: [] },
              { key: 'Halo Wars', value: 2.62, children: [] },
              { key: 'Halo 3: ODST', value: 6.35, children: [] },
              { key: 'Halo: Reach', value: 9.87, children: [] },
              {
                key: 'Halo: Combat Evolved Anniversary',
                value: 2.43,
                children: [],
              },
              { key: 'Halo 4', value: 9.75, children: [] },
              {
                key: 'Halo: The Master Chief Collection',
                value: 8.13,
                children: [],
              },
              { key: 'Halo 5: Guardians', value: 9.5, children: [] },
              { key: 'Halo Wars 2', value: 2.2, children: [] },
              { key: 'Halo Wars Definitive Edition', value: 0.5, children: [] },
            ],
          },
          {
            key: 'Xbox Game Studios',
            value: 191,
            children: [
              { key: 'Zoo Tycoon', value: 4, children: [] },
              { key: 'Crackdown', value: 1.5, children: [] },
              { key: 'Age of Empires', value: 25, children: [] },
              { key: 'Microsoft Flight Simluator', value: 21, children: [] },
              { key: 'Ori', value: 2, children: [] },
            ],
          },
          {
            key: 'Mojang',
            value: 160.7,
            children: [{ key: 'Minecraft', value: 283, children: [] }],
          },
          {
            key: 'Obsidian Entertainment',
            value: 82.6,
            children: [
              { key: 'Fallout New Vegas', value: 12, children: [] },
              { key: 'Outer Worlds', value: 0.1, children: [] },
              { key: 'Grounded', value: 3, children: [] },
            ],
          },
          {
            key: 'Playground Games',
            value: 58.6,
            children: [
              { key: 'Forza', value: 10, children: [] },
              { key: 'Fable', value: 6, children: [] },
            ],
          },
          {
            key: 'Rare',
            value: 54,
            children: [
              { key: 'Golden Eye', value: 8, children: [] },
              { key: 'Perfect Dark', value: 12, children: [] },
              { key: 'Banjoo Kazooie', value: 12, children: [] },
              { key: 'Viva Pinata', value: 0.5, children: [] },
              { key: 'Sea of Thieves', value: 5, children: [] },
              { key: 'Battletoads', value: 1, children: [] },
            ],
          },
          {
            key: 'Ninja Theory',
            value: 44,
            children: [
              { key: 'DmC: Devil May Cry', value: 3.8, children: [] },
              { key: "Hellblade: Senua's Sacrifice", value: 1, children: [] },
            ],
          },
          {
            key: 'The Coalition',
            value: 42.8,
            children: [
              { key: 'Gears of War', value: 6, children: [] },
              { key: 'Gears of War 2', value: 5, children: [] },
              { key: 'Gears of War 3', value: 3, children: [] },
              { key: 'Gears of War 4', value: 3.37, children: [] },
              { key: 'Gears 5', value: 3, children: [] },
            ],
          },
          {
            key: 'Undead labs',
            value: 30,
            children: [
              { key: 'State of Decay', value: 2, children: [] },
              { key: 'Sate of Decay 2', value: 5, children: [] },
            ],
          },
          {
            key: 'Double Fine',
            value: 16.8,
            children: [
              { key: 'Psychonauts', value: 3, children: [] },
              { key: 'Brutal Legend', value: 1, children: [] },
              { key: 'Grim Fandango', value: 0.5, children: [] },
            ],
          },
        ],
      },
      {
        key: 'Activision Blizzard',
        value: 61.49,
        children: [
          {
            key: 'Treyarch',
            value: 118.6,
            children: [
              {
                key: 'Call of Duty: Black Ops Cold War',
                value: 5.7,
                children: [],
              },
              { key: 'Call of Duty 3', value: 7.2, children: [] },
              { key: 'Call of Duty: Black Ops 4', value: 14.3, children: [] },
              { key: 'Call of Duty: World at War', value: 15, children: [] },
              { key: 'Call of Duty: Black Ops 3', value: 26.7, children: [] },
              { key: 'Call of Duty: Black Ops 2', value: 30, children: [] },
              { key: 'Call of Duty: Black Ops', value: 30.7, children: [] },
            ],
          },
          {
            key: 'Sledgehammer Games',
            value: 93.3,
            children: [
              { key: 'Call of Duty: WWII', value: 19.8, children: [] },
              {
                key: 'Call of Duty: Advanced Warfare',
                value: 21.8,
                children: [],
              },
              { key: 'Call of Duty: Vanguard', value: 3, children: [] },
            ],
          },
          {
            key: 'Infinity Ward',
            value: 57.4,
            children: [
              { key: 'Call of Duty', value: 4.5, children: [] },
              { key: 'Call of Duty 2', value: 5.9, children: [] },
              {
                key: 'Call of Duty: Infinite Warfare',
                value: 13.6,
                children: [],
              },
              {
                key: 'Call of Duty: Modern Warfare (2007)',
                value: 17.3,
                children: [],
              },
              {
                key: 'Call of Duty: Modern Warfare 2',
                value: 25,
                children: [],
              },
              { key: 'Call of Duty: Ghosts', value: 29, children: [] },
              {
                key: 'Call of Duty: Modern Warfare 3',
                value: 30,
                children: [],
              },
              {
                key: 'Call of Duty: Modern Warfare (2019)',
                value: 30,
                children: [],
              },
              { key: 'Call of Duty: Warzone', value: 100, children: [] },
            ],
          },
          {
            key: 'Toys for Bob',
            value: 24.3,
            children: [
              { key: 'Crash Bandicoot 4', value: 3, children: [] },
              { key: 'Spyro the Dragon: Reignited', value: 5, children: [] },
            ],
          },
          {
            key: 'Activision/Blizzard',
            value: 61.4,
            children: [
              { key: 'World of Warcraft', value: 14, children: [] },
              { key: 'Diablo', value: 50, children: [] },
              { key: 'Hearthstone', value: 100, children: [] },
              { key: 'Overwatch', value: 50, children: [] },
              { key: 'StarCraft', value: 18, children: [] },
              { key: "Tony Hawk's Pro Skater", value: 50, children: [] },
            ],
          },
        ],
      },
      {
        key: 'Zenimax Media',
        value: 61.49,
        children: [
          {
            key: 'Bethesda',
            value: 219.2,
            children: [
              { key: 'The Elder Scrolls: Morrowind', value: 4, children: [] },
              { key: 'The Elder Scrolls: Oblivion', value: 9.5, children: [] },
              { key: 'Skyrim', value: 30, children: [] },
              { key: 'Fallout 76', value: 2.46, children: [] },
              { key: 'Fallout 3', value: 12, children: [] },
              { key: 'Fallout 4', value: 13.5, children: [] },
            ],
          },
          {
            key: 'ZeniMax Online',
            value: 112.8,
            children: [
              { key: 'Elder Scrolls Online', value: 15, children: [] },
            ],
          },
          {
            key: 'id Software',
            value: 66.1,
            children: [
              { key: 'Doom (1993)', value: 1.3, children: [] },
              { key: 'Doom 2', value: 2, children: [] },
              { key: 'Doom 3', value: 3.5, children: [] },
              { key: 'Doom (2016)', value: 2, children: [] },
              { key: 'Doom Eternal', value: 3, children: [] },
              { key: 'Quake', value: 1, children: [] },
              { key: 'Quake 2', value: 1, children: [] },
              { key: 'Rage', value: 2.3, children: [] },
              { key: 'Rage 2', value: 1.5, children: [] },
            ],
          },
          {
            key: 'Arkane Studios',
            value: 23,
            children: [
              { key: 'Deathloop', value: 1, children: [] },
              { key: 'Prey', value: 1.5, children: [] },
              { key: 'Dishonoured', value: 2.5, children: [] },
              { key: 'Dishonoured 2', value: 2.5, children: [] },
            ],
          },
          {
            key: 'Tango Gameworks',
            value: 5,
            children: [
              { key: 'Evil Within', value: 4, children: [] },
              { key: 'Evil Within 2', value: 1, children: [] },
            ],
          },
          {
            key: 'Machine Games',
            value: 1,
            children: [
              { key: 'Wolfenstein: The New Order', value: 3.6, children: [] },
              {
                key: 'Wolfenstein 2: The New Colossus',
                value: 2.7,
                children: [],
              },
              { key: 'Wolfenstein', value: 1, children: [] },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'Other',
    value: 963.8,
    children: [
      {
        key: 'Tencent Games',
        value: 593.66,
        children: [
          {
            key: 'Riot Games',
            value: 1750,
            children: [
              { key: 'Leage of Legends', value: 180, children: [] },
              { key: 'Valorant', value: 80, children: [] },
              { key: 'Legends of Runeterra', value: 14, children: [] },
            ],
          },
          {
            key: 'Krafton',
            value: 2800,
            children: [
              { key: 'Player Unknown Battlegrounds', value: 75, children: [] },
            ],
          },
          {
            key: 'Grinding Gear Games',
            value: 323.9,
            children: [{ key: 'Path of Exile', value: 20, children: [] }],
          },
          {
            key: 'Turtle Rock Studios',
            value: 26.9,
            children: [
              { key: 'Back for Blood', value: 6, children: [] },
              { key: 'Evolve', value: 3, children: [] },
            ],
          },
        ],
      },
      {
        key: 'No Parent',
        value: 280.52,
        children: [
          {
            key: 'Bandai Namco',
            value: 6800,
            children: [
              { key: 'Naruto: Ultimate Ninja', value: 20.8, children: [] },
              { key: 'Dark Souls III', value: 10, children: [] },
              { key: 'Elden Ring', value: 9, children: [] },
              {
                key: 'Naruto Shippuden: Ultimate Ninja Storm 4',
                value: 8.7,
                children: [],
              },
              { key: 'Dragon Ball FighterZ', value: 8, children: [] },
              { key: 'Dragon Ball Xenoverse 2', value: 8, children: [] },
              { key: 'Tekken 7', value: 8, children: [] },
              { key: 'Dragon Ball Z: Kakarot', value: 4.5, children: [] },
              { key: 'God Eater', value: 4, children: [] },
              { key: 'Little Nightmares', value: 4, children: [] },
              { key: 'Ace Combat 7: Skies Unknown', value: 3, children: [] },
              { key: 'Little Nightmares', value: 3, children: [] },
              { key: 'Project CARS', value: 2.26, children: [] },
              { key: 'Code Vein', value: 2, children: [] },
              { key: 'SoulCalibur VI', value: 2, children: [] },
            ],
          },
          {
            key: 'Valve Software',
            value: 3400,
            children: [
              { key: 'DOTA', value: 150, children: [] },
              { key: 'Left 4 Dead', value: 12, children: [] },
              { key: 'Portal', value: 27, children: [] },
              { key: 'Team Fortress', value: 80, children: [] },
              { key: 'Counter Strike', value: 65, children: [] },
              { key: 'Half Life', value: 33.1, children: [] },
            ],
          },
          {
            key: 'Square Enix',
            value: 3000,
            children: [
              { key: 'Final Fantasy', value: 156, children: [] },
              { key: 'Dragon Quest', value: 83, children: [] },
              { key: 'Tomb Raider', value: 85, children: [] },
              { key: 'Kingdom Hearts', value: 32, children: [] },
              {
                key: "Marvel's Guardians of the Galaxy",
                value: 2,
                children: [],
              },
              { key: "Marvel's Avengers", value: 3, children: [] },
            ],
          },
          {
            key: 'Ubisoft',
            value: 2238,
            children: [
              { key: 'Far Cry', value: 52, children: [] },
              { key: 'Assassins Creed', value: 155, children: [] },
              { key: "Tom Clancy's Splinter Cell", value: 31, children: [] },
              { key: "Tom Clancy's Ghost Recon", value: 35, children: [] },
              { key: 'Rayman', value: 26, children: [] },
              { key: 'Watchdogs', value: 20, children: [] },
              { key: 'Just Dance', value: 70, children: [] },
              { key: "Tom Clancy's The Division", value: 20, children: [] },
            ],
          },
          {
            key: 'Konami',
            value: 1800,
            children: [
              { key: 'Metal Gear', value: 57, children: [] },
              { key: 'Jikkyo Powerful Pro Yakyu', value: 23.6, children: [] },
              { key: 'PES', value: 112.4, children: [] },
              { key: 'Castlevania', value: 21.6, children: [] },
              { key: 'Yu-Gi-Oh', value: 21.8, children: [] },
              { key: 'Frogger', value: 20, children: [] },
              {
                key: 'Teenage Mutant Ninja Turtles',
                value: 19.1,
                children: [],
              },
              { key: 'Dance Dance Revolution', value: 11, children: [] },
              { key: 'Silent Hill', value: 9, children: [] },
            ],
          },
          {
            key: 'Capcom',
            value: 774,
            children: [
              { key: 'Monster Hunter', value: 78, children: [] },
              { key: 'Resident Evil', value: 123, children: [] },
              { key: 'Street fighter', value: 47, children: [] },
              { key: 'Devil May Cry', value: 25, children: [] },
              { key: 'Megaman', value: 37, children: [] },
              { key: 'Dead Rising', value: 14, children: [] },
            ],
          },
          {
            key: 'Sega',
            value: 277,
            children: [
              { key: 'Sonic the Hedgehog', value: 76.6, children: [] },
              { key: 'Football Manager', value: 33.3, children: [] },
              {
                key: 'Mario and Sonic at the Olympic Games',
                value: 25.6,
                children: [],
              },
              { key: 'Total War: Warhammer', value: 3, children: [] },
              { key: 'Project Gotham Racing', value: 7, children: [] },
              { key: 'Yakuza', value: 17, children: [] },
              { key: 'Hatsune Miku: Project', value: 6.3, children: [] },
            ],
          },
          {
            key: 'CD Projekt Red',
            value: 123.7,
            children: [
              { key: 'Cyberpunk 2077', value: 13.7, children: [] },
              { key: 'The Witcher 3: Wild Hunt', value: 34.4, children: [] },
              { key: 'The Witcher (Other)', value: 15, children: [] },
            ],
          },
        ],
      },
      {
        key: 'EA',
        value: 38.8,
        children: [
          {
            key: 'EA Sports',
            value: 1600,
            children: [
              { key: 'FIFA', value: 280, children: [] },
              { key: 'Madden', value: 130, children: [] },
              { key: 'NHL', value: 12.2, children: [] },
              { key: 'Skate', value: 4, children: [] },
            ],
          },
          {
            key: 'Respawn',
            value: 172.3,
            children: [
              { key: 'Apex Legends', value: 100, children: [] },
              { key: 'Star Wars Jedi: Fallen Order', value: 20, children: [] },
              { key: 'Titanfall', value: 10, children: [] },
              { key: 'Titanfall 2', value: 4, children: [] },
            ],
          },
          {
            key: 'DICE',
            value: 136.9,
            children: [
              { key: 'Battlefield 3', value: 15, children: [] },
              { key: 'Star Wars Battlefront (2015)', value: 14, children: [] },
              { key: 'Battlefield: Bad Company 2', value: 9, children: [] },
              {
                key: 'Star Wars Battlefront II (2017)',
                value: 9,
                children: [],
              },
              { key: 'Battlefield V', value: 7.3, children: [] },
              { key: 'Battlefield 4', value: 12, children: [] },
              { key: 'Battlefield 1', value: 25, children: [] },
              { key: 'Mirrors Edge', value: 2.5, children: [] },
              { key: 'Mirrors Edge Catylist', value: 3, children: [] },
            ],
          },
          {
            key: 'Bioware',
            value: 126,
            children: [
              { key: 'Mass Effect', value: 18, children: [] },
              { key: 'Dragon Age', value: 5.2, children: [] },
              { key: 'Anthem', value: 6, children: [] },
              { key: "Baldur's Gate", value: 4.5, children: [] },
              {
                key: 'Star Wars: Knights of the Old Republic',
                value: 3.2,
                children: [],
              },
            ],
          },
          {
            key: 'Codemasters',
            value: 71.2,
            children: [
              { key: 'Colin McRae Rally', value: 10, children: [] },
              { key: 'F1', value: 5, children: [] },
              { key: 'Dirt', value: 7, children: [] },
              { key: 'Grid', value: 5, children: [] },
            ],
          },
          {
            key: 'Maxis',
            value: 15,
            children: [
              { key: 'The Sims', value: 16, children: [] },
              { key: 'The Sims 2', value: 7, children: [] },
              { key: 'The Sims 3', value: 10, children: [] },
              { key: 'The Sims 4', value: 36, children: [] },
              { key: 'SimCity', value: 3.2, children: [] },
              { key: 'SimCity 2000', value: 3.4, children: [] },
              { key: 'SimCIty 3000', value: 5, children: [] },
              { key: 'Spore', value: 2.8, children: [] },
              { key: 'SimCity (2013)', value: 2, children: [] },
            ],
          },
          {
            key: '*Hazelight Studios',
            value: 13.1,
            children: [
              { key: 'It Takes Two', value: 5, children: [] },
              { key: 'A Way Out', value: 3.5, children: [] },
            ],
          },
          {
            key: 'Criterion Software',
            value: 2.83,
            children: [
              { key: 'Need for Speed: Hot Pursuit', value: 5, children: [] },
              { key: 'Burnout: Paradise', value: 1, children: [] },
            ],
          },
        ],
      },
      {
        key: 'Take-Two Interactive',
        value: 18.8,
        children: [
          {
            key: 'Rockstar Games',
            value: 813.3,
            children: [
              { key: 'Grand Theft Auto V', value: 155, children: [] },
              { key: 'Red Dead Redemption 2', value: 39, children: [] },
              { key: 'Grand Theft Auto IV', value: 25, children: [] },
              {
                key: 'Grand Theft Auto: San Andreas',
                value: 27.5,
                children: [],
              },
              { key: 'Grand Theft Auto: Vice City', value: 17.5, children: [] },
              { key: 'Grand Theft Auto III', value: 14.5, children: [] },
              { key: 'Grand Theft Auto III', value: 2, children: [] },
              { key: 'Grand Theft Auto', value: 3, children: [] },
            ],
          },
          {
            key: '2K Games',
            value: 650,
            children: [
              { key: 'NBA', value: 90, children: [] },
              { key: 'WWE', value: 70, children: [] },
              { key: 'PGA', value: 2.5, children: [] },
              { key: 'Bioshock', value: 38, children: [] },
              { key: 'Mafia', value: 14, children: [] },
              { key: 'XCOM', value: 1.5, children: [] },
              { key: 'Civilization', value: 20, children: [] },
            ],
          },
        ],
      },
      {
        key: 'Warner Bros. Interactive Entertainment',
        value: 22.18,
        children: [
          {
            key: 'Avalanche Software',
            value: 150.3,
            children: [
              { key: 'Disney Infinity', value: 1, children: [] },
              { key: 'Hogwarts Legacy', value: 2, children: [] },
              { key: 'Cars', value: 8, children: [] },
            ],
          },
          {
            key: 'Rocksteady Studios',
            value: 114.9,
            children: [
              { key: 'Batman: Arkham City', value: 12.5, children: [] },
              { key: 'Batman: Arkham Asylum', value: 4.3, children: [] },
              { key: 'Batman: Arkham Knight', value: 5, children: [] },
            ],
          },
          {
            key: 'TT Games',
            value: 67.4,
            children: [
              {
                key: 'LEGO Batman 2: DC Super Heroes',
                value: 3.5,
                children: [],
              },
              { key: 'LEGO Jurassic World', value: 4, children: [] },
              {
                key: 'LEGO Pirates of the Caribbean: The Video Game',
                value: 4,
                children: [],
              },
              {
                key: 'LEGO Indiana Jones 2: The Adventure Continues',
                value: 4.5,
                children: [],
              },
              {
                key: 'LEGO Star Wars 3: The Clone Wars',
                value: 5.5,
                children: [],
              },
              { key: 'LEGO Harry Potter: Years 1-4', value: 7, children: [] },
              {
                key: 'LEGO Star Wars 2: The Original Trilogy',
                value: 8,
                children: [],
              },
              {
                key: 'LEGO Star Wars: The Video Game',
                value: 7.2,
                children: [],
              },
              {
                key: 'LEGO Indiana Jones: The Original Adventures',
                value: 11.4,
                children: [],
              },
              { key: 'LEGO Batman: The Videogame', value: 12, children: [] },
              {
                key: 'LEGO Star Wars: The Complete Saga',
                value: 13,
                children: [],
              },
            ],
          },
          {
            key: 'Monolith Productions',
            value: 47.9,
            children: [
              { key: 'Middle Earth: Shadow of Mordor', value: 5, children: [] },
              { key: 'Middle Earth: Shadow of War', value: 2.5, children: [] },
            ],
          },
          {
            key: 'NetherRealm Studios',
            value: 46.3,
            children: [
              { key: 'Mortal Kombat (Others)', value: 51, children: [] },
              { key: 'Mortal Kombat X', value: 10, children: [] },
              { key: 'Mortal Kombat 11', value: 12, children: [] },
              { key: 'Injustice', value: 0.5, children: [] },
              { key: 'Injustice 2', value: 0.5, children: [] },
            ],
          },
        ],
      },
      {
        key: 'Embracer Group',
        value: 9.84,
        children: [
          {
            key: 'Koch Media',
            value: 266.14,
            children: [
              { key: '*Mount and Blade', value: 6, children: [] },
              { key: '*RUST', value: 12.4, children: [] },
              { key: '*Dead by Daylight', value: 5, children: [] },
              { key: '*STALKER', value: 6, children: [] },
              { key: '*Black Desert Online', value: 40, children: [] },
            ],
          },
          {
            key: 'Gearbox Games',
            value: 84.2,
            children: [
              { key: 'Borderlands 2', value: 25, children: [] },
              { key: 'Borderlands 3', value: 14, children: [] },
              { key: 'Borderlands', value: 6, children: [] },
              { key: 'Aliens: Colonial Marines', value: 1.5, children: [] },
              {
                key: 'Brothers in Arms: Road to Hill 30',
                value: 1.7,
                children: [],
              },
            ],
          },
          {
            key: 'Flying Wild Hog',
            value: 49.9,
            children: [
              { key: 'Shadow Warrior', value: 0.2, children: [] },
              { key: 'Shadow Warrior 2', value: 0.8, children: [] },
            ],
          },
          {
            key: 'THQ Nordic',
            value: 40,
            children: [
              { key: 'Biomutant', value: 1, children: [] },
              { key: 'Saints Row', value: 32, children: [] },
              { key: 'Metro', value: 12.2, children: [] },
              { key: 'Destroy All Humans', value: 1, children: [] },
              { key: 'Darksiders', value: 5, children: [] },
              { key: 'Spongebob Squarepants', value: 20, children: [] },
              { key: 'Cars', value: 8, children: [] },
              { key: 'Warhammer', value: 7, children: [] },
            ],
          },
          {
            key: 'Deep Silver',
            value: 30,
            children: [
              { key: 'Saints Row IV', value: 1, children: [] },
              { key: 'Metro: Redux', value: 1.5, children: [] },
              { key: 'Dead Island', value: 5, children: [] },
              { key: 'Persona 5', value: 5, children: [] },
              { key: 'Homefront: The Revolution', value: 1.3, children: [] },
              { key: 'Kingdom Come: Deliverance', value: 3, children: [] },
            ],
          },
          {
            key: 'Saber Interactive',
            value: 26.2,
            children: [
              { key: 'Snowrunner', value: 1, children: [] },
              { key: 'Mudrunner', value: 1, children: [] },
              { key: 'World War Z', value: 3, children: [] },
            ],
          },
          {
            key: 'Milestone',
            value: 3,
            children: [{ key: 'Moto GP', value: 3, children: [] }],
          },
        ],
      },
      {
        key: 'Epic Games',
        value: 840,
        children: [
          {
            key: 'Harmonix Music Systems',
            value: 25.7,
            children: [
              { key: 'Rock Band', value: 4, children: [] },
              { key: 'Guitar Hero', value: 1.8, children: [] },
              { key: 'Guitar Hero 2', value: 5, children: [] },
              { key: 'Dance Central', value: 2.5, children: [] },
            ],
          },
          {
            key: 'Psyonix',
            value: 37,
            children: [{ key: 'Rocket League', value: 10.5, children: [] }],
          },
          {
            key: 'Mediatonic',
            value: 45.7,
            children: [{ key: 'Fall Guys', value: 11, children: [] }],
          },
        ],
      },
    ],
  },
  {
    key: 'Sony',
    value: 135.36,
    children: [
      {
        key: null,
        value: 25,
        children: [
          {
            key: 'Bungie',
            value: 230,
            children: [
              { key: 'Destiny', value: 25, children: [] },
              { key: 'Destiny 2', value: 75, children: [] },
            ],
          },
          {
            key: 'Naughty Dog',
            value: 114.9,
            children: [
              { key: "Uncharted 4: A Thief's End", value: 16.24, children: [] },
              {
                key: "Uncharted 3: Drake's Deception",
                value: 9.3,
                children: [],
              },
              { key: 'Uncharted 2', value: 3.8, children: [] },
              { key: 'The Last of Us', value: 24, children: [] },
              { key: 'The Last of Us Part 2', value: 4, children: [] },
            ],
          },
          {
            key: 'Santa Monica Studio',
            value: 95.3,
            children: [
              { key: 'God of War (2005)', value: 4.6, children: [] },
              { key: 'God of War (2018)', value: 19.5, children: [] },
              { key: 'God of War 3', value: 7.6, children: [] },
              { key: 'God of War 2', value: 4.2, children: [] },
              {
                key: 'God of War: Chains of Olympus',
                value: 3.2,
                children: [],
              },
              { key: 'God of War: Ascension', value: 3, children: [] },
            ],
          },
          {
            key: '*Supermassive Games',
            value: 91.7,
            children: [
              { key: 'Until Dawn', value: 2, children: [] },
              {
                key: 'The Dark Pictures Anthology: House of Ashes',
                value: 1,
                children: [],
              },
            ],
          },
          {
            key: 'Insomniac Games',
            value: 80,
            children: [
              { key: 'Ratchet and Clank', value: 3.7, children: [] },
              {
                key: 'Ratchet and Clank: Up Your Arsenal',
                value: 3.2,
                children: [],
              },
              {
                key: 'Ratchet & Clank: Going Commando',
                value: 2.9,
                children: [],
              },
              { key: 'Ratchet Deadlocked', value: 2.1, children: [] },
              { key: 'Ratchet & Clank: Rift Apart', value: 1.5, children: [] },
              { key: 'Spider-man', value: 20, children: [] },
              { key: 'Spider-man: Miles Morales', value: 6.5, children: [] },
            ],
          },
          {
            key: 'Guerilla Games',
            value: 51,
            children: [
              { key: 'Horizon Zero Dawn', value: 10, children: [] },
              { key: 'Killzone 2', value: 1, children: [] },
              {
                key: 'Killzone: Shadow Fall',
                value: 2.1,
                children: [
                  { key: '*Demon Souls', value: 1, children: [] },
                  { key: '*Bloodborne', value: 2, children: [] },
                ],
              },
            ],
          },
          {
            key: '*FromSoftware',
            value: 50,
            children: [
              { key: 'Demon Souls', value: 1, children: [] },
              { key: 'Bloodborne', value: 2, children: [] },
            ],
          },
          {
            key: 'Sucker Punch Productions',
            value: 36,
            children: [
              { key: 'Ghost of Tsushima', value: 8, children: [] },
              { key: 'Infamous', value: 3, children: [] },
            ],
          },
          {
            key: '*Kojima Productions',
            value: 27,
            children: [{ key: 'Death Stranding', value: 5, children: [] }],
          },
          {
            key: '*Quantic Dream',
            value: 16.1,
            children: [
              { key: 'Heavy Rain', value: 5.3, children: [] },
              { key: 'Detroit: Become Human', value: 6, children: [] },
              { key: 'Beyond: Two Souls', value: 2.8, children: [] },
            ],
          },
          {
            key: 'Housemarque',
            value: 14.7,
            children: [{ key: 'Returnal', value: 0.5, children: [] }],
          },
          {
            key: 'Media Molecule',
            value: 10.5,
            children: [
              { key: 'Little Big Planet', value: 5.5, children: [] },
              { key: 'Little Big Planet 2', value: 3.5, children: [] },
            ],
          },
          {
            key: 'Polyphony Digital',
            value: 8,
            children: [
              { key: 'Gran Turismo 5', value: 5.3, children: [] },
              { key: 'Gran Turismo 4', value: 1.4, children: [] },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'Nintendo',
    value: 55,
    children: [
      {
        key: null,
        value: 1,
        children: [
          {
            key: 'Game Freak',
            value: 1100,
            children: [
              {
                key: 'Pokémon Red / Green / Blue',
                value: 31.38,
                children: [],
              },
              { key: 'Pokémon Sword / Shield', value: 23.9, children: [] },
              {
                key: 'Pokémon Gold / Silver',
                value: 23.1,
                children: [],
              },
              {
                key: 'Pokémon Diamond / Pearl',
                value: 17.67,
                children: [],
              },
              { key: 'Pokémon X/Y', value: 16.58, children: [] },
              { key: 'Pokémon Mystery Dungeon', value: 16.5, children: [] },
              { key: 'Pokémon Sun/Moon', value: 16.27, children: [] },
              {
                key: 'Pokémon Ruby / Sapphire',
                value: 16.22,
                children: [],
              },
              {
                key: 'Pokémon Black / White',
                value: 15.64,
                children: [],
              },
              {
                key: 'Pokémon Yellow: Special Pikachu Edition',
                value: 14.64,
                children: [],
              },
              {
                key: 'Pokémon Omega Ruby/Pokémon Alpha Sapphire',
                value: 14.46,
                children: [],
              },
              {
                key: "Pokémon: Let's Go, Pikachu/Eevee",
                value: 14.33,
                children: [],
              },
              {
                key: 'Pokémon Brilliant Diamond / Shining Pearl',
                value: 13.97,
                children: [],
              },
              {
                key: 'Pokémon Heart Gold / Soul Silver',
                value: 12.72,
                children: [],
              },
              {
                key: 'Pokémon FireRed / LeafGreen',
                value: 12,
                children: [],
              },
              {
                key: 'Pokémon: Ultra Sun and Ultra Moon',
                value: 9.04,
                children: [],
              },
              { key: 'Pokémon Black 2 and White 2', value: 8.52, children: [] },
              { key: 'Pokémon Platinum', value: 7.6, children: [] },
              { key: 'Pokémon Emerald', value: 7.06, children: [] },
              { key: 'Pokémon Legends: Arceus', value: 6.5, children: [] },
            ],
          },
          {
            key: 'Nintendo EPD',
            value: 350,
            children: [
              { key: 'Super Mario', value: 391, children: [] },
              { key: 'Wii Sports', value: 116, children: [] },
              { key: 'Legend of Zelda', value: 120, children: [] },
              { key: 'Mario Kart', value: 164, children: [] },
              { key: 'Animal Crossing', value: 72.4, children: [] },
            ],
          },
          {
            key: 'ND Cube',
            value: 50,
            children: [
              { key: 'Super Mario Party', value: 17.39, children: [] },
              { key: 'Wii Party', value: 9.35, children: [] },
              { key: 'Mario Party 9', value: 3.11, children: [] },
              { key: 'Mario Party: Island Tour', value: 2.9, children: [] },
              { key: 'Mario Party 10', value: 2.26, children: [] },
              { key: 'Wii Party U', value: 1.78, children: [] },
              { key: 'F-Zero: Maximum Velocity', value: 1.05, children: [] },
            ],
          },
          {
            key: 'Intelligent Systems',
            value: 35.8,
            children: [
              { key: 'Fire Emblem', value: 11.74, children: [] },
              { key: 'Mario Kart: Super Circuit', value: 5.91, children: [] },
              { key: 'Super Paper Mario', value: 4.23, children: [] },
              {
                key: 'Paper Mario: The Origami King',
                value: 3.12,
                children: [],
              },
              { key: 'Fire Emblem Fates', value: 3, children: [] },
              { key: 'Fire Emblem: Three Houses', value: 2.87, children: [] },
              { key: 'Paper Mario: Sticker Star', value: 2.47, children: [] },
              { key: 'WarioWare Touched!', value: 2.47, children: [] },
              { key: 'WarioWare: Smooth Moves', value: 2.35, children: [] },
              { key: 'Fire Emblem: Awakening', value: 2.31, children: [] },
              { key: 'Mario Paint', value: 2.31, children: [] },
              { key: 'SimCity', value: 1.98, children: [] },
              {
                key: 'Paper Mario: The Thousand-Year Door',
                value: 1.91,
                children: [],
              },
              { key: 'Metroid II: Return of Samus', value: 1.72, children: [] },
              { key: 'Super Metroid', value: 1.42, children: [] },
              { key: 'Paper Mario', value: 1.37, children: [] },
            ],
          },
          {
            key: 'HAL Labortories',
            value: 6.5,
            children: [
              { key: 'Super Smash Bros. Melee', value: 7.41, children: [] },
              { key: 'Super Smash Bros.', value: 5.55, children: [] },
              { key: 'Pokémon Stadium', value: 5.46, children: [] },
              { key: "Kirby's Dream Land", value: 5.13, children: [] },
              { key: 'Pokémon Snap', value: 3.63, children: [] },
              { key: 'Kirby Super Star Ultra', value: 2.99, children: [] },
              { key: 'Kirby Star Allies', value: 2.93, children: [] },
              { key: 'Pokémon Ranger', value: 2.93, children: [] },
              { key: 'Kirby: Triple Deluxe', value: 2.61, children: [] },
              { key: 'Pokémon Stadium 2', value: 2.54, children: [] },
              { key: "Kirby's Dream Land 2", value: 2.36, children: [] },
              {
                key: 'Pokémon Ranger: Shadows of Almia',
                value: 2.35,
                children: [],
              },
              { key: "Kirby's Pinball Land", value: 2.19, children: [] },
              {
                key: 'Kirby: Nightmare in Dream Land',
                value: 2.1,
                children: [],
              },
              { key: "Kirby's Return to Dreamland", value: 1.79, children: [] },
              {
                key: 'Kirby 64: The Crystal Shards',
                value: 1.77,
                children: [],
              },
              { key: "Kirby's Adventure", value: 1.75, children: [] },
              {
                key: 'Kanshuu Nippon Joushikiryoku Kentei Kyoukai: Imasara Hito ni wa Kikenai Otona no Joushikiryoku Training DS',
                value: 1.68,
                children: [],
              },
            ],
          },
          {
            key: 'Camelot Software Planning',
            value: 6.1,
            children: [
              { key: 'Mario Tennis', value: 3.5, children: [] },
              { key: 'Mario Tennis Aces', value: 3.06, children: [] },
              { key: 'Mario Golf: Super Rush', value: 2.26, children: [] },
              {
                key: 'New Play Control! Mario Power Tennis',
                value: 1.79,
                children: [],
              },
              { key: 'Golden Sun', value: 1.65, children: [] },
              { key: 'Mario Tennis Open', value: 1.57, children: [] },
              { key: 'Mario Golf', value: 1.47, children: [] },
              { key: 'Mario Golf: Toadstool Tour', value: 1.27, children: [] },
              { key: 'Mario Power Tennis', value: 1.16, children: [] },
              { key: 'Golden Sun: The Lost Age', value: 1.12, children: [] },
            ],
          },
          {
            key: 'Monolith Soft',
            value: 4.57,
            children: [
              { key: 'Xenoblade Chronicles', value: 0.913, children: [] },
              { key: 'Xenoblade Chronicles 3D', value: 0.56, children: [] },
              { key: 'Xenoblade Chronicles X', value: 0.84, children: [] },
              { key: 'Xenoblade Chronicles 2', value: 2.05, children: [] },
              {
                key: 'Xenoblade Chronicles: Definitive Edition',
                value: 1.52,
                children: [],
              },
            ],
          },
          {
            key: 'Retro Studios',
            value: 8,
            children: [
              { key: 'Donkey Kong Country Returns', value: 6.53, children: [] },
              { key: 'Metroid Prime', value: 2.84, children: [] },
              {
                key: 'Donkey Kong Country: Tropical Freeze',
                value: 2.65,
                children: [],
              },
              {
                key: 'Donkey Kong Country: Tropical Freeze',
                value: 2.01,
                children: [],
              },
              { key: 'Metroid Prime 3: Corruption', value: 1.41, children: [] },
              { key: 'Metroid Prime 2: Echoes', value: 1.1, children: [] },
            ],
          },
          {
            key: 'Alphadream',
            value: 2,
            children: [
              {
                key: "Mario & Luigi: Bowser's Inside Story",
                value: 4.56,
                children: [],
              },
              { key: 'Mario & Luigi: Dream Team', value: 2.65, children: [] },
              {
                key: 'Mario & Luigi: Superstar Saga',
                value: 2.15,
                children: [],
              },
              {
                key: 'Mario & Luigi: Partners in Time',
                value: 1.73,
                children: [],
              },
              { key: 'Mario & Luigi: Paper Jam', value: 1.06, children: [] },
            ],
          },
        ],
      },
    ],
  },
]

export const gameData = organiseData(rawGameData)

export const chartConfig = {
  type: 'doughnut',
  data: {
    labels: getLabels(gameData),
    datasets: [
      {
        label: 'My First Dataset',
        data: getData(gameData),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          '#4FB477',
          '#3891A6',
          '#414073',
          '#F5CB5C',
          '#F5853F',
          '#e05050',
          '#F564A9',
          '#5CC8FF',
          '#009DDC',
          '#EAB464',
          '#a398e1',
        ],
        hoverOffset: 4,
      },
    ],
  },
}
