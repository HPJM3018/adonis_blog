 import User from '#models/user'
import { registerUserValidator } from '#validators/auth'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class AuthController {
  register({view}: HttpContext) {
    return view.render('pages/auth/register')
  }

  async handleRegister({request, session,response}: HttpContext){
      const {email, password, thumbnail, username} = await request.validateUsing(registerUserValidator)
      if(!thumbnail){}
      else{
        await thumbnail.move(app.makePath("public/users"), {name : '${cuid()}.$thumbnail.extname'})

      }
      const filePath = 'users/${thumbnail?.fileName}'
      await User.create({email, username,thumbnail: filePath, password})
      session.flash("Success","Inscription ok !!!")
      return response.redirect().toRoute("home")
  }
  login ({view}: HttpContext) {
    return view.render('pages/auth/login')
  }
}
