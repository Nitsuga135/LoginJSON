const session = require("express-session");

const controller = {
    //metodos
    index: function(req, res){

        
        res.render("profile", {user: req.session.userLogged})
        
    }
  
}
module.exports = controller;