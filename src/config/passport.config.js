const passport = require("passport");
const local = require("passport-local");
const UserModel = require("../dao/mongoDb/modelsDB/user.model.js"); //UserModel y las funciones de bcrypt
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2"); //Passport con GitHub
const LocalStrategy = local.Strategy;
const CartRepository = require("../repositories/cartRepository.js");
const cartRepository = new CartRepository();
const dotenv = require("dotenv");
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
// require("dotenv").config();

// console.log("Environment variables:", process.env);

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

// 1
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        const { first_name, last_name, age = null } = req.body;
        try {
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);

          const newCart = await cartRepository.createCart();

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user", // Asigna un valor por defecto
            cart: newCart._id,
          };

          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error); // Mejor manejo de errores
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const userExist = await UserModel.findOne({ email });
          if (!userExist) return done(null, false);
          if (!isValidPassword(password, userExist)) return done(null, false);
          return done(null, userExist);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // const gitHubId = process.env.GITHUB_CLIENT_ID;
  // const gitHubClienteSecret = process.env.GITHUB_CLIENT_SECRET;

  // .log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);
  // console.log("GitHub Client Secret:", process.env.GITHUB_CLIENT_SECRET);
  // //////////////////////////////////Estategia GitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.48e7a6e65207a327",
        clientSecret: "0baaa5e04267f8258e99087058d7b92d782a446a",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      // clientSecret nueva 607b8c50ed69ab8b8cbeaba6f9e4139014b74fe2
      async (accessToken, refreshToken, profile, done) => {
        // console.log("Profile: ", profile);
        try {
          let user = await UserModel.findOne({
            email: profile._json.email,
          });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 38,
              email: profile._json.email,
              password: "",
            };

            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // /////////////////////////////////login face
  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        clientID: "746975140948720",
        clientSecret: "8cf512cacf4985d2f137075aa7c8633a",
        callbackURL: "http://localhost:8080/auth/facebook/callback",
      },
      // clientSecret nueva 607b8c50ed69ab8b8cbeaba6f9e4139014b74fe2
      async (accessToken, refreshToken, profile, done) => {
        // console.log("Profile: ", profile);
        try {
          let user = await UserModel.findOne({
            // email: profile._json.email,
            accountId: profile.id,
            provider: "facebook",
          });

          if (!user) {
            let newUser = new UserModel({
              first_name: profile.displayName,
              accountId: profile.id,
              provider: "facebook",
            });

            await newUser.save();
            return done(null, profile);
          } else {
            return done(null, profile);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  // /////////////////////////////////////////////jwt
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Utiliza ExtractJwt.fromExtractors para extraer el token de la cookie
        secretOrKey: "coderhouse",
      },
      async (jwt_payload, done) => {
        try {
          // Busca el usuario en la base de datos usando el ID del payload JWT
          const user = await UserModel.findById(jwt_payload.user._id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user); // Devuelve el usuario encontrado
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // serializar el usuario y deserializar

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

// const crypto = require("crypto");

// const generateSecretKey = () => {
//   return crypto.randomBytes(10).toString("hex");
// };

// const secretKey = generateSecretKey();
// console.log(secretKey); // Imprime la clave secreta generada

module.exports = initializePassport;
