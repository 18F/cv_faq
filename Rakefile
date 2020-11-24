require 'bundler/setup'
require 'html-proofer'

require_relative './htmlproofer/target_blank_checks.rb'

desc 'Run HTMLProofer w/ custom plugins'
task :htmlproof do
  check_links(true)
end

desc 'Run HTMLProofer w/ custom plugins'
task :htmlproofexternal do
  check_links(false)
end

def check_links(disable_external)
  HTMLProofer.check_directory("./_site", {
    empty_alt_ignore: true,
    enforce_https: true,
    disable_external: disable_external,
    url_ignore: [
      # Ignore Twitter URLs - they tend to rate-limit CircleCI jobs
      /^https:\/\/twitter.com\/.+/
    ],
    url_swap: {
      # treat urls to faq.coronavirus.gov as local
      'https://faq.coronavirus.gov' => ''
    },
    :typhoeus => {
      :connecttimeout => 30,
      :timeout => 60
    },
    :hydra => {
      :max_concurrency => 10
    }
  }).run
end
