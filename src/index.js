import  {intro,outro,text,select,confirm,multiselect} from '@clack/prompts'
import {COMMIT_TYPES} from '../src/commits-types.js'
import colors from 'picocolors'
import { getChangedFiles, getStagedFiles, gitCommit,gitAdd} from './git.js'





intro(
    colors.inverse(`Asistente para la creacion de commits por ${colors.yellow('@ivlopez03')}`)
    )


const stagedFiles = await getStagedFiles()
const changedFiles = await getChangedFiles()
console.log(stagedFiles.length)
console.log(stagedFiles)
console.log(changedFiles)
console.log(changedFiles.length)

if (stagedFiles.length >= 0 && changedFiles.length > 0){
    const files = await multiselect({
        message: colors.magenta('Selecciona los ficheros que quieres añadir al commit: '),
        options: changedFiles.map(file => ({
            value: file,
            label: file
        }))
    })
    await gitAdd({ files })
}else{
    console.log(colors.magenta('0 ficheros para agregar al stage, ya existen ficheros en el stage, procede a realizar un commit'))
    console.log(stagedFiles)
}



//try {
   // console.log(changedFiles)
//}catch(err) {
     //   outro('Error: comprueba que estas en un reporsitorio de git ')
     //   process.exit(1)
//}



const commitType = await select({
    message: colors.magenta('Selecciona el tipo de commit:'),
    options: Object.entries(COMMIT_TYPES).map(([key,value])=> ({
        value: key,
        label:`${value.emoji}  ${key.padEnd(12, ' ')} · ${value.description}`
    }))

})




const commitMsg = await text({
    message: colors.magenta('Introduce el mensaje del commit:')
})

const {emoji,release} = COMMIT_TYPES[commitType]

let breakingChange = false
if (release) {
    breakingChange = await confirm({
        initialValue: false,
        message: colors.magenta(`¿Tiene este commit cambios querompen la compatibilidad anterior?
${colors.gray('Si la respuesta es si, deberias crear un commit con el tipo "BREAKING CHANGE" y al hacer release se publicara una version major')}`)
    })
}

let commit = `${emoji} ${commitType}: ${commitMsg}`
commit = breakingChange ? `${commit} [breaking change]` : commit

const shouldContinue = await confirm({
    message: colors.magenta( `¿Quiere crear el commit con el siguiente mensaje? 
    ${colors.green(colors.bold(commit))}
    
    ¿Confirmas?`)
})

if (!shouldContinue) {
    outro(colors.yellow('No se ha creado el commit'))
    process.exit(0)
}

await gitCommit({commit})


outro(
    colors.green('✔ Commit creado con exito !Gracias por usar el asistente!')
)