const lastLoggedInAt = (req, res, next) => {
    const currentDate = new Date().toLocaleString();

    // Check if the lastLoggedIn cookie exists
    if (req.cookies.lastLoggedIn) {
        // Store the last logged-in time in session
        req.session.lastLoggedIn = req.cookies.lastLoggedIn;
    } else {
        req.session.lastLoggedIn = new Date().toLocaleString();
    }

    // Update the lastLoggedIn cookie with the current time
    res.cookie('lastLoggedIn', currentDate, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days expiry

    next(); // Proceed to the next middleware or route handler
};

export {lastLoggedInAt};
