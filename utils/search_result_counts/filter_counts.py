#!/bin/env python

import json
import sys

import click

import search_gov


@click.command()
@click.argument(
    'input_json_file',
    type=click.File('r'),
    default=sys.stdin
)
@click.option('--min-count', type=int)
def filter_counts(input_json_file, min_count):
    """
    Takes a file in the format outputted by `./search_result_count.py` and

    """

    keyword_counts = json.loads(input_json_file.read())

    filtered_keywords = [
        keyword
        for keyword, counts in keyword_counts.items()
        if search_gov.get_total_results_count(counts) > min_count
    ]

    click.echo(json.dumps(filtered_keywords, indent=4, sort_keys=True))


if __name__ == '__main__':
    filter_counts()
