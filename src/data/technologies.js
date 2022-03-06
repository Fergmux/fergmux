import javascript from '@/assets/images/technologies/javascript.png'
import html5 from '@/assets/images/technologies/html5.svg'
import css3 from '@/assets/images/technologies/css3.svg'
import git from '@/assets/images/technologies/git.png'
import vue from '@/assets/images/technologies/vue.svg'
import sass from '@/assets/images/technologies/sass.svg'
import typescript from '@/assets/images/technologies/typescript.svg'
import npm from '@/assets/images/technologies/npm.svg'
import netlify from '@/assets/images/technologies/netlify.png'
import pinia from '@/assets/images/technologies/pinia.svg'
import webpack from '@/assets/images/technologies/webpack.png'
import singlespa from '@/assets/images/technologies/single-spa.svg'
import vite from '@/assets/images/technologies/vite.svg'
import nuxt from '@/assets/images/technologies/nuxt.svg'
import jest from '@/assets/images/technologies/jest.svg'
import tailwind from '@/assets/images/technologies/tailwind.svg'
import prettier from '@/assets/images/technologies/prettier.svg'
import storybook from '@/assets/images/technologies/storybook.svg'
import nodejs from '@/assets/images/technologies/nodejs.png'
import eslint from '@/assets/images/technologies/eslint.svg'
import rxjs from '@/assets/images/technologies/rxjs.png'
import vuetify from '@/assets/images/technologies/vuetify.svg'
import babel from '@/assets/images/technologies/babel.png'
import sentry from '@/assets/images/technologies/sentry.svg'
import heap from '@/assets/images/technologies/heap.svg'
import python from '@/assets/images/technologies/python.svg'
import sql from '@/assets/images/technologies/sql.png'
import stripe from '@/assets/images/technologies/stripe.svg'
import hotjar from '@/assets/images/technologies/hotjar.png'
import mongo from '@/assets/images/technologies/mongo.png'
import java from '@/assets/images/technologies/java.png'
import angular from '@/assets/images/technologies/angular.svg'
import jquery from '@/assets/images/technologies/jquery.svg'
import auth0 from '@/assets/images/technologies/auth0.svg'
import c from '@/assets/images/technologies/c.svg'
import aws from '@/assets/images/technologies/aws.svg'
import google_cloud from '@/assets/images/technologies/google_cloud.png'
import jupyter from '@/assets/images/technologies/jupyter.svg'
import ionic from '@/assets/images/technologies/ionic.svg'
import react from '@/assets/images/technologies/react.svg'
import unity from '@/assets/images/technologies/unity.png'
import heroku from '@/assets/images/technologies/heroku.svg'
import prismic from '@/assets/images/technologies/prismic.png'
import twilio from '@/assets/images/technologies/twilio.svg'
import swagger from '@/assets/images/technologies/swagger.png'
import vscode from '@/assets/images/technologies/vscode.png'
import github from '@/assets/images/technologies/github.png'
import slack from '@/assets/images/technologies/slack.png'
import dropbox from '@/assets/images/technologies/dropbox.svg'
import google_sheets from '@/assets/images/technologies/google_sheets.svg'
import clickup from '@/assets/images/technologies/clickup.svg'
import jira from '@/assets/images/technologies/jira.svg'
import figma from '@/assets/images/technologies/figma.svg'
import zeplin from '@/assets/images/technologies/zeplin.png'
import zoom from '@/assets/images/technologies/zoom.png'
import microsoft_office from '@/assets/images/technologies/microsoft_office.svg'
import skype from '@/assets/images/technologies/skype.svg'

const techSections = [
  {
    title: "Stuff I'm good at",
    subtitle: 'Technologies I use regularly and am proficient in',
    key: 'strong',
  },
  {
    title: 'Stuff I know',
    subtitle: "Technologies I've used in the past but am not an expert with",
    key: 'mid',
  },
  {
    title: 'Other stuff I use',
    subtitle: 'The main programs and tools I use',
    key: 'other',
  },
]

