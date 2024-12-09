require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');


const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => 
    done(null, user)
);
passport.deserializeUser((user, done) => 
    done(null, user)
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/prediction', predictionRoutes); 

app.get('/', (req, res) => {
  res.send(`Welcome to DiabeSafe
        <br>
        <a href='/auth/google'>Login with Google</a>
        <br>
        <a href='/auth/register'>Register</a>
        <br>
        <a href='/login'>Login</a>`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


//google auth
app.get("/auth/google", passport.authenticate('google', { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/" }), (req, res) => {
    res.redirect('/profile');
});


//register
app.get("/auth/register", (req, res) => {
    res.send(`
        <form method="post" action="/auth/register">
            <input type="text" name="name" placeholder="Name">
            <input type="email" name="email" placeholder="Email">
            <input type="password" name="password" placeholder="Password">
            <input type="password" name="confirmPassword" placeholder="Confirm Password">
            <button type="submit">Register</button>
        </form>
    `);
    });

    let userIdCounter = 1;

    app.post('/auth/register', (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
    
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
    
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
    
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
    
        const newUser = {   
            userId: userIdCounter++,
            name,
            email,
            password: hashedPassword
        };
    
        users.push(newUser);
    
        res.status(201).json({
            userId: newUser.userId,
            name: newUser.name
        });
    });

//login
app.get("/login", (req, res) => {
    res.send(`
        <form method="post" action="/auth/login">
            <input type="email" name="email" placeholder="Email">
            <input type="password" name="password" placeholder="Password">
            <button type="submit">Login</button>
        </form>
    `);
});


//profile
app.get("/profile", (req, res) => {
    res.send(`Welcome ${req.user.displayName}`);
});

//logout
app.get("/auth/logout", (req, res) => {  
    req.logout(() => {sa
        res.redirect("/");
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // Increase timeout to 5 seconds
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
