module.exports = {

    reporter: require("./reporter"),

    middleware: require("./middleware"),

    formats: ['text-summary'],

    exclude: [],

    include: [
        '**/*.js'
    ],
}
