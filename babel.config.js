module.exports = {
  "presets": [
		"@babel/preset-env",
    "@babel/preset-react"
 ],
 env: {
    test: {
      plugins: [
        '@babel/plugin-proposal-class-properties',
      ]
    }
 },
  "plugins": [
    "transform-regenerator",
  ]
};
