#!/bin/env python

import json

import click

import search_gov


@click.command()
@click.argument('input_json_file', type=click.File('r'))
def get_query_counts(input_json_file):
    """
    For each keyword in the array defined in `input_json_file`, do a search.gov
    query and output the results count to a JSON document writen to stdout.
    """


    keywords = json.loads(input_json_file.read())
    results_counts = search_gov.get_all_result_counts(keywords)
    click.echo(json.dumps(results_counts, indent=4))


if __name__ == '__main__':
    get_query_counts()
