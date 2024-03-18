const passport = require("passport");
const local = require("passport-local");
const UserModel = require("../dao/models/user.model.js"); //UserModel y las funciones de bcrypt
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2"); //Passport con GitHub
const LocalStrategy = local.Strategy;
const CartManager = require("../dao/mongoDb/controllsDB/cart-manager-db");
const cartManager = new CartManager();
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtStrategy = require("passport-jwt").Strategy;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secretKey", // Aquí debes proporcionar tu clave secreta para firmar y verificar tokens JWT
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

          const newCart = await cartManager.createCart();

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
        console.log("Profile: ", profile);
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
        console.log("Profile: ", profile);
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

  passport.use(
    new jwtStrategy(options, async (jwtPayload, done) => {
      try {
        const user = await UserModel.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
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




const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(10).toString("hex"); 
};

const secretKey = generateSecretKey();
console.log(secretKey); // Imprime la clave secreta generada




module.exports = initializePassport;
