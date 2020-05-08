module Jekyll
  class GitBranchNameGenerator < Generator
    def generate(site)
      site.config['git_branch'] = `git rev-parse --abbrev-ref HEAD`.strip
    end
  end
end
