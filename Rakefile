require 'bundler/setup'
require 'html-proofer'

require_relative './htmlproofer/target_blank_checks.rb'

desc 'Run HTMLProofer w/ custom plugins'
task :htmlproof do

  HTMLProofer.check_directory("./_site", {
    empty_alt_ignore: true,
    verbose: true,
    url_swap: {
      # treat urls to faq.coronavirus.gov as local
      'https://faq.coronavirus.gov' => ''
    },
    # Cache with a short time frame;
    # This will avoid duplicate requests for URLs in the footer.
    :cache => {
      :timeframe => '1h'
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
