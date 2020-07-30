import os.path
from collections import defaultdict
from io import BytesIO
from pathlib import Path
from typing import Dict, List

import frontmatter
import yaml


CONTENT_DIR = os.path.abspath(os.path.join(__file__, '../../../_content'))
CATEGORY_DIR = os.path.abspath(os.path.join(__file__, '../../../_categories'))


def extract_categories(remove_from_question: bool):
    """
    Accumulate questions in a category dict of the form:
    {
      'category_id': [
        {'name': 'question-slug', 'title': 'question', 'is_promoted': True},
        {'name': 'question-2-slug', 'title': 'question 2', 'is_promoted': False},
      ]
    }
    In the process, remove categories and promoted attributes from the
    question's frontmatter.
    """

    categories = defaultdict(list)

    for path in Path(CONTENT_DIR).rglob('**/*.md'):
        # Parse the question content
        post = frontmatter.load(path)

        # The question slug is the basename of the file, without .md file
        # extension. We use this to identify it in the questions document.
        slug = path.parts[-1].split('.md')[0]

        for category in post['categories']:
            categories[category].append({
                'name': slug,
                'title': post['title'],
                'is_promoted': post['promoted'],
            })

        if remove_from_question:
            del post["categories"]
            del post["promoted"]

            # Overwrite the source file with updated frontmatter
            with open(path, 'wb') as outfile:
                f = BytesIO()
                frontmatter.dump(post, f)
                outfile.write(f.getbuffer())

    return categories


def sort_questions(questions):
    return sorted(
        questions,
        key=lambda q: (not q['is_promoted'], q['title'].lower())
    )


def write_category(category: str, questions: List[Dict]):
    path = os.path.join(CATEGORY_DIR, category + '.md')
    category_yaml = frontmatter.load(path)
    category_yaml['questions'] = questions

    # Overwrite the source file with updated frontmatter
    with open(path, 'wb') as outfile:
        f = BytesIO()
        frontmatter.dump(category_yaml, f)
        outfile.write(f.getbuffer())


def write_categories(categories):
    for category, questions in categories.items():
        questions = [
            question['name']
            for question in sort_questions(questions)
        ]
        write_category(category, questions)


if __name__ == '__main__':
    categories = extract_categories(True)
    write_categories(categories)
    pass
