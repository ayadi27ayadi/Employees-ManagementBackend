import nodemailer from "nodemailer";
// /**création de mail de verification via nodemailer */

const transport = nodemailer.createTransport({

    service: "Gmail",
    auth: {
        user: "ayadikhaoula.ayadi@gmail.com",
        pass: "zfrijnjmigsllanl",
      },
    });

export const nodeMailer={

 sendConformationEmail : async (email,activationCode,plainPassword ) => {
try{
 transport.sendMail({
     from: "ayadikhaoula.ayadi@gmail.com",
      to: email,
      subject: "Confirmer votre compte",
      html: `<div>
      <p> Votre Email est : ${email}</p>
      <p> Votre Password est : ${plainPassword}</p>
      '<p>Pour activer votre compte, veuillez cliquer sur ce lien </p>
      <a href=http://localhost:3000/confirm/${activationCode}> Cliquer ici</a>
      </div>`,
      
    }) 
    console.log("email sent sucessfully")
}catch (error) {
    console.log("email not sent");
    console.log(error);}
  
},

sendEmailForgotPassword : async (email,userId, token ) => {
try{
    transport.sendMail({
        from: "ayadikhaoula.ayadi@gmail.com",
         to: email,
         subject: "Forgot Password",
         html: `<div>
         '<p>Forgot password click in the link </p>
         <a href=http://localhost:3000/confirm/${userId}/${token}> Cliquer ici</a>
         </div>`,
         
       })
       console.log("forgot password sent sucessfully")
    }catch {(error) 
       console.log("password not found !");
       console.log(error);}
     
   },
   resetPasswordEmail : async (email, password) => {
    transport.sendMail({
        from: "ayadikhaoula.ayadi@gmail.com",
        to: email,
        subject: "Welcome back to our company ",
        html: `<div>
        <h1>Welcome back to our company </h1>
        <h2>Hello<h2>
        <p>Your password is updated :<p>
        <p> email: ${email}<p>
        <p> password: ${password}<p>
        `
    }) 
    .catch((err) => console.log(err));
 
}
}



