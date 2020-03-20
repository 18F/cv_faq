require 'yaml'

SEP = File::SEPARATOR

SOURCE_DIR = 'admin'
SOURCE_CONFIG = File.join(SOURCE_DIR, '_config.yml')
SOURCE_TEMPLATE = File.join(SOURCE_DIR, '_content_collection_template.yml')

DEST_DIR = File.join('_site', 'admin')
DEST_CONFIG = File.join(DEST_DIR, 'config.yml')

=begin
Generates Netlify CMS configuration for the _content collection using the
template in admin/_content_collection_template.

This iterates over all documents found in the `content` collection and
generates a `collection` for each unique subdirectory in _content.
=end

Jekyll::Hooks.register :site, :post_write do |site|
  template = load_yaml(SOURCE_TEMPLATE)

  categories = site.collections['categories'].docs
  collections = site.collections['content'].docs
    .map { |doc| doc.relative_path.split(SEP)[0..-2].join(SEP) }
    .uniq
    .map do |path|
      stripped_path_parts = path.split(SEP)[1..]
      template.merge({
        'label' => make_label(stripped_path_parts, categories),
        'name' => stripped_path_parts.join('--'),
        'folder' => path,
      })
    end
  
  config = load_yaml(SOURCE_CONFIG)
  config['collections'] = config['collections'] + collections
  dump_yaml(DEST_CONFIG, config)
end

def load_yaml(path)
  yaml = {}
  File.open(path) { |file| yaml = YAML.load(file) }
  yaml
end

def dump_yaml(path, hash)
  File.open(path, 'w') { |file| file.write(hash.to_yaml) }
end

def find_owner(folder_path, categories)
  return "" if folder_path.nil?
  category = categories.find { |category| category.data['name'] == folder_path }
  "Owner: #{category.data['owner']} "
end

def make_label(paths, categories)
  owner = find_owner(paths.first, categories)
  owner + "Category: " + paths.join(' | ').gsub(/-/, ' ').capitalize()
end