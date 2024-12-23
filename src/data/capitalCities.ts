const cities: Record<string, string> = {
  bd: 'Dhaka',
  be: 'Brussels',
  bf: 'Ouagadougou',
  bg: 'Sofia',
  ba: 'Sarajevo',
  bb: 'Bridgetown',
  wf: 'Mata Utu',
  bl: 'Gustavia',
  bm: 'Hamilton',
  bn: 'Bandar Seri Begawan',
  bo: 'Sucre',
  bh: 'Manama',
  bi: 'Bujumbura',
  bj: 'Porto-Novo',
  bt: 'Thimphu',
  jm: 'Kingston, JM',
  bv: '',
  bw: 'Gaborone',
  ws: 'Apia',
  bq: '',
  br: 'Brasilia',
  bs: 'Nassau',
  je: 'Saint Helier',
  by: 'Minsk',
  bz: 'Belmopan',
  ru: 'Moscow',
  rw: 'Kigali',
  rs: 'Belgrade',
  tl: 'Dili',
  re: 'Saint-Denis',
  tm: 'Ashgabat',
  tj: 'Dushanbe',
  ro: 'Bucharest',
  tk: '',
  gw: 'Bissau',
  gu: 'Hagatna',
  gt: 'Guatemala City',
  gs: 'Grytviken',
  gr: 'Athens',
  gq: 'Malabo',
  gp: 'Basse-Terre',
  jp: 'Tokyo',
  gy: 'Georgetown',
  gg: 'St Peter Port',
  gf: 'Cayenne',
  ge: 'Tbilisi',
  gd: "St. George's",
  gb: 'London',
  ga: 'Libreville',
  sv: 'San Salvador',
  gn: 'Conakry',
  gm: 'Banjul',
  gl: 'Nuuk',
  gi: 'Gibraltar',
  gh: 'Accra',
  om: 'Muscat',
  tn: 'Tunis',
  jo: 'Amman',
  hr: 'Zagreb',
  ht: 'Port-au-Prince',
  hu: 'Budapest',
  hk: 'Hong Kong',
  hn: 'Tegucigalpa',
  hm: '',
  ve: 'Caracas',
  pr: 'San Juan',
  ps: 'East Jerusalem',
  pw: 'Melekeok',
  pt: 'Lisbon',
  sj: 'Longyearbyen',
  py: 'Asuncion',
  iq: 'Baghdad',
  pa: 'Panama City',
  pf: 'Papeete',
  pg: 'Port Moresby',
  pe: 'Lima',
  pk: 'Islamabad',
  ph: 'Manila',
  pn: 'Adamstown',
  pl: 'Warsaw',
  pm: 'Saint-Pierre',
  zm: 'Lusaka',
  eh: 'El-Aaiun',
  ee: 'Tallinn',
  eg: 'Cairo',
  za: 'Pretoria',
  ec: 'Quito',
  it: 'Rome',
  vn: 'Hanoi',
  sb: 'Honiara',
  et: 'Addis Ababa',
  so: 'Mogadishu',
  zw: 'Harare',
  sa: 'Riyadh',
  es: 'Madrid',
  er: 'Asmara',
  me: 'Podgorica',
  md: 'Chisinau',
  mg: 'Antananarivo',
  mf: 'Marigot',
  ma: 'Rabat',
  mc: 'Monaco',
  uz: 'Tashkent',
  mm: 'Nay Pyi Taw',
  ml: 'Bamako',
  mo: 'Macao',
  mn: 'Ulan Bator',
  mh: 'Majuro',
  mk: 'Skopje',
  mu: 'Port Louis',
  mt: 'Valletta',
  mw: 'Lilongwe',
  mv: 'Male',
  mq: 'Fort-de-France',
  mp: 'Saipan',
  ms: 'Plymouth',
  mr: 'Nouakchott',
  im: 'Douglas, Isle of Man',
  ug: 'Kampala',
  tz: 'Dodoma',
  my: 'Kuala Lumpur',
  mx: 'Mexico City',
  il: 'Jerusalem',
  fr: 'Paris',
  io: 'Diego Garcia',
  sh: 'Jamestown',
  fi: 'Helsinki',
  fj: 'Suva',
  fk: 'Stanley',
  fm: 'Palikir',
  fo: 'Torshavn',
  ni: 'Managua',
  nl: 'Amsterdam',
  no: 'Oslo',
  na: 'Windhoek',
  vu: 'Port Vila',
  nc: 'Noumea',
  ne: 'Niamey',
  nf: 'Kingston, NF',
  ng: 'Abuja',
  nz: 'Wellington',
  np: 'Kathmandu',
  nr: 'Yaren',
  nu: 'Alofi',
  ck: 'Avarua',
  xk: 'Pristina',
  ci: 'Yamoussoukro',
  ch: 'Berne',
  co: 'Bogota',
  cn: 'Beijing',
  cm: 'Yaounde',
  cl: 'Santiago',
  cc: 'West Island',
  ca: 'Ottawa',
  cg: 'Brazzaville',
  cf: 'Bangui',
  cd: 'Kinshasa',
  cz: 'Prague',
  cy: 'Nicosia',
  cx: 'Flying Fish Cove',
  cr: 'San Jose',
  cw: ' Willemstad',
  cv: 'Praia',
  cu: 'Havana',
  sz: 'Mbabane',
  sy: 'Damascus',
  sx: 'Philipsburg',
  kg: 'Bishkek',
  ke: 'Nairobi',
  ss: 'Juba',
  sr: 'Paramaribo',
  ki: 'Tarawa',
  kh: 'Phnom Penh',
  kn: 'Basseterre',
  km: 'Moroni',
  st: 'Sao Tome',
  sk: 'Bratislava',
  kr: 'Seoul',
  si: 'Ljubljana',
  kp: 'Pyongyang',
  kw: 'Kuwait City',
  sn: 'Dakar',
  sm: 'San Marino',
  sl: 'Freetown',
  sc: 'Victoria',
  kz: 'Astana',
  ky: 'George Town',
  sg: 'Singapur',
  se: 'Stockholm',
  sd: 'Khartoum',
  do: 'Santo Domingo',
  dm: 'Roseau',
  dj: 'Djibouti',
  dk: 'Copenhagen',
  vg: 'Road Town',
  de: 'Berlin',
  ye: 'Sanaa',
  dz: 'Algiers',
  us: 'Washington',
  uy: 'Montevideo',
  yt: 'Mamoudzou',
  um: '',
  lb: 'Beirut',
  lc: 'Castries',
  la: 'Vientiane',
  tv: 'Funafuti',
  tw: 'Taipei',
  tt: 'Port of Spain',
  tr: 'Ankara',
  lk: 'Colombo',
  li: 'Vaduz',
  lv: 'Riga',
  to: "Nuku'alofa",
  lt: 'Vilnius',
  lu: 'Luxembourg',
  lr: 'Monrovia',
  ls: 'Maseru',
  th: 'Bangkok',
  tf: 'Port-aux-Francais',
  tg: 'Lome',
  td: "N'Djamena",
  tc: 'Cockburn Town',
  ly: 'Tripolis',
  va: 'Vatican City',
  vc: 'Kingstown',
  ae: 'Abu Dhabi',
  ad: 'Andorra la Vella',
  ag: "St. John's",
  af: 'Kabul',
  ai: 'The Valley',
  vi: 'Charlotte Amalie',
  is: 'Reykjavik',
  ir: 'Tehran',
  am: 'Yerevan',
  al: 'Tirana',
  ao: 'Luanda',
  aq: '',
  as: 'Pago Pago',
  ar: 'Buenos Aires',
  au: 'Canberra',
  at: 'Vienna',
  aw: 'Oranjestad',
  in: 'New Delhi',
  ax: 'Mariehamn',
  az: 'Baku',
  ie: 'Dublin',
  id: 'Jakarta',
  ua: 'Kiev',
  qa: 'Doha',
  mz: 'Maputo',
}

export default cities
