// import model here
const {user} = require("../../models")

// import package here
const Joi = require("joi")

exports.register = async (req, res) => {
  // code here
  try {
    
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().min(5).required(),
      password: Joi.string().min(4).required()
    })
  
    const {error} = schema.validate(req.body)
  
    if(error){
      return res.status(400).send({
        error: {
          message: error.details[0].message
        }
      })
    }

    const userExist = await user.findOne({
      where: { 
        email: req.body.email
      }
    })

    console.log(userExist);

    if(userExist){
      return res.status(400).send({
        status: "failed",
        message: "Email sudah terdaftar"
      })
    }

    const newUser = await user.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        status: "custommer"
    })

    res.status(201).send({
      status: "success",
      message: "register success",
      data: {
        name: newUser.name,
        email: newUser.email
      }
    })

  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "server error"
    })
  }

};

exports.login = async (req, res) => {
  // code here
  try {

    const schema = Joi.object({
      email: Joi.string().email().min(5).required(),
      password: Joi.string().min(4).required()
    })
  
    const {error} = schema.validate(req.body)
    
    if(error){
      return res.status(400).send({
        error: {
          message: error.details[0].message
        }
      })
    }


    const userExist = await user.findOne({
      where: { 
        email: req.body.email
      }
    })

    console.log(userExist);

    if(!userExist){
      return res.status(400).send({
        status: "failed",
        message: "Email belum terdaftar"
      })
    }

    if(userExist.password !== req.body.password){
      return res.status(400).send({
        status: "failed",
        message: "Password salah"
      })
    }

    res.status(200).send({
      status: "success",
      data: {
        name: userExist.name,
        email: userExist.email
      }
    })

  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "server error"
    })
  }

};
