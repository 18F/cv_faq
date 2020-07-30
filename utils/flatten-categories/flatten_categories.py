#!/bin/env python
import os.path
from io import BytesIO
from pathlib import Path

import frontmatter


CONTENT_DIR = os.path.abspath(os.path.join(__file__, '../../../_content'))


if __name__ == '__main__':
    for path in Path(CONTENT_DIR).rglob('**/*.md'):
        post = frontmatter.load(path)
        redirect_from = post.get('redirect_from', [])

        # If a string, normalize to an array
        if type(redirect_from) == str:
            redirect_from = [redirect_from]

        category = path.parts[-2]
        slug = path.parts[-1].split('.md')[0]
        redirect_from += [f'/{category}/{slug}/']
        post['redirect_from'] = redirect_from

        # Overwrite the source file with updated frontmatter
        with open(path, 'wb') as outfile:
            f = BytesIO()
            frontmatter.dump(post, f)
            outfile.write(f.getbuffer())
