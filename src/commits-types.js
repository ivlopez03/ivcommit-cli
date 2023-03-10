export const COMMIT_TYPES = {
    feature: {
        emoji: '๐',
        description:'Add new feature',
        release: true //Si haces un commit de este tipo , luego dberias hacer un release
    },
    fix: {
        emoji: '๐',
        description:'Submit a fix to bug',
        release: true     
    },
    performance: {
        emoji: '๐ป',
        description:'Improve performance',
        release: true
    },
    refactor: {
        emoji: '๐งฐ',
        description:'Refactor code',
        release: true
    },
    docs:{
        emoji: '๐',
        description:'Add or update documentation',
        release: false
    },
    test:{
        emoji: '๐งช',
        description:'Add or update tests',
        release: false
    },
    build: {
        emoji: '๐',
        description:'Add or update build scripts',
        release: false
    }

}
