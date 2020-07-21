#!/bin/env python

import json
from datetime import timedelta

import click
import requests_cache

import search_gov


@click.command()
@click.argument('input_json_file', type=click.File('r'))
@click.option('--cache/--no-cache', default=True)
def get_query_counts(input_json_file, cache):
    """
    For each keyword in the array defined in `input_json_file`, do a search.gov
    query and output the results count to a JSON document writen to stdout.
    """

    if cache:
        requests_cache.install_cache(
            'search_gov_cache',
            expire_after=timedelta(days=1)
        )

    keywords = json.loads(input_json_file.read())
    results_counts = search_gov.get_all_result_counts(keywords)
    click.echo(json.dumps(results_counts, indent=4, sort_keys=True))


if __name__ == '__main__':
    get_query_counts()
