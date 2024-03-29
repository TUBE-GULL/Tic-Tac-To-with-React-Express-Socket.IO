import path from 'path';

// for linux
//=======================================================================================

// const getAbsolutePath = (relativePath) => {
//    const currentDir = new URL('.', import.meta.url).pathname;
//    return path.join(currentDir, '..', relativePath);
// }

// for window
//=======================================================================================

function getAbsolutePath(relativePath: string): string {
   // return path.join(new URL(relativePath, import.meta.url).pathname).substring(1);  
   return path.resolve(relativePath);
}

export default getAbsolutePath 