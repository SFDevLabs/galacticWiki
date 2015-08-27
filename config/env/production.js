
/**
 * Expose
 */

module.exports = {
  bundlejs: '/js/bundle.min.js',
  bundlecss: '/css/bundle.min.css',
  db: process.env.MONGOLAB_URI,
  graphdb:process.env.GRAPHENEDB_URL,
  alchemyAPIKey:'be2f7973124cb69ffab13bc66a425f9b9760dc2e',
  facebook: {
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://nodejs-express-demo.herokuapp.com/auth/facebook/callback"
  },
  twitter: {
    clientID: process.env.TWITTER_CLIENTID,
    clientSecret: process.env.TWITTER_SECRET,
    callbackURL: "http://nodejs-express-demo.herokuapp.com/auth/twitter/callback"
  },
  github: {
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: 'http://nodejs-express-demo.herokuapp.com/auth/github/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENTID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: 'http://nodejs-express-demo.herokuapp.com/auth/linkedin/callback'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://nodejs-express-demo.herokuapp.com/auth/google/callback"
  }
};
