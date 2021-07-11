#!/usr/bin/env node

/**
 * @file index.js
 * Tool configuration.
 * @see https://www.npmjs.com/package/commander
 */
const commander = require('commander')
const path = require('path')
const colors = require('colors')
const { exec } = require('child_process')

// Local
const constants = require('./constants')

// Create the program
const program = new commander.Command()

const scriptPrefix = 'scaffold'

program.version(constants.getPackageVersion())

program
  .name('foldit')
  .option('-d, --debug', 'output extra debugging')
  .option('-api, --api <name>', 'an API page component')
  .option('-app, --app <name>', 'an _app page component')
  .option('-t, --path <name>', 'path for the item')
  .option('-c, --component <name>', 'a stateless component')
  .option('-x, --context <name>', 'a context component')
  .option('-p, --page <name>', 'a page component')
  .option('-s, --story <name>', 'a Storybook component')

program.parse(process.argv)

console.log(colors.blue('\n-------------------------------'))
console.log(colors.blue('--- NextJS Scaffold Details ---'))
console.log(colors.blue('-------------------------------\n'))

if (program.debug) console.log(program.opts())

/**
 * runScript
 * @param {string} name name of the script (minus the separator and the name)
 * @param {string} options options to pass to the script
 * @param {string} sep space separator in script name. Defaults to '-'
 */
const runScript = function (name, options, ignoreName = false, sep = '-') {
  let finalExec = `node ${path.resolve(
    __dirname,
    `${scriptPrefix}${sep}${name}`
  )} --path ${options[0]} --name ${options[1]}`
  if (ignoreName) {
    finalExec = `node ${path.resolve(
      __dirname,
      `${scriptPrefix}${sep}${name}`
    )}`
  }
  console.log('Executing command...', finalExec)
  return exec(finalExec, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })
}

// Build an API component
if (program.api) runScript('api-component', [program.path, program.api])

// Build an _app component
if (program.api) runScript('app', [program.path, program.app])

// Build a stateless component
if (program.component) runScript('component', [program.path, program.component])

// Build a context component
if (program.context) runScript('context', [program.path, program.context])

// Build a page component
if (program.page) runScript('page-component', [program.path, program.page])

// Build a story component
if (program.story) runScript('stories', [program.path, program.story])
