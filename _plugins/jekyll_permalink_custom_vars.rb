module Jekyll
  class JekyllPermalinkCustomVars < Generator
    def generate(site)
      site.posts.docs.each do |post|
        post.data['permalink'] = site.config['permalink'].dup unless post.data.key?('permalink')

        site.config['permalink_custom_vars'].each do |var|
          post.data['permalink'].gsub! ":#{var}", post.data[var].to_s or ''
        end
      end
    end
  end
end
