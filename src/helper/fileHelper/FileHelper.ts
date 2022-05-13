import path from "path";
import fs from "fs"

export function deleteFile(folder:string, filename:string){
    if ( fs.existsSync(path.join(folder,filename))) {
      fs.unlinkSync(path.join(folder,filename));

   }
   return filename
}
export  function deteleFileBypath(path:string){
    if ( fs.existsSync(path)) {
        fs.unlinkSync(path);
        return true;
     }
     return false;
}
//extension deve includere il .
export function getAviableName(folder:string,filename: string, extension:string){
    if (fs.existsSync(path.join(folder,filename))) {
      let i=1;
      while(true){
          let attempt = filename.replace(extension,`_(${i})${extension}`)
          let pathToTest = path.join(folder,attempt)
          if(! fs.existsSync(pathToTest)) return attempt;
          i++;
      }
    }
    return filename;
}

export function checkExist(folder:string, filename:string){
    return fs.existsSync(path.join(folder,filename))
}

export function generateName(folder:string, filename:string){
    let name = `${(new Date()).getTime()}-${filename}`
    return name;
}