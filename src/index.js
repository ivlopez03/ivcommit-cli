import  {intro,outro,text,select,confirm,multiselect,isCancel} from '@clack/prompts'
import {COMMIT_TYPES} from '../src/commits-types.js'
import colors from 'picocolors'
import { getChangedFiles, getStagedFiles, gitCommit,gitAdd} from './git.js'





intro(
    colors.inverse(`Asistente para la creacion de commits por ${colors.yellow('@ivlopez03')}`)
    )


const stagedFiles = await getStagedFiles()
const changedFiles = await getChangedFiles()


try {
    if (changedFiles.length > 0 || stagedFiles.length > 0) {
        if (stagedFiles.length === 0 && changedFiles.length > 0){
            const files = await multiselect({
                message: colors.magenta('Selecciona los ficheros que quieres añadir al commit: '),
                options: changedFiles.map(file => ({
                    value: file,
                    label: file
                }))
            })

            if (isCancel(files)) {
                outro(colors.yellow('Se ha cancelado el commit'))
                process.exit(0)
            }


            await gitAdd({ files })
        }else{

            const stagedTableFiles = Array.from(stagedFiles, x => [x])
            console.log(colors.magenta(`${colors.yellow(stagedFiles.length)} fichero en el stage. Procede a realizar el commit`))
            console.table(stagedTableFiles)
        }
    }
    
} catch (error) {
    outro(colors.red('Error: comprueba que estas en un reporsitorio de git '))
    process.exit(1)
    
}


const commitType = await select({
    message: colors.magenta('Selecciona el tipo de commit:'),
    options: Object.entries(COMMIT_TYPES).map(([key,value])=> ({
        value: key,
        label:`${value.emoji}  ${key.padEnd(12, ' ')} · ${value.description}`
    }))
})

if (isCancel(commitType)) {
    outro(colors.yellow('Se ha cancelado el commit'))
    process.exit(0)
}


const commitMsg = await text({
    message: colors.magenta('Introduce el mensaje del commit:'),
    validate: (value) => {
        if (value.length === 0) {
            return colors.red('El mensaje no puede estar vacio')
        }

        if (value.length > 60) {
            return colors.red('El mensaje no puede contener mas de 60 caracteres')
        }
    }
})

const {emoji,release} = COMMIT_TYPES[commitType]

if (isCancel(commitMsg)) {
    outro(colors.yellow('Se ha cancelado el commit'))
    process.exit(0)
}


let breakingChange = false
if (release) {
    breakingChange = await confirm({
        initialValue: false,
        message: colors.magenta(`¿Tiene este commit cambios que rompen la compatibilidad anterior?
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