const technologies = {
  strong: [
    {
      name: 'Vue',
      id: 'vue',
      logo: vue,
      color: '#42b883',
      link: 'https://vuejs.org/',
    },
    {
      name: 'JavaScript',
      id: 'javascript',
      logo: javascript,
      color: '#fcdc00',
      link: 'https://www.javascript.com/',
    },
    {
      name: 'HTML 5',
      id: 'html5',
      logo: html5,
      color: '#dd4b24',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    },
    {
      name: 'CSS 3',
      id: 'css3',
      logo: css3,
      color: '#254add',
      link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    },
    {
      name: 'Git',
      id: 'git',
      logo: git,
      color: '#f14e32',
      link: 'https://www.npmjs.com/',
    },
    {
      name: 'Vuex',
      id: 'vuex',
      logo: vue,
      color: '#3eaf7c',
      link: 'https://vuex.vuejs.org/',
    },
    {
      name: 'SASS',
      id: 'sass',
      logo: sass,
      color: '#cf649a',
      link: 'https://sass-lang.com/',
    },
    {
      name: 'TypeScript',
      id: 'typescript',
      logo: typescript,
      color: '#3278c6',
      link: 'https://www.typescriptlang.org/',
    },
    {
      name: 'NPM',
      id: 'npm',
      logo: npm,
      color: '#c33537',
      link: 'https://sass-lang.com/',
    },
    {
      name: 'Netlify',
      id: 'netlify',
      logo: netlify,
      color: '#5cebdf',
      link: 'https://www.netlify.com/',
    },
    {
      name: 'Pinia',
      id: 'pinia',
      logo: pinia,
      color: '#ffd859',
      link: 'https://pinia.vuejs.org/',
    },
    {
      name: 'Webpack',
      id: 'webpack',
      logo: webpack,
      color: '#539ac8',
      link: 'https://webpack.js.org/',
    },
    {
      name: 'Single Spa',
      id: 'single spa',
      logo: singlespa,
      color: '#ee699f',
      link: 'https://single-spa.js.org/',
    },
    {
      name: 'Vite',
      id: 'vite',
      logo: vite,
      color: '#646cff',
      link: 'https://vitejs.dev/',
    },
    {
      name: 'Nuxt',
      id: 'nuxt',
      logo: nuxt,
      color: '#80eec0',
      link: 'https://nuxtjs.org/',
    },
    {
      name: 'Jest',
      id: 'jest',
      logo: jest,
      color: '#bb3c16',
      link: 'https://jestjs.io/',
    },
    {
      name: 'Tailwind',
      id: 'tailwind',
      logo: tailwind,
      color: '#38bdf8',
      link: 'https://tailwindcss.com/',
    },
    {
      name: 'Prettier',
      id: 'prettier',
      logo: prettier,
      color: '#1a2b34',
      link: 'https://prettier.io/',
    },
    {
      name: 'Storybook',
      id: 'storybook',
      logo: storybook,
      color: '#ff4785',
      link: 'https://storybook.js.org/',
    },
    {
      name: 'Node JS',
      id: 'node js',
      logo: nodejs,
      color: '#127e11',
      link: 'https://nodejs.org/en/',
    },
    {
      name: 'ESLint',
      id: 'eslint',
      logo: eslint,
      color: '#4B32C3',
      link: 'https://eslint.org/',
    },
    {
      name: 'RXJS',
      id: 'rxjs',
      logo: rxjs,
      color: '#c2185b',
      link: 'https://rxjs.dev/',
    },
    {
      name: 'Vuetify',
      id: 'vuetify',
      logo: vuetify,
      color: '#1867c0',
      link: 'https://vuetifyjs.com/en/',
    },
    {
      name: 'Babel',
      id: 'babel',
      logo: babel,
      color: '#f5da55',
      link: 'https://babeljs.io/',
    },
    {
      name: 'Sentry',
      id: 'sentry',
      logo: sentry,
      color: '#584774',
      link: 'https://sentry.io/welcome/',
    },
    {
      name: 'Heap',
      id: 'heap',
      logo: heap,
      color: '#ed485f',
      link: 'https://heap.io/',
    },
  ],
  mid: [
    {
      name: 'Python',
      id: 'python',
      logo: python,
      color: '#2b5b84',
      link: 'https://www.python.org/',
    },
    {
      name: 'SQL',
      id: 'sql',
      logo: sql,
      color: '#d06f31',
      link: 'https://www.iso.org/standard/63555.html',
    },
    {
      name: 'Stripe',
      id: 'stripe',
      logo: stripe,
      color: '#635bff',
      link: 'https://stripe.com/',
    },
    {
      name: 'HotJar',
      id: 'hotjar',
      logo: hotjar,
      color: '#ff3c00',
      link: 'https://www.hotjar.com/',
    },
    {
      name: 'MongoDB',
      id: 'mongo',
      logo: mongo,
      color: '#00ed64',
      link: 'https://www.mongodb.com/',
    },
    {
      name: 'Java',
      id: 'java',
      logo: java,
      color: '#4f7b99',
      link: 'https://www.java.com/en/',
    },
    {
      name: 'Angular',
      id: 'angular',
      logo: angular,
      color: '#dd0031',
      link: 'https://angular.io/',
    },
    {
      name: 'JQuery',
      id: 'jquery',
      logo: jquery,
      color: '#0769ad',
      link: 'https://jquery.com/',
    },
    {
      name: 'Auth0',
      id: 'auth0',
      logo: auth0,
      color: '#eb5423',
      link: 'https://auth0.com/',
    },
    {
      name: 'C',
      id: 'c',
      logo: c,
      color: '#015697',
      link: 'https://www.iso.org/standard/74528.html',
    },
    {
      name: 'AWS',
      id: 'aws',
      logo: aws,
      color: '#232f3e',
      link: 'https://aws.amazon.com/',
    },
    {
      name: 'Google Cloud',
      id: 'google_cloud',
      logo: google_cloud,
      color: '#1a73e8',
      link: 'https://cloud.google.com/',
    },
    {
      name: 'Jupyter',
      id: 'jupyter',
      logo: jupyter,
      color: '#e46e2e',
      link: 'https://jupyter.org/',
    },
    {
      name: 'Ionic',
      id: 'ionic',
      logo: ionic,
      color: '#3880ff',
      link: 'https://ionicframework.com/',
    },
    {
      name: 'React',
      id: 'react',
      logo: react,
      color: '#61dafb',
      link: 'https://reactjs.org/',
    },
    {
      name: 'Unity',
      id: 'unity',
      logo: unity,
      color: '#808080',
      link: 'https://unity.com/',
    },
    {
      name: 'Heroku',
      id: 'heroku',
      logo: heroku,
      color: '#79589F',
      link: 'https://www.heroku.com/',
    },
    {
      name: 'Prismic',
      id: 'prismic',
      logo: prismic,
      color: '#5163ba',
      link: 'https://prismic.io/',
    },
    {
      name: 'Twilio',
      id: 'twilio',
      logo: twilio,
      color: '#d61f1f',
      link: 'https://www.twilio.com/',
    },
    {
      name: 'Swagger',
      id: 'swagger',
      logo: swagger,
      color: '#298e35',
      link: 'https://swagger.io/',
    },
  ],
  other: [
    {
      name: 'VS Code',
      id: 'vscode',
      logo: vscode,
      color: '#0066b8',
      link: 'https://code.visualstudio.com/',
    },
    {
      name: 'GitHub',
      id: 'github',
      logo: github,
      color: '#262b32',
      link: 'https://github.com/',
    },
    {
      name: 'Slack',
      id: 'slack',
      logo: slack,
      color: '#611f69',
      link: 'https://slack.com/',
    },
    {
      name: 'Dropbox',
      id: 'dropbox',
      logo: dropbox,
      color: '#0061fe',
      link: 'https://www.dropbox.com/',
    },
    {
      name: 'Google Sheets',
      id: 'googlesheets',
      logo: google_sheets,
      color: '#34a853',
      link: 'https://www.google.co.uk/sheets/about/',
    },
    {
      name: 'ClickUp',
      id: 'clickup',
      logo: clickup,
      color: '#7b68ee',
      link: 'https://clickup.com/',
    },
    {
      name: 'Jira',
      id: 'jira',
      logo: jira,
      color: '#0052cc',
      link: 'https://www.atlassian.com/software/jira',
    },
    {
      name: 'Figma',
      id: 'figma',
      logo: figma,
      color: '#a259ff',
      link: 'https://www.figma.com/',
    },
    {
      name: 'Zeplin',
      id: 'zeplin',
      logo: zeplin,
      color: '#ee6723',
      link: 'https://zeplin.io/',
    },
    {
      name: 'Zoom',
      id: 'zoom',
      logo: zoom,
      color: '#0E71EB',
      link: 'https://zoom.us/',
    },
    {
      name: 'Microsoft Office',
      id: 'microsoftoffice',
      logo: microsoft_office,
      color: '#D83B01',
      link: 'https://www.office.com/',
    },
    {
      name: 'Skype',
      id: 'skype',
      logo: skype,
      color: '#0e78c8',
      link: 'https://www.skype.com/',
    },
  ],
}

export { techSections, technologies }
