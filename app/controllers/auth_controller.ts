 import User from '#models/user'
import { loginUserValidator, registerUserValidator } from '#validators/auth'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { dd } from '@adonisjs/core/services/dumper'
import { writeFile } from 'fs/promises'

import * as jdenticon from 'jdenticon'


export default class AuthController {
  register({view}: HttpContext) {
    return view.render('pages/auth/register')
  }

  async handleRegister({request, session,response}: HttpContext){
    console.log('before vali')
    // dd(request.all())
      const {email, password, thumbnail, username} = await request.validateUsing(registerUserValidator)

      if(!thumbnail){
        const png= jdenticon.toPng(username, 100)
        await writeFile(`public/users/${username}.png`,png,)
      }
      else{
        await thumbnail.move(app.makePath("public/users"), {name :`${cuid()}.$thumbnail.extname`})

      }
      //console.log('after val')
      const filePath =  `users/${thumbnail?.fileName || username + ".png"}`
      const res = await User.create({email, username,thumbnail: filePath, password})
      console.log(res)
      session.flash("success","Inscription ok !!!")
      return response.redirect().toRoute("auth.login")
  }
  login ({view}: HttpContext) {
    return view.render('pages/auth/login')
  }

  async handleLogin({request,auth,response,session}:HttpContext){
    const {email, password} = await request.validateUsing(loginUserValidator)
    const user = await User.verifyCredentials(email, password)
    await auth.use("web").login(user)
    session.flash("success","Connexion ok !!!")
    return response.redirect().toRoute("home")
  }

  async logout({auth,session,response,}: HttpContext)
  {
    auth.use("web").logout()
    session.flash("success","Déconnexion ok !!!")
    return response.redirect().toRoute("auth.login")
  }
}
