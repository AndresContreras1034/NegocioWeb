// LOGIN FORM
router.get('/login', (req, res) => {
  // Render the login view with a title and no error initially
  res.render('login', { titulo: 'Log In', error: null });
});

// PROCESS LOGIN
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body; // Extract email and password from form

  try {
    // Look for a user with the provided email
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      // If user is not found, show an error
      return res.render('login', { titulo: 'Log In', error: 'Email not registered.' });
    }

    // Compare the provided password with the hashed password in the DB
    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      // If password is incorrect, show an error
      return res.render('login', { titulo: 'Log In', error: 'Incorrect password.' });
    }

    // Generate a JWT token including user ID, name, and role
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Store the token in a cookie
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/panel'); // Redirect to user dashboard
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { titulo: 'Log In', error: 'Error during login.' });
  }
});

// USER PANEL (PROTECTED ROUTE)
router.get('/panel', verificarToken, async (req, res) => {
  try {
    // Retrieve full user info from DB using ID from token
    const usuario = await Usuario.findById(req.usuario.id).lean();
    if (!usuario) return res.redirect('/login'); // If not found, redirect to login

    // Render the user dashboard with user data
    res.render('panel', {
      titulo: 'User Panel',
      usuario
    });
  } catch (error) {
    console.error('Error loading panel:', error);
    res.redirect('/login');
  }
});

// LOGOUT
router.get('/logout', (req, res) => {
  // Clear the token cookie and redirect to login
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;


