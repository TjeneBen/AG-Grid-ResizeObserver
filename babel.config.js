module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "corejs": 3,
        "useBuiltIns": "usage"
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    // "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
    // "@babel/plugin-transform-runtime",
    // "@babel/plugin-transform-async-to-generator",
    // "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-syntax-dynamic-import"
  ]
}
