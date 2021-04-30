import {Request, Response} from 'express';
import userModel from '../models/userModel';
import flash from "connect-flash";

class UserController{

	public signin(req:Request,res:Response){
		console.log(req.body);
        // res.send('Sign In!!!');
        res.render("partials/signinForm");
	}

    public async  login(req:Request,res:Response){
		console.log(req.body);
		const { usuario, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.buscarNombre(usuario);
        console.log(usuario);
        console.log(password);
        console.log(result);
        if (!result){
            // res.send({ "Usuario no registrado Recibido": req.body });
            // req.flash('error_session','Debes iniciar sesion para ver esta seccion');
            req.flash('error_session','Usuario y/o Password Incorrectos');
            res.redirect("./error");
        }
          

        if (result.nombre == usuario && result.password == password){
            req.session.user=result;
            req.session.auth=true;

			res.redirect("./home");
			return;
		}
        req.flash('error_session','Usuario y/o Password Incorrectos');
        res.redirect("./error");
			
	}

	//registro
	public signup(req:Request,res:Response){
		console.log(req.body);
        //res.send('Sign Up!!!');
		res.render("partials/signupForm");
	}

	// public addUser(req:Request,res:Response){
	// 	console.log(req.body);
    //     res.send('Datos recibidos!!!');
	// }

	public home(req:Request,res:Response){
		console.log(req.body);
        if(!req.session.auth){
            // res.redirect("/");
            req.flash('error_session','Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
        }

        // res.send('Bienvenido!!!');
		res.render("partials/home", {my_session:true});
	}
	//CRUD
	public async list (req:Request,res:Response){
		console.log(req.body);
        const usuarios = await userModel.listar();
        console.log(usuarios);
        return res.json(usuarios);
        //res.send('Listado de usuarios!!!');
	}
	
	public async find(req:Request,res:Response){
		console.log(req.params.id);
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);
        res.status(404).json({ text: "User doesn't exists" });
	}
	
	public async addUser(req:Request,res:Response){
		const usuario = req.body;
        delete usuario.repassword;
        console.log(req.body);
        //res.send('Usuario agregado!!!');
        const busqueda = await userModel.buscarNombre(usuario.nombre);
        if (!busqueda) {
            const result = await userModel.crear(usuario);
            return res.json({ message: 'User saved!!' });
        }
        return res.json({ message: 'User exists!!' });
	}

	// public async addUser(req:Request,res:Response){
    //     const user = req.body;
    //     delete user.repassword;
    //     console.log(req.body);
    //     //res.send('Usuario agregado!!!');
    //     const db = await connect();
    //     const aux = await db.query('INSERT INTO usuarios SET ?',[user]);
    //     console.log(aux);
    //     return res.json({message:'User saved!!'});
    // }
	
	
	public async update(req:Request,res:Response){
		console.log(req.body);
        const { id } = req.params;
        const result = await userModel.actualizar(req.body, id);
        //res.send('Usuario '+ req.params.id +' actualizado!!!');
        return res.json({ text: 'updating a user ' + id });
	}
	
	public async delete(req:Request,res:Response){
		console.log(req.body);
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id);
        //  return res.json({ text: 'deleting a user ' + id });
        // res.send('Usuario eliminado...' + id);
        // alert('Usuario eliminado!!' )
        res.redirect('../control');
        // res.render('partials/userDeleted');
	}

	public async control (req:Request,res:Response){
	 //res.send('Controles');
     if(!req.session.auth){
        res.redirect("/");
    }

	 const usuarios = await userModel.listar();
	 const users = usuarios;
	 res.render('partials/controls', { users: usuarios });

	}

    public async procesar (req:Request,res:Response){
        console.log(req.body);
        if(!req.session.auth){
            // res.redirect("/");
            req.flash('error_session','Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
        }
        console.log(req.body);

        let usuario=req.body.usuario;
        var usuarios:any=[];
        console.log(usuario);
        if(usuario.length>0){
            for(let elemento of usuario){
                const encontrado = await userModel.buscarId(elemento);
                if (encontrado){
                    usuarios.push(encontrado);
                    console.log(encontrado);
                }
                    
            }
        }
        console.log(usuarios);
        res.render("partials/seleccion",{usuarios,home:req.session.user,mi_session:true});
        // res.send('Recibido!!!');
    }

 

    public endSession(req: Request, res: Response){
        console.log(req.body);
        req.session.user={};
        req.session.auth=false;
        req.session.destroy(()=>console.log("Session finalizada"));
        res.redirect("/");
    }

    public showError(req: Request, res: Response){
        // res.send({ "Usuario y/o contraseña incorrectos": req.body });
        res.render("partials/error");

    }
	//FIN CRUD
		// public notSignedUp(req:Request,res:Response){
		// 	console.log(req.body);
		// 	res.render("partials/notSignedUp");
		// }
	

}

const userController = new UserController(); 
export default userController;