export const COMMIT_TYPES = {
    feature: {
        emoji: '🚀',
        description:'Add new feature',
        release: true //Si haces un commit de este tipo , luego dberias hacer un release
    },
    fix: {
        emoji: '🐛',
        description:'Submit a fix to bug',
        release: true     
    },
    performance: {
        emoji: '💻',
        description:'Improve performance',
        release: true
    },
    refactor: {
        emoji: '🧰',
        description:'Refactor code',
        release: true
    },
    docs:{
        emoji: '📃',
        description:'Add or update documentation',
        release: false
    },
    test:{
        emoji: '🧪',
        description:'Add or update tests',
        release: false
    },
    build: {
        emoji: '🌌',
        description:'Add or update build scripts',
        release: false
    }

}
