module.exports = {

    listener: require("./listener"),

    middleware: require("./middleware"),

    reporters: ['text-summary'],

    dir: './coverage',

    exclude: [],

    include: [
        '**/*.js'
    ],
}
