from populate_category_lists_yaml import sort_questions


def test_sort_questions():
    assert sort_questions([
        {'is_promoted': True, 'name': 'ddd-name', 'title': 'ddd-name'},
        {'is_promoted': False, 'name': 'aaa-name', 'title': 'aaa-name'},
        {'is_promoted': False, 'name': 'ccc-name', 'title': 'ccc-name'},
        {'is_promoted': False, 'name': 'ddd-name', 'title': 'ddd-name'},
        {'is_promoted': True, 'name': 'aaa-name', 'title': 'aaa-name'},
        {'is_promoted': False, 'name': 'bbb-name', 'title': 'bbb-name'},
    ]) == [
        {'is_promoted': True, 'name': 'aaa-name', 'title': 'aaa-name'},
        {'is_promoted': True, 'name': 'ddd-name', 'title': 'ddd-name'},
        {'is_promoted': False, 'name': 'aaa-name', 'title': 'aaa-name'},
        {'is_promoted': False, 'name': 'bbb-name', 'title': 'bbb-name'},
        {'is_promoted': False, 'name': 'ccc-name', 'title': 'ccc-name'},
        {'is_promoted': False, 'name': 'ddd-name', 'title': 'ddd-name'},
    ]
