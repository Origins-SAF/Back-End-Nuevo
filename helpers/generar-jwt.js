import jwt from "jsonwebtoken"

const generarJWT = (id = '') => {
    
    return new Promise ( (resolve, reject) => {

        //identificar al usuario
        const payload = {
            id
        };
        
       jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
             
        if(err){
            reject('ERROR al general el token')
        }

        resolve(token)
       });
    });
};

export default generarJWT
