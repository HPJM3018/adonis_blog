import * as jdenticon from 'jdenticon'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { writeFile } from 'fs/promises'
export class FileUploaderService {
  async upload (thumbnail : MultipartFile | undefined, identiconName : string, path : string){
    if(!thumbnail){
      const png= jdenticon.toPng(identiconName, 100)
      await writeFile(`public/${path}/${identiconName}.png`,png,)
    }
    else{
      await thumbnail.move(app.makePath("public/users"), {name :`${cuid()}.$thumbnail.extname`})

    }
    //console.log('after val')
    const filePath =  `users/${thumbnail?.fileName || identiconName + ".png"}`
  }
}
