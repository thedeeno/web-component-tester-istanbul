module.exports = {

    reporter: require("./reporter"),

    middleware: require("./middleware"),

    formats: ['text-summary'],

    dir: './coverage',

    exclude: [],

    include: [
        '**/*.js'
    ],
}
