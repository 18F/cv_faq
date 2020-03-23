require 'bundler/setup'
require 'html-proofer'

require_relative './htmlproofer/target_blank_checks.rb'

desc 'Run HTMLProofer w/ custom plugins'
task :htmlproof do

  HTMLProofer.check_directory("./_site",
                              {:empty_alt_ignore => true}).run
end
