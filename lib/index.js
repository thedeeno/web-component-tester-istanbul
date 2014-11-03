module.exports = {

    listener: require("./listener"),

    middleware: require("./middleware"),

    formats: ['text-summary'],

    dir: './coverage',

    exclude: [],

    include: [
        '**/*.js'
    ],
}
