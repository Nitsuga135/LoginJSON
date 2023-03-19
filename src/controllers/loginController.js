//llamo los modelos
const User = require("../models/User")

//requiero bcryptjs
const bcryptjs = require("bcryptjs"); 

//requiero las validaciones con destructuracion de express validator
const {validationResult} = require("express-validator");

const controller = {
    //metodos
    index: function(req, res){

        
        res.render("login")
        
    },
    loginProcess: function(req, res){
        
        //EXPRESS VALIDATOR
          //llamo a las validaciones q pase por ruta
          const resultValidation = validationResult(req);

          //si hay errores vulve al form y mando errores y oldData
          if(resultValidation.errors.length > 0){
          
              res.render("login",{
                  
                  errors: resultValidation.mapped(),
                  oldData: req.body
              });
              
          }else{
                
                //verifico el usuario en la base de datos
                let userToLogin = User.findByField("email", req.body.email);
                
               
        //VERIFICAR SIN EXPRESS VALIDATOR
                //si el usuario existe
        
                if(userToLogin){
                    
                    //verifico si la contraseña es la misma
                    let isOkThePassword = bcryptjs.compareSync(req.body.contrasena, userToLogin.contrasena);

                    if(isOkThePassword){
                        delete userToLogin.contrasena;
                        req.session.userLogged = userToLogin;
                        
                        //verifico si quiere recordar el usuario
                        if(req.body.recordar){
                            res.cookie("userEmail", req.body.email, {maxAge: (100000 * 600)*600})
                        }

                        res.redirect("/profile");

                    }
                }   

                //si el email o contrasena no existe en la base de datos
                return res.render("login",
                    {errors: { 
                        email: {
                            msg: "Credenciales invalidas"
                        }
                    }
                })
                                
        }
    },
    logOut: function(req, res){
        
        //se encarga de destruir una cookie especifica
        res.clearCookie("userEmail");

        //se encarga de destruir todo lo q esta en session
        req.session.destroy();
        
        res.redirect("/");
    }
  
}
module.exports = controller;