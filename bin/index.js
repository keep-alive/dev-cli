#!/usr/bin/env node
const {program} = require('commander');
const { generate } = require('../src/generate');
program
  .command('create [project]')
  .description('generator a new project')
  .action(function(project){
    generate(project);
  });

program.parse(process.argv)