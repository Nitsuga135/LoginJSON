//requiero las validaciones con destructuracion de express validator
const {validationResult} = require("express-validator");
//llamo los modelos
const User = require("../models/User")
//requiero bcrypt para las contraseñas
const bcryptjs = require("bcryptjs"); 

const controller = {
    //metodos
    index: function(req, res){

        
        res.render("createAcount")

    },
    register:function(req, res){
        
        //llamo a las validaciones q pase por ruta
        const resultValidation = validationResult(req);

        //si hay errores vulve al form y mando errores y oldData
        if(resultValidation.errors.length > 0){
        
            res.render("createAcount",{
                
                errors: resultValidation.mapped(),
                oldData: req.body
            });
            
        }else{
        
            //si NO hay errores

            //verifico si el mail del usuario se encuentra en la base de datos

            let usuarioDb = User.findByField("email", req.body.email)

            if(usuarioDb){
                
                return res.render("createAcount", 
                {
                     errors: {
                        email: {
                            msg: "Este email ya está registrado"
                        }
                     },
                     oldData: req.body
                })
        
            }
            //agrego el avatar al usuario que estoy creando
            let userToCreate = {
                ... req.body,
                contrasena: bcryptjs.hashSync(req.body.contrasena, 10),
                avatar: req.file.filename
            }   
            console.log(userToCreate)

            //creo el usuario y redirijo la pagina
             
            let userCreated = User.create(userToCreate)
            res.redirect("/login");
        }
        
    }
}
module.exports = controller;