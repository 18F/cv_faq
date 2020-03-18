require 'yaml'

NETLIFY_CONFIG_DEST_DIR = File.join('_site', 'admin')
NETLIFY_CONFIG_SOURCE_DIR = 'admin'

SITE_CATEGORIES_DIR = '_categoreis'

Jekyll::Hooks.register :site, :post_write do |site|
  collections = site.collections['content'].docs
    .map { |doc| doc.relative_path.split('/')[0..-2].join('/') }
    .uniq
    .map do |path|
      {
        'label' => path.split('/')[1..].join(' | ').gsub(/-/, ' ').capitalize(),
        'name' => path.split('/')[1..].join('--'),
        'folder' => path,
        'create' => true,
        'slug' => '{{slug}}',
        'fields' => [
          {'label' => 'Layout', 'name' => 'layout', 'widget' => 'hidden', 'default' => 'post'},
          {'label' => 'Title', 'name' => 'title', 'widget' => 'string'},
          {'label' => 'Category', 'name' => 'category', 'widget' => 'string'},
          {'label' => 'Source name', 'name' => 'source', 'widget' => 'string'},
          {'label' => 'Source link', 'name' => 'source_url', 'widget' => 'string'},
          {'label' => 'Promoted', 'name' => 'promoted', 'widget' => 'boolean', 'default' => false},
          {
            'label' => 'Publish Date',
            'name' => 'date',
            'widget' => 'datetime',
            'format' => 'MMMM D, YYYY',
            'dateFormat' => 'MMMM D, YYYY',
            'timeFormat' => false
          },
          {'label' => 'Excerpt', 'name' => 'excerpt', 'widget' => 'string'},
          {'label' => 'Body', 'name' => 'body', 'widget' => 'markdown'}
        ]
      }
    end
  
  
  config = {}
  File.open(File.join(NETLIFY_CONFIG_SOURCE_DIR, 'config.yml')) { |file| config = YAML.load(file) }
  config['collections'] = config['collections'] + collections
  File.open("#{NETLIFY_CONFIG_DEST_DIR}/config.yml", 'w') { |file| file.write(config.to_yaml) }
end