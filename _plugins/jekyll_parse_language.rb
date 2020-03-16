module Jekyll
  class JekyllParseLanguage < Generator
    def generate(site)
      site.posts.docs.each do |post|
        matches = post.basename_without_ext.match(/^(.*)\.lang-([A-z]{2})$/)
        if matches
          post.data['slug'] = matches[1]
          post.data['lang'] = matches[2]
        end
      end
    end
  end
end